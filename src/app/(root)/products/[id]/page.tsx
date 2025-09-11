import React from "react";
import { Card } from "@/components";
import ProductGallery from "@/components/ProductGallery";
import SizePicker from "@/components/SizePicker";
import CollapsibleSection from "@/components/CollapsibleSection";
import { Heart, ShoppingBag } from "lucide-react";

type PageParams = { params: { id: string } };

type Variant = {
  id: string;
  colorName: string;
  swatchHex: string;
  images: { src: string; alt: string }[];
};

type MockProduct = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  compareAt?: number;
  description: string;
  specs: string[];
  variants: Variant[];
};

const MOCK_PRODUCTS: Record<string, MockProduct> = {
  "1": {
    id: "1",
    title: "Nike Air Max 90 SE",
    subtitle: "Women's Shoes",
    price: 140,
    compareAt: 170,
    description:
      "The Air Max 90 stays true to its running roots with the iconic Waffle sole. Stitched overlays and textured accents create the '90s look you love. With romantic hues, its visible Air cushioning adds comfort to your journey.",
    specs: [
      "Padded collar",
      "Foam midsole",
      "Shown: Dark Team Red/Platinum Tint/Pure Platinum/White",
      "Style: HM9451-600",
    ],
    variants: [
      {
        id: "v1",
        colorName: "Dark Team Red",
        swatchHex: "#7a1f2e",
        images: [
          { src: "/shoes/shoe-1.jpg", alt: "Main angle" },
          { src: "/shoes/shoe-2.webp", alt: "Side angle" },
          { src: "/shoes/shoe-3.webp", alt: "Top view" },
          { src: "/shoes/shoe-4.webp", alt: "Back angle" },
        ],
      },
      {
        id: "v2",
        colorName: "Pure Platinum",
        swatchHex: "#cfd3d4",
        images: [
          { src: "/shoes/shoe-5.avif", alt: "Main angle - platinum" },
          { src: "/shoes/shoe-6.avif", alt: "Side angle - platinum" },
          { src: "/shoes/shoe-7.avif", alt: "Top view - platinum" },
        ],
      },
      {
        id: "v3",
        colorName: "Black/Blue",
        swatchHex: "#0ea5e9",
        images: [
          { src: "/shoes/shoe-8.avif", alt: "Main angle - blue" },
          { src: "/shoes/shoe-9.avif", alt: "Side angle - blue" },
          { src: "/shoes/shoe-10.avif", alt: "Top view - blue" },
        ],
      },
    ],
  },
};

const YMAL: Array<{ id: string; title: string; price: number; imageSrc: string; subtitle?: string }> = [
  { id: "11", title: "Nike Air Force 1 Mid '07", price: 98.3, imageSrc: "/shoes/shoe-11.avif", subtitle: "Men's Shoes" },
  { id: "12", title: "Court Vision Low Next Nature", price: 98.3, imageSrc: "/shoes/shoe-12.avif", subtitle: "Men's Shoes" },
  { id: "13", title: "Nike Dunk Low Retro", price: 98.3, imageSrc: "/shoes/shoe-13.avif", subtitle: "Men's Shoes" },
];

export default async function ProductPage({ params }: PageParams) {
  const product: MockProduct | undefined = MOCK_PRODUCTS[params.id] ?? MOCK_PRODUCTS["1"];

  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : null;

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ProductGallery.Provider variants={product.variants}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 py-8">
          <section aria-label="Product media" className="order-1">
            <ProductGallery.View />
          </section>

          <section aria-label="Product information" className="order-2">
          <header className="mb-4">
            <h1 className="text-heading-3 text-dark-900">{product.title}</h1>
            {product.subtitle && <p className="text-body text-dark-700">{product.subtitle}</p>}
          </header>

          <div className="mb-4 flex items-center gap-3">
            <p className="text-heading-3 text-dark-900">${product.price}</p>
            {product.compareAt && (
              <>
                <span className="text-body text-dark-700 line-through">${product.compareAt}</span>
                {discount !== null && (
                  <span className="rounded-full bg-green/10 px-2 py-1 text-caption text-[--color-green]">
                    {discount}% off
                  </span>
                )}
              </>
            )}
          </div>

          <div className="mb-6">
            <ProductGallery.Swatches />
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-body-medium text-dark-900">Select Size</p>
              <button className="text-caption text-dark-700 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-500 rounded">
                Size Guide
              </button>
            </div>
            <SizePicker sizes={["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5"]} />
          </div>

          <div className="mb-6 flex flex-col gap-3">
            <button
              className="h-12 rounded-full bg-dark-900 px-6 text-light-100 text-body-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-500 inline-flex items-center justify-center gap-2"
              aria-label="Add to Bag"
              type="button"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden />
              Add to Bag
            </button>
            <button
              className="h-12 rounded-full border border-light-300 px-6 text-body-medium text-dark-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-500 inline-flex items-center justify-center gap-2"
              aria-label="Favorite"
              type="button"
            >
              <Heart className="h-5 w-5" aria-hidden />
              Favorite
            </button>
          </div>

          <div className="divide-y divide-light-300 rounded-lg border border-light-300">
            <CollapsibleSection title="Product Details" defaultOpen>
              <p className="text-body text-dark-700 mb-4">{product.description}</p>
              <ul className="list-disc pl-5 text-body text-dark-700 space-y-1">
                {product.specs.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </CollapsibleSection>
            <CollapsibleSection title="Shipping & Returns">
              <p className="text-body text-dark-700">Free standard shipping and returns on orders over $50.</p>
            </CollapsibleSection>
            <CollapsibleSection title="Reviews (0)">
              <p className="text-body text-dark-700">No reviews yet.</p>
            </CollapsibleSection>
          </div>
          </section>
        </div>
      </ProductGallery.Provider>

      <section aria-labelledby="ymal" className="py-12">
        <h2 id="ymal" className="mb-6 text-heading-3 text-dark-900">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {YMAL.map((p) => (
            <Card key={p.id} title={p.title} subtitle={p.subtitle} imageSrc={p.imageSrc} price={p.price} href={`/products/${p.id}`} />
          ))}
        </div>
      </section>
    </main>
  );
}
