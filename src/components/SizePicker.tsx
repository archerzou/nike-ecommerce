"use client";

import React, { useState } from "react";

export default function SizePicker({ sizes }: { sizes: string[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {sizes.map((s, i) => {
        const selected = active === i;
        return (
          <button
            key={s}
            type="button"
            onClick={() => setActive(i)}
            className={`h-12 rounded-md border px-3 text-body-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-500 ${
              selected ? "border-dark-900" : "border-light-300"
            }`}
            aria-pressed={selected}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
