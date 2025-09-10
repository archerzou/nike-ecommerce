'use client';

import React, { useState } from 'react';
import { useUpdateUrlParams } from '@/lib/utils/client-query';
import { type FilterParams } from '@/lib/utils/query';

interface FilterOption {
  slug: string;
  label?: string;
  name?: string;
  hexCode?: string;
}

interface FiltersProps {
  genderOptions: FilterOption[];
  colorOptions: FilterOption[];
  sizeOptions: FilterOption[];
  currentFilters: FilterParams;
}

export function Filters({ genderOptions, colorOptions, sizeOptions, currentFilters }: FiltersProps) {
  const updateUrlParams = useUpdateUrlParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    gender: true,
    color: true,
    size: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (filterType: keyof FilterParams, value: string, checked: boolean) => {
    const currentValues = currentFilters[filterType] as string[] || [];
    
    let newValues: string[];
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    updateUrlParams({
      [filterType]: newValues.length > 0 ? newValues : undefined,
    });
  };

  const handlePriceChange = (type: 'priceMin' | 'priceMax', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    updateUrlParams({
      [type]: numValue,
    });
  };

  const clearAllFilters = () => {
    updateUrlParams({
      gender: undefined,
      color: undefined,
      size: undefined,
      priceMin: undefined,
      priceMax: undefined,
    });
  };

  const FilterSection = ({ title, children, sectionKey }: { 
    title: string; 
    children: React.ReactNode; 
    sectionKey: keyof typeof expandedSections;
  }) => (
    <div className="border-b border-light-300 pb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex w-full items-center justify-between py-2 text-left text-body-medium text-dark-900 hover:text-dark-700"
        aria-expanded={expandedSections[sectionKey]}
      >
        {title}
        <span className={`transform transition-transform ${expandedSections[sectionKey] ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxOption = ({ 
    label, 
    checked, 
    onChange,
    color 
  }: { 
    label: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
    color?: string;
  }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-500"
      />
      <div className="flex items-center gap-2">
        {color && (
          <div 
            className="h-4 w-4 rounded-full border border-light-400"
            style={{ backgroundColor: color }}
          />
        )}
        <span className="text-body text-dark-700 group-hover:text-dark-900">{label}</span>
      </div>
    </label>
  );

  const filtersContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-heading-3 text-dark-900">Filters</h2>
        {(currentFilters.gender?.length || currentFilters.color?.length || currentFilters.size?.length || currentFilters.priceMin || currentFilters.priceMax) && (
          <button
            onClick={clearAllFilters}
            className="text-caption text-dark-700 hover:text-dark-900 underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Gender Filter */}
      <FilterSection title="Gender" sectionKey="gender">
        {genderOptions.map((option) => (
          <CheckboxOption
            key={option.slug}
            label={option.label || option.slug}
            checked={currentFilters.gender?.includes(option.slug) || false}
            onChange={(checked) => handleFilterChange('gender', option.slug, checked)}
          />
        ))}
      </FilterSection>

      {/* Color Filter */}
      <FilterSection title="Color" sectionKey="color">
        {colorOptions.map((option) => (
          <CheckboxOption
            key={option.slug}
            label={option.name || option.slug}
            checked={currentFilters.color?.includes(option.slug) || false}
            onChange={(checked) => handleFilterChange('color', option.slug, checked)}
            color={option.hexCode}
          />
        ))}
      </FilterSection>

      {/* Size Filter */}
      <FilterSection title="Size" sectionKey="size">
        {sizeOptions.map((option) => (
          <CheckboxOption
            key={option.slug}
            label={option.name || option.slug}
            checked={currentFilters.size?.includes(option.slug) || false}
            onChange={(checked) => handleFilterChange('size', option.slug, checked)}
          />
        ))}
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range" sectionKey="price">
        <div className="space-y-3">
          <div>
            <label htmlFor="priceMin" className="block text-caption text-dark-700 mb-1">
              Min Price ($)
            </label>
            <input
              id="priceMin"
              type="number"
              min="0"
              step="0.01"
              value={currentFilters.priceMin || ''}
              onChange={(e) => handlePriceChange('priceMin', e.target.value)}
              className="w-full px-3 py-2 border border-light-400 rounded-md text-body focus:ring-2 focus:ring-dark-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="priceMax" className="block text-caption text-dark-700 mb-1">
              Max Price ($)
            </label>
            <input
              id="priceMax"
              type="number"
              min="0"
              step="0.01"
              value={currentFilters.priceMax || ''}
              onChange={(e) => handlePriceChange('priceMax', e.target.value)}
              className="w-full px-3 py-2 border border-light-400 rounded-md text-body focus:ring-2 focus:ring-dark-500 focus:border-transparent"
              placeholder="999.99"
            />
          </div>
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-light-100 border border-light-300 rounded-md text-body-medium text-dark-900 hover:bg-light-200"
        >
          <span>Filters</span>
          <span>⚙️</span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        {filtersContent}
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-dark-900 bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed left-0 top-0 h-full w-80 max-w-[80vw] bg-light-100 shadow-xl transform transition-transform">
            <div className="flex items-center justify-between p-4 border-b border-light-300">
              <h2 className="text-heading-3 text-dark-900">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-light-200 rounded-md"
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
              {filtersContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
