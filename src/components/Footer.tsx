import React from "react";

import Image from "next/image";
import Link from "next/link";

export interface FooterLinkItem {
  label: string;
  href?: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLinkItem[];
}

export interface FooterProps {
  groups?: FooterLinkGroup[];
  className?: string;
}

const defaultGroups: FooterLinkGroup[] = [
  {
    title: "Featured",
    links: [{ label: "Air Force 1" }, { label: "Huarache" }, { label: "Air Max 90" }, { label: "Air Max 95" }],
  },
  {
    title: "Shoes",
    links: [{ label: "All Shoes" }, { label: "Custom Shoes" }, { label: "Jordan Shoes" }, { label: "Running Shoes" }],
  },
  {
    title: "Clothing",
    links: [
      { label: "All Clothing" },
      { label: "Modest Wear" },
      { label: "Hoodies & Pullovers" },
      { label: "Shirts & Tops" },
    ],
  },
  {
    title: "Kids'",
    links: [
      { label: "Infant & Toddler Shoes" },
      { label: "Kids' Shoes" },
      { label: "Kids' Jordan Shoes" },
      { label: "Kids' Basketball Shoes" },
    ],
  },
];

export default function Footer({ groups = defaultGroups, className }: FooterProps) {
  return (
    <footer
      className={["w-full bg-black text-[var(--color-light-100)]", className].filter(Boolean).join(" ")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col justify-between">
            <Image src="/logo.svg" alt="Nike" width={56} height={56} className="invert" />
            <div className="mt-6 flex items-center gap-4">
              <Link href="#" aria-label="X">
                <Image src="/x.svg" alt="" width={28} height={28} className="invert" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Image src="/facebook.svg" alt="" width={28} height={28} className="invert" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Image src="/instagram.svg" alt="" width={28} height={28} className="invert" />
              </Link>
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="text-[var(--text-heading-3)] mb-3">{g.title}</h4>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href ?? "#"}
                      className="text-[var(--color-dark-500)] hover:text-[var(--color-light-100)] text-[var(--text-body)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-top pt-6 sm:flex-row sm:items-center sm:justify-between border-t border-[var(--color-light-300)]/20">
          <div className="flex items-center gap-2 text-[var(--color-dark-500)]">
            <Image src="/globe.svg" alt="" width={18} height={18} className="invert" />
            <span className="text-[var(--text-caption)]">Croatia</span>
            <span className="text-[var(--text-caption)]">© 2025 Nike, Inc. All Rights Reserved</span>
          </div>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[var(--text-caption)] text-[var(--color-dark-500)]">
            <li>
              <Link href="#" className="hover:text-[var(--color-light-100)]">
                Guides
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[var(--color-light-100)]">
                Terms of Sale
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[var(--color-light-100)]">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[var(--color-light-100)]">
                Nike Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
