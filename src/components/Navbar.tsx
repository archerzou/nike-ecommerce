"use client";
import React from "react";


import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface NavLink {
  label: string;
  href?: string;
}

export interface NavbarProps {
  links?: NavLink[];
  cartCount?: number;
  className?: string;
  onToggleMenu?: (open: boolean) => void;
}

const defaultLinks: NavLink[] = [
  { label: "Men", href: "#" },
  { label: "Women", href: "#" },
  { label: "Kids", href: "#" },
  { label: "Collections", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Navbar({
  links = defaultLinks,
  cartCount = 0,
  className,
  onToggleMenu,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    const v = !open;
    setOpen(v);
    onToggleMenu?.(v);
  };

  return (
    <header className={["w-full bg-[var(--color-light-100)]", className].filter(Boolean).join(" ")}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Primary">
        <div className="flex h-16 items-center justify-between">
          <Link href="#" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Nike Logo" width={28} height={28} priority />
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  className="text-[var(--color-dark-900)] text-[var(--text-body)] hover:text-[var(--color-dark-700)]"
                  href={l.href ?? "#"}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-8">
            <button
              className="text-[var(--color-dark-900)] text-[var(--text-body)] hover:text-[var(--color-dark-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-900)] rounded"
              type="button"
            >
              Search
            </button>
            <Link
              href="#"
              className="text-[var(--color-dark-900)] text-[var(--text-body)] hover:text-[var(--color-dark-700)]"
            >
              {"My Cart" + (cartCount ? ` (${cartCount})` : "")}
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-[var(--color-dark-900)] hover:bg-[var(--color-light-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-900)]"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={toggle}
          >
            <span className="sr-only">Toggle main menu</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        <div id="mobile-menu" className={`md:hidden ${open ? "block" : "hidden"} pb-4`}>
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  className="block rounded-md px-3 py-2 text-[var(--color-dark-900)] hover:bg-[var(--color-light-200)]"
                  href={l.href ?? "#"}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-[var(--color-light-300)] pt-2">
              <button className="block w-full text-left rounded-md px-3 py-2 text-[var(--color-dark-900)] hover:bg-[var(--color-light-200)]">
                Search
              </button>
              <Link
                href="#"
                className="mt-1 block rounded-md px-3 py-2 text-[var(--color-dark-900)] hover:bg-[var(--color-light-200)]"
              >
                {"My Cart" + (cartCount ? ` (${cartCount})` : "")}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
