import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { db } from '../src/lib/db';
import {
  brands,
  genders,
  sizes,
  colors,
  categories,
  collections,
  products,
  productVariants,
  productImages,
  productCollections,
} from '../src/lib/db/schema';

type IdMap = {
  brandId: string;
  genderIds: Record<string, string>;
  sizeIds: Record<string, string>;
  colorIds: Record<string, string>;
  categoryIds: Record<string, string>;
  collectionIds: Record<string, string>;
};

async function ensureUploads() {
  const srcDir = path.resolve(process.cwd(), 'public', 'shoes');
  const destDir = path.resolve(process.cwd(), 'static', 'uploads', 'shoes');
  fs.mkdirSync(destDir, { recursive: true });

  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  }
  return { destDir, files: fs.readdirSync(destDir) };
}

async function seedFiltersAndMeta(): Promise<IdMap> {
  console.log('Seeding brands, genders, sizes, colors, categories, collections...');

  const [{ id: brandId }] = await db.insert(brands).values({
    id: randomUUID(),
    name: 'Nike',
    slug: 'nike',
    logoUrl: '/logo.svg',
  }).returning({ id: brands.id });

  const genderData = [
    { label: 'Men', slug: 'men' },
    { label: 'Women', slug: 'women' },
    { label: 'Kids', slug: 'kids' },
  ];
  const genderRows = await db.insert(genders).values(
    genderData.map(g => ({ id: randomUUID(), label: g.label, slug: g.slug }))
  ).returning({ id: genders.id, slug: genders.slug });
  const genderIds = Object.fromEntries(genderRows.map(r => [r.slug, r.id]));

  const sizeData = ['7','8','9','10','11','12'].map((n, i) => ({ name: n, slug: n.toLowerCase(), sortOrder: i }));
  const sizeRows = await db.insert(sizes).values(
    sizeData.map(s => ({ id: randomUUID(), ...s }))
  ).returning({ id: sizes.id, slug: sizes.slug });
  const sizeIds = Object.fromEntries(sizeRows.map(r => [r.slug, r.id]));

  const colorData = [
    { name: 'Black', slug: 'black', hexCode: '#000000' },
    { name: 'White', slug: 'white', hexCode: '#FFFFFF' },
    { name: 'Red', slug: 'red', hexCode: '#FF0000' },
    { name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
    { name: 'Green', slug: 'green', hexCode: '#00FF00' },
    { name: 'Grey', slug: 'grey', hexCode: '#808080' },
  ];
  const colorRows = await db.insert(colors).values(
    colorData.map(c => ({ id: randomUUID(), ...c }))
  ).returning({ id: colors.id, slug: colors.slug });
  const colorIds = Object.fromEntries(colorRows.map(r => [r.slug, r.id]));

  const categoryData = [
    { name: 'Shoes', slug: 'shoes' },
    { name: 'Running', slug: 'running', parentSlug: 'shoes' },
    { name: 'Basketball', slug: 'basketball', parentSlug: 'shoes' },
    { name: 'Lifestyle', slug: 'lifestyle', parentSlug: 'shoes' },
  ];

  const rootShoesId = randomUUID();
  await db.insert(categories).values({ id: rootShoesId, name: 'Shoes', slug: 'shoes' });
  const catRows = [
    { id: randomUUID(), name: 'Running', slug: 'running', parentId: rootShoesId },
    { id: randomUUID(), name: 'Basketball', slug: 'basketball', parentId: rootShoesId },
    { id: randomUUID(), name: 'Lifestyle', slug: 'lifestyle', parentId: rootShoesId },
  ];
  await db.insert(categories).values(catRows);
  const categoryIds = {
    shoes: rootShoesId,
    running: catRows[0].id,
    basketball: catRows[1].id,
    lifestyle: catRows[2].id,
  };

  const collectionData = [
    { name: "Summer '25", slug: 'summer-25' },
    { name: 'Best Sellers', slug: 'best-sellers' },
  ];
  const collectionRows = await db.insert(collections).values(
    collectionData.map(c => ({ id: randomUUID(), ...c }))
  ).returning({ id: collections.id, slug: collections.slug });
  const collectionIds = Object.fromEntries(collectionRows.map(r => [r.slug, r.id]));

  console.log('Seeded meta tables.');
  return { brandId, genderIds, sizeIds, colorIds, categoryIds, collectionIds };
}

function pick<T>(arr: T[], n: number) {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

async function seedProducts(meta: IdMap, uploadDir: string, files: string[]) {
  console.log('Seeding products, variants, and images...');
  const productSpecs = [
    { name: 'Nike Air Max 270', slug: 'air-max-270', category: 'lifestyle' },
    { name: 'Nike Air Force 1', slug: 'air-force-1', category: 'lifestyle' },
    { name: 'Nike Pegasus 41', slug: 'pegasus-41', category: 'running' },
    { name: 'Nike Invincible 3', slug: 'invincible-3', category: 'running' },
    { name: 'Nike Vaporfly 3', slug: 'vaporfly-3', category: 'running' },
    { name: 'Nike Alphafly 3', slug: 'alphafly-3', category: 'running' },
    { name: 'Nike Zoom Freak', slug: 'zoom-freak', category: 'basketball' },
    { name: 'Nike LeBron', slug: 'lebron', category: 'basketball' },
    { name: 'Nike KD', slug: 'kd', category: 'basketball' },
    { name: 'Nike GT Cut', slug: 'gt-cut', category: 'basketball' },
    { name: 'Nike Cortez', slug: 'cortez', category: 'lifestyle' },
    { name: 'Nike Dunk Low', slug: 'dunk-low', category: 'lifestyle' },
    { name: 'Nike Blazer Mid', slug: 'blazer-mid', category: 'lifestyle' },
    { name: 'Nike Air Huarache', slug: 'air-huarache', category: 'lifestyle' },
    { name: 'Nike React Infinity Run', slug: 'react-infinity-run', category: 'running' },
  ];

  const imagePaths = files.filter(f => f.startsWith('shoe-')).map(f => `/static/uploads/shoes/${f}`);

  for (const spec of productSpecs) {
    const productId = randomUUID();
    const genderKey = pick(Object.keys(meta.genderIds), 1)[0];
    const p = await db.insert(products).values({
      id: productId,
      name: spec.name,
      description: `${spec.name} high-performance Nike footwear.`,
      categoryId: meta.categoryIds[spec.category],
      genderId: meta.genderIds[genderKey],
      brandId: meta.brandId,
      isPublished: true,
    }).returning({ id: products.id });

    const colorKeys = pick(Object.keys(meta.colorIds), 2 + Math.floor(Math.random() * 2));
    const sizeKeys = pick(Object.keys(meta.sizeIds), 3 + Math.floor(Math.random() * 3));
    let defaultVariantId: string | null = null;

    for (const colorKey of colorKeys) {
      for (const sizeKey of sizeKeys) {
        const variantId = randomUUID();
        const sku = `${spec.slug}-${colorKey}-${sizeKey}-${variantId.slice(0, 6)}`.toUpperCase();
        const base = 100 + Math.floor(Math.random() * 80);
        const price = (base + (Math.random() < 0.5 ? 0 : 20)).toFixed(2);
        const sale = Math.random() < 0.3 ? (base - 10).toFixed(2) : null;

        await db.insert(productVariants).values({
          id: variantId,
          productId: p[0].id,
          sku,
          price,
          salePrice: sale ?? undefined,
          colorId: meta.colorIds[colorKey],
          sizeId: meta.sizeIds[sizeKey],
          inStock: 5 + Math.floor(Math.random() * 20),
        });

        const imgs = pick(imagePaths, 2);
        let order = 0;
        for (const img of imgs) {
          await db.insert(productImages).values({
            id: randomUUID(),
            productId: p[0].id,
            variantId,
            url: img,
            colorId: meta.colorIds[colorKey],
            sortOrder: order++,
            isPrimary: order === 1,
          });
        }

        if (!defaultVariantId) defaultVariantId = variantId;
      }
    }

    if (defaultVariantId) {
      const { eq } = await import('drizzle-orm');
      await db.update(products).set({ defaultVariantId }).where(eq(products.id, p[0].id));
    }

    const assignCollections = pick(Object.values(meta.collectionIds), 1 + Math.floor(Math.random() * 2));
    for (const collId of assignCollections) {
      await db.insert(productCollections).values({
        id: randomUUID(),
        productId: p[0].id,
        collectionId: collId,
      });
    }

    console.log(`Seeded product: ${spec.name}`);
  }
}

async function seed() {
  try {
    console.log('Seeding started...');
    const { destDir, files } = await ensureUploads();
    const meta = await seedFiltersAndMeta();
    await seedProducts(meta, destDir, files);
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
