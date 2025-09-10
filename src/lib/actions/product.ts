"use server";

import { db } from "@/lib/db/index";
import {
  products,
  productVariants,
  productImages,
  brands,
  categories,
} from "@/lib/db/schema/index";
import { genders } from "@/lib/db/schema/filters/genders";
import { colors } from "@/lib/db/schema/filters/colors";
import { sizes } from "@/lib/db/schema/filters/sizes";
import {
  and,
  or,
  ilike,
  eq,
  inArray,
  sql,
  asc,
  desc,
} from "drizzle-orm";
import type { NormalizedProductFilters } from "@/lib/utils/query";

export type ListProduct = {
  id: string;
  name: string;
  minPrice: number | null;
  maxPrice: number | null;
  imageUrls: string[];
  brand?: { id: string; name: string; slug: string } | null;
  category?: { id: string; name: string; slug: string } | null;
  gender?: { id: string; label: string; slug: string } | null;
};

function buildWhere(filters: NormalizedProductFilters) {
  const {
    search,
    brandSlugs,
    categorySlugs,
    genderSlugs,
    colorSlugs,
    sizeSlugs,
    priceMin,
    priceMax,
    priceRanges,
  } = filters;

  const conds: unknown[] = [eq(products.isPublished, true)];

  if (search) {
    conds.push(
      or(
        ilike(products.name, `%${search}%`),
        ilike(products.description, `%${search}%`)
      )
    );
  }

  if (brandSlugs.length) conds.push(inArray(brands.slug, brandSlugs));
  if (categorySlugs.length) conds.push(inArray(categories.slug, categorySlugs));
  if (genderSlugs.length) conds.push(inArray(genders.slug, genderSlugs));

  if (colorSlugs.length) conds.push(inArray(colors.slug, colorSlugs));
  if (sizeSlugs.length) conds.push(inArray(sizes.slug, sizeSlugs));

  const priceExpr = sql`COALESCE(${productVariants.salePrice}, ${productVariants.price})::numeric`;
  const priceConds: unknown[] = [];
  if (priceMin !== undefined) priceConds.push(sql`${priceExpr} >= ${priceMin}`);
  if (priceMax !== undefined) priceConds.push(sql`${priceExpr} <= ${priceMax}`);
  for (const [min, max] of priceRanges) {
    if (min !== undefined && max !== undefined) {
      priceConds.push(sql`(${priceExpr} BETWEEN ${min} AND ${max})`);
    } else if (min !== undefined) {
      priceConds.push(sql`${priceExpr} >= ${min}`);
    } else if (max !== undefined) {
      priceConds.push(sql`${priceExpr} <= ${max}`);
    }
  }
  if (priceConds.length) conds.push(or(...priceConds));

  return and(...conds);
}

function buildOrder(sort: NormalizedProductFilters["sort"]) {
  if (sort === "price_asc") {
    return asc(
      sql`MIN(COALESCE(${productVariants.salePrice}, ${productVariants.price}))`
    );
  }
  if (sort === "price_desc") {
    return desc(
      sql`MIN(COALESCE(${productVariants.salePrice}, ${productVariants.price}))`
    );
  }
  return desc(products.createdAt);
}

export async function getAllProducts(
  filters: NormalizedProductFilters
): Promise<{ products: ListProduct[]; totalCount: number }> {
  const where = buildWhere(filters);
  const orderBy = buildOrder(filters.sort);
  const limit = filters.limit;
  const offset = (filters.page - 1) * filters.limit;
  const hasColorFilter = filters.colorSlugs.length > 0;

  const imageFilter = hasColorFilter
    ? sql`${productImages.variantId} IS NOT NULL`
    : sql`${productImages.variantId} IS NULL`;

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      minPrice: sql<number>`MIN(COALESCE(${productVariants.salePrice}, ${productVariants.price}))`,
      maxPrice: sql<number>`MAX(COALESCE(${productVariants.salePrice}, ${productVariants.price}))`,
      imageUrls: sql<string[]>`
        COALESCE(
          ARRAY_AGG(DISTINCT ${productImages.url} ORDER BY ${productImages.isPrimary} DESC, ${productImages.sortOrder} ASC)
            FILTER (WHERE ${productImages.url} IS NOT NULL AND ${imageFilter}),
          ARRAY[]::text[]
        )
      `,
      brand: sql<{ id: string; name: string; slug: string } | null>`
        CASE WHEN ${brands.id} IS NULL THEN NULL
        ELSE json_build_object('id', ${brands.id}, 'name', ${brands.name}, 'slug', ${brands.slug}) END
      `,
      category: sql<{ id: string; name: string; slug: string } | null>`
        CASE WHEN ${categories.id} IS NULL THEN NULL
        ELSE json_build_object('id', ${categories.id}, 'name', ${categories.name}, 'slug', ${categories.slug}) END
      `,
      gender: sql<{ id: string; label: string; slug: string } | null>`
        CASE WHEN ${genders.id} IS NULL THEN NULL
        ELSE json_build_object('id', ${genders.id}, 'label', ${genders.label}, 'slug', ${genders.slug}) END
      `,
    })
    .from(products)
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(genders, eq(genders.id, products.genderId))
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .where(where)
    .groupBy(products.id, brands.id, categories.id, genders.id)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const countRes = await db
    .select({
      count: sql<number>`COUNT(DISTINCT ${products.id})`,
    })
    .from(products)
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(genders, eq(genders.id, products.genderId))
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .where(buildWhere(filters));

  const totalCount = countRes[0]?.count ?? 0;

  const out: ListProduct[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    minPrice: r.minPrice,
    maxPrice: r.maxPrice,
    imageUrls: r.imageUrls ?? [],
    brand: r.brand,
    category: r.category,
    gender: r.gender,
  }));

  return { products: out, totalCount };
}

export type FullProduct = {
  id: string;
  name: string;
  description: string;
  isPublished: boolean;
  brand?: { id: string; name: string; slug: string } | null;
  category?: { id: string; name: string; slug: string } | null;
  gender?: { id: string; label: string; slug: string } | null;
  variants: Array<{
    id: string;
    sku: string;
    price: string;
    salePrice?: string | null;
    inStock: number;
    color: { id: string; name: string; slug: string; hexCode: string };
    size: { id: string; slug: string };
  }>;
  images: string[];
};

export async function getProduct(productId: string): Promise<FullProduct | null> {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      isPublished: products.isPublished,
      brand: sql<{ id: string; name: string; slug: string } | null>`
        CASE WHEN ${brands.id} IS NULL THEN NULL
        ELSE json_build_object('id', ${brands.id}, 'name', ${brands.name}, 'slug', ${brands.slug}) END
      `,
      category: sql<{ id: string; name: string; slug: string } | null>`
        CASE WHEN ${categories.id} IS NULL THEN NULL
        ELSE json_build_object('id', ${categories.id}, 'name', ${categories.name}, 'slug', ${categories.slug}) END
      `,
      gender: sql<{ id: string; label: string; slug: string } | null>`
        CASE WHEN ${genders.id} IS NULL THEN NULL
        ELSE json_build_object('id', ${genders.id}, 'label', ${genders.label}, 'slug', ${genders.slug}) END
      `,
      variants: sql<unknown[]>`
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', ${productVariants.id},
              'sku', ${productVariants.sku},
              'price', ${productVariants.price},
              'salePrice', ${productVariants.salePrice},
              'inStock', ${productVariants.inStock},
              'color', jsonb_build_object('id', ${colors.id}, 'name', ${colors.name}, 'slug', ${colors.slug}, 'hexCode', ${colors.hexCode}),
              'size', jsonb_build_object('id', ${sizes.id}, 'slug', ${sizes.slug})
            )
          ) FILTER (WHERE ${productVariants.id} IS NOT NULL),
          '[]'::json
        )
      `,
      images: sql<string[]>`
        COALESCE(
          ARRAY_AGG(DISTINCT ${productImages.url} ORDER BY ${productImages.isPrimary} DESC, ${productImages.sortOrder} ASC)
            FILTER (WHERE ${productImages.url} IS NOT NULL),
          ARRAY[]::text[]
        )
      `,
    })
    .from(products)
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(genders, eq(genders.id, products.genderId))
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .where(eq(products.id, productId))
    .groupBy(products.id, brands.id, categories.id, genders.id);

  if (!rows.length) return null;
  const r = rows[0];

  return {
    id: r.id,
    name: r.name,
    description: r.description,
    isPublished: r.isPublished,
    brand: r.brand,
    category: r.category,
    gender: r.gender,
    variants: r.variants ?? [],
    images: r.images ?? [],
  };
}
