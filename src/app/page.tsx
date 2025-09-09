import React from 'react';
import ProductList from '@/components/ProductList';

const Home = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-[var(--text-heading-1)] font-medium mb-8">Nike</h1>
      <ProductList />
    </main>
  );
};

export default Home;
