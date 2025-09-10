'use client';

import React, { useState } from 'react';
import { useUpdateUrlParams } from '@/lib/utils/client-query';

interface SortProps {
  currentSort?: string;
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc', label: 'Price: Low to High' },
];

export function Sort({ currentSort = 'featured' }: SortProps) {
  const updateUrlParams = useUpdateUrlParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleSortChange = (sortValue: string) => {
    updateUrlParams({
      sort: sortValue === 'featured' ? undefined : sortValue,
    });
    setIsOpen(false);
  };

  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Featured';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-light-100 border border-light-300 rounded-md text-body-medium text-dark-900 hover:bg-light-200 focus:ring-2 focus:ring-dark-500 focus:border-transparent"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>Sort By: {currentSortLabel}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <div 
            className="fixed inset-0 z-10 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-light-100 border border-light-300 rounded-md shadow-lg z-20">
            <div className="py-1" role="listbox">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full px-4 py-2 text-left text-body hover:bg-light-200 focus:bg-light-200 focus:outline-none ${
                    currentSort === option.value 
                      ? 'text-dark-900 font-medium' 
                      : 'text-dark-700'
                  }`}
                  role="option"
                  aria-selected={currentSort === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
