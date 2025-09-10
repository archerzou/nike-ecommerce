import React from 'react';
import { Card } from '@/components';
import { Filters } from '@/components/Filters';
import { Sort } from '@/components/Sort';
import { parseSearchParams } from '@/lib/utils/query';

const mockProducts = [
  {
    id: '1',
    name: 'Nike Air Force 1 Mid \'07',
    description: 'Classic basketball shoe with premium leather upper',
    price: 98.30,
    imageSrc: '/shoes/shoe-1.jpg',
    gender: { slug: 'men', label: 'Men' },
    category: { name: 'Shoes' },
    variants: [
      { color: { name: 'White', slug: 'white', hexCode: '#FFFFFF' }, size: { name: 'US 8', slug: 'us-8' }, inStock: 5 },
      { color: { name: 'Black', slug: 'black', hexCode: '#000000' }, size: { name: 'US 9', slug: 'us-9' }, inStock: 3 },
    ],
    badge: { label: 'Best Seller', tone: 'red' as const },
  },
  {
    id: '2',
    name: 'Nike Court Vision Low Next Nature',
    description: 'Sustainable basketball-inspired shoe',
    price: 98.30,
    imageSrc: '/shoes/shoe-2.webp',
    gender: { slug: 'men', label: 'Men' },
    category: { name: 'Shoes' },
    variants: [
      { color: { name: 'Blue', slug: 'blue', hexCode: '#0066CC' }, size: { name: 'US 8', slug: 'us-8' }, inStock: 2 },
      { color: { name: 'White', slug: 'white', hexCode: '#FFFFFF' }, size: { name: 'US 10', slug: 'us-10' }, inStock: 4 },
    ],
    badge: { label: 'Extra 20% off', tone: 'green' as const },
  },
  {
    id: '3',
    name: 'Nike Air Force 1 PLTAFORM',
    description: 'Platform version of the classic Air Force 1',
    price: 98.30,
    imageSrc: '/shoes/shoe-3.webp',
    gender: { slug: 'women', label: 'Women' },
    category: { name: 'Shoes' },
    variants: [
      { color: { name: 'Green', slug: 'green', hexCode: '#00AA44' }, size: { name: 'US 7', slug: 'us-7' }, inStock: 1 },
      { color: { name: 'Pink', slug: 'pink', hexCode: '#FF69B4' }, size: { name: 'US 8', slug: 'us-8' }, inStock: 6 },
    ],
    badge: { label: 'Best Seller', tone: 'red' as const },
  },
  {
    id: '4',
    name: 'Nike Dunk Low Retro',
    description: 'Retro basketball shoe with vintage appeal',
    price: 98.30,
    imageSrc: '/shoes/shoe-4.webp',
    gender: { slug: 'men', label: 'Men' },
    category: { name: 'Shoes' },
    variants: [
      { color: { name: 'Yellow', slug: 'yellow', hexCode: '#FFDD00' }, size: { name: 'US 9', slug: 'us-9' }, inStock: 8 },
      { color: { name: 'Green', slug: 'green', hexCode: '#00AA44' }, size: { name: 'US 10', slug: 'us-10' }, inStock: 2 },
    ],
    badge: { label: 'Best Seller', tone: 'red' as const },
  },
  {
    id: '5',
    name: 'Nike Air Max SYSTM',
    description: 'Modern Air Max with system comfort',
    price: 98.30,
    imageSrc: '/shoes/shoe-1.jpg',
    gender: { slug: 'men', label: 'Men' },
    category: { name: 'Shoes' },
    variants: [
      { color: { name: 'Red', slug: 'red', hexCode: '#FF0000' }, size: { name: 'US 8', slug: 'us-8' }, inStock: 3 },
      { color: { name: 'Blue', slug: 'blue', hexCode: '#0066CC' }, size: { name: 'US 11', slug: 'us-11' }, inStock: 5 },
    ],
    badge: { label: 'Best Seller', tone: 'red' as const },
  },
  {
    id: '6',
    name: 'Nike Blazer Low \'77 Jumbo',
    description: 'Oversized Swoosh on classic basketball silhouette',
    price: 98.30,
    imageSrc: '/shoes/shoe-2.webp',
    gender: { slug: 'women', label: 'Women' },
    category: { name: 'Shoes' },
    variants: [
      { color: { name: 'White', slug: 'white', hexCode: '#FFFFFF' }, size: { name: 'US 6', slug: 'us-6' }, inStock: 4 },
      { color: { name: 'Blue', slug: 'blue', hexCode: '#0066CC' }, size: { name: 'US 7', slug: 'us-7' }, inStock: 2 },
    ],
    badge: { label: 'Extra 10% off', tone: 'green' as const },
  },
];

function filterProducts(products: typeof mockProducts, filters: ReturnType<typeof parseSearchParams>) {
  return products.filter(product => {
    if (filters.gender && filters.gender.length > 0) {
      if (!filters.gender.includes(product.gender.slug)) return false;
    }
    
    if (filters.color && filters.color.length > 0) {
      const hasColor = product.variants.some(variant => 
        filters.color!.includes(variant.color.slug)
      );
      if (!hasColor) return false;
    }
    
    if (filters.size && filters.size.length > 0) {
      const hasSize = product.variants.some(variant => 
        filters.size!.includes(variant.size.slug)
      );
      if (!hasSize) return false;
    }
    
    if (filters.priceMin && product.price < filters.priceMin) return false;
    if (filters.priceMax && product.price > filters.priceMax) return false;
    
    return true;
  });
}

function sortProducts(products: typeof mockProducts, sortBy?: string) {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted; // Mock data doesn't have dates, so return as-is
    case 'featured':
    default:
      return sorted;
  }
}

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const urlSearchParams = new URLSearchParams();
  
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => urlSearchParams.append(key, v));
    } else if (value) {
      urlSearchParams.set(key, value);
    }
  });
  
  const filters = parseSearchParams(urlSearchParams);
  const filteredProducts = filterProducts(mockProducts, filters);
  const sortedProducts = sortProducts(filteredProducts, filters.sort);
  
  const genderOptions = Array.from(new Set(mockProducts.map(p => p.gender.slug)))
    .map(slug => ({ slug, label: mockProducts.find(p => p.gender.slug === slug)?.gender.label || slug }));
  
  const colorOptions = Array.from(new Set(
    mockProducts.flatMap(p => p.variants.map(v => v.color.slug))
  )).map(slug => {
    const color = mockProducts.flatMap(p => p.variants).find(v => v.color.slug === slug)?.color;
    return color ? { slug: color.slug, name: color.name, hexCode: color.hexCode } : null;
  }).filter(Boolean);
  
  const sizeOptions = Array.from(new Set(
    mockProducts.flatMap(p => p.variants.map(v => v.size.slug))
  )).map(slug => {
    const size = mockProducts.flatMap(p => p.variants).find(v => v.size.slug === slug)?.size;
    return size ? { slug: size.slug, name: size.name } : null;
  }).filter(Boolean);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <Filters 
            genderOptions={genderOptions}
            colorOptions={colorOptions}
            sizeOptions={sizeOptions}
            currentFilters={filters}
          />
        </aside>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Header with Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-heading-2 text-dark-900">New ({sortedProducts.length})</h1>
              {/* Active Filters */}
              {(filters.gender?.length || filters.color?.length || filters.size?.length) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.gender?.map(gender => (
                    <span key={gender} className="inline-flex items-center px-3 py-1 rounded-full text-caption bg-light-200 text-dark-700">
                      {genderOptions.find(g => g.slug === gender)?.label || gender}
                    </span>
                  ))}
                  {filters.color?.map(color => (
                    <span key={color} className="inline-flex items-center px-3 py-1 rounded-full text-caption bg-light-200 text-dark-700">
                      {colorOptions.find(c => c?.slug === color)?.name || color}
                    </span>
                  ))}
                  {filters.size?.map(size => (
                    <span key={size} className="inline-flex items-center px-3 py-1 rounded-full text-caption bg-light-200 text-dark-700">
                      {sizeOptions.find(s => s?.slug === size)?.name || size}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Sort currentSort={filters.sort} />
          </div>
          
          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  title={product.name}
                  subtitle={product.category.name}
                  meta={`${product.variants.length} Colour`}
                  imageSrc={product.imageSrc}
                  price={product.price}
                  badge={product.badge}
                  href={`/products/${product.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-heading-3 text-dark-900 mb-2">No products found</h3>
              <p className="text-body text-dark-700">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
