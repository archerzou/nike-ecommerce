"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

export type Variant = {
  id: string;
  colorName: string;
  swatchHex: string;
  images: { src: string; alt: string }[];
};

type Ctx = {
  variants: Variant[];
  variantIndex: number;
  setVariantIndex: (i: number) => void;
};
const GalleryCtx = createContext<Ctx | null>(null);

function Provider({ variants, children }: { variants: Variant[]; children: React.ReactNode }) {
  const validVariants = useMemo(
    () =>
      variants
        .map((v) => ({
          ...v,
          images: v.images.filter((img) => typeof img.src === "string" && img.src.trim().length > 0),
        }))
        .filter((v) => v.images.length > 0),
    [variants]
  );
  const [variantIndex, setVariantIndex] = useState(0);
  return (
    <GalleryCtx.Provider value={{ variants: validVariants, variantIndex, setVariantIndex }}>
      {children}
    </GalleryCtx.Provider>
  );
}

function useGallery() {
  const ctx = useContext(GalleryCtx);
  if (!ctx) throw new Error("ProductGallery components must be used within ProductGallery.Provider");
  return ctx;
}

function View() {
  const { variants, variantIndex } = useGallery();
  const allImages = variants[variantIndex]?.images ?? [];
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [variantIndex]);

  const hasImages = allImages.length > 0;
  const current = hasImages ? allImages[Math.min(imageIndex, allImages.length - 1)] : null;

  const onPrev = useCallback(() => {
    setImageIndex((i) => (i - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);
  const onNext = useCallback(() => {
    setImageIndex((i) => (i + 1) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!hasImages) return;
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasImages, allImages.length, onPrev, onNext]);

  return (
    <div className="grid grid-cols-[72px_1fr] gap-4 lg:grid-cols-[96px_1fr]">
      <aside aria-label="Thumbnails" className="flex max-h-[560px] flex-col gap-2 overflow-auto">
        {allImages.map((img, idx) => (
          <button
            key={`${img.src}-${idx}`}
            onClick={() => setImageIndex(idx)}
            aria-label={`Show image ${idx + 1}`}
            className={`relative aspect-square overflow-hidden rounded-lg ring-1 ring-light-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-500 ${
              idx === imageIndex ? "ring-dark-500" : ""
            }`}
          >
            <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 80px, 64px" className="object-cover" />
          </button>
        ))}
      </aside>

      <div className="relative rounded-xl bg-light-200">
        {current ? (
          <>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="(min-width: 1280px) 720px, (min-width:1024px) 560px, 100vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-4">
              <button
                aria-label="Previous image"
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-light-100 ring-1 ring-light-300"
                onClick={onPrev}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                aria-label="Next image"
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-light-100 ring-1 ring-light-300"
                onClick={onNext}
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-light-200">
            <ImageOff className="h-10 w-10 text-dark-500" aria-hidden />
          </div>
        )}
      </div>
    </div>
  );
}

function Swatches() {
  const { variants, variantIndex, setVariantIndex } = useGallery();
  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((v, i) => {
        const first = v.images[0];
        return (
          <button
            key={v.id}
            onClick={() => setVariantIndex(i)}
            className={`relative h-14 w-20 overflow-hidden rounded-md ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-500 ${
              i === variantIndex ? "ring-dark-500" : "ring-light-300"
            }`}
            aria-label={v.colorName}
            title={v.colorName}
          >
            {first ? (
              <Image src={first.src} alt={first.alt} fill sizes="80px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-light-200">
                <ImageOff className="h-5 w-5 text-dark-500" aria-hidden />
              </div>
            )}
            {i === variantIndex && <Check className="absolute right-1 top-1 h-4 w-4 text-light-100" aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}

const ProductGallery = { Provider, View, Swatches };
export default ProductGallery;
