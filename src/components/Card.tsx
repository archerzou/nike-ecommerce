import React from "react";

import Image from "next/image";
import Link from "next/link";

export interface CardBadge {
  text: string;
  tone?: "red" | "green" | "orange" | "dark";
}

export interface CardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  price?: string | number;
  badge?: CardBadge;
  colorCount?: number;
  href?: string;
  className?: string;
}

function badgeToneClass(tone?: CardBadge["tone"]) {
  if (tone === "red") return "text-[var(--color-red)]";
  if (tone === "green") return "text-[var(--color-green)]";
  if (tone === "orange") return "text-[var(--color-orange)]";
  return "text-[var(--color-dark-900)]";
}

export default function Card({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  price,
  badge,
  colorCount,
  href,
  className,
}: CardProps) {
  const Comp: React.ElementType = href ? Link : "div";
  const priceText = typeof price === "number" ? `$${price.toFixed(2)}` : price;

  return (
    <Comp
      href={href ?? "#"}
      className={[
        "group block overflow-hidden rounded-lg bg-[var(--color-light-100)] ring-1 ring-[var(--color-light-300)] shadow-sm hover:shadow-md transition",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative aspect-[16/10] w-full bg-[var(--color-light-200)]">
        <Image src={imageSrc} alt={imageAlt} fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" />
        {badge?.text ? (
          <span
            className={[
              "absolute left-4 top-4 rounded-full px-3 py-1 text-[var(--text-body)] font-medium bg-[var(--color-light-100)]/90",
              badgeToneClass(badge.tone),
            ].join(" ")}
          >
            {badge.text}
          </span>
        ) : null}
      </div>

      <div className="bg-[var(--color-dark-900)] text-[var(--color-light-100)] px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[var(--text-heading-3)] leading-[var(--text-heading-3--line-height)] font-medium">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-1 text-[var(--text-body)] text-[var(--color-light-400)]">{subtitle}</p>
            ) : null}
            {typeof colorCount === "number" ? (
              <p className="mt-1 text-[var(--text-caption)] text-[var(--color-light-400)]">
                {colorCount} Colour
              </p>
            ) : null}
          </div>
          {priceText ? <div className="shrink-0 text-[var(--text-heading-3)]">{priceText}</div> : null}
        </div>
      </div>
    </Comp>
  );
}
