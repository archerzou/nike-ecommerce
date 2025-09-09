import React from 'react';
import Card from '@/components/Card';

type DummyProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  subtitle?: string;
  colors?: number;
  badge?: { text: string; tone?: 'orange' | 'red' | 'green' | 'dark' };
};

const products: DummyProduct[] = [
  {
    id: '1',
    name: "Nike Air Force 1 Mid '07",
    image: '/shoes/air-force-1.png',
    price: 98.3,
    subtitle: "Men's Shoes",
    colors: 6,
    badge: { text: 'Best Seller', tone: 'orange' },
  },
  {
    id: '2',
    name: 'Nike Air Max 90',
    image: '/shoes/air-max-90.png',
    price: 120,
    subtitle: "Men's Shoes",
    colors: 4,
  },
  {
    id: '3',
    name: 'Nike Dunk Low Retro',
    image: '/shoes/dunk-low.png',
    price: 115,
    subtitle: "Men's Shoes",
    colors: 5,
  },
  {
    id: '4',
    name: 'Nike Pegasus 41',
    image: '/shoes/pegasus.png',
    price: 130,
    subtitle: "Men's Shoes",
    colors: 3,
  },
];

const Home = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-[var(--text-heading-1)] font-medium mb-8">Nike</h1>

      <section aria-label="Featured Products">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <Card
              key={p.id}
              imageSrc={p.image}
              imageAlt={p.name}
              title={p.name}
              subtitle={p.subtitle}
              price={p.price}
              colorCount={p.colors}
              badge={p.badge ? { text: p.badge.text, tone: p.badge.tone as any } : undefined}
              href="#"
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
