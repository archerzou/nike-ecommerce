import { db } from '../src/lib/db';
import { products } from '../src/lib/db/schema';

const nikeProducts = [
  {
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 delivers visible cushioning under every step.',
    price: '150.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-mens-shoes-KkLcGR.png',
    category: 'Shoes',
    brand: 'Nike',
    size: '10',
    color: 'Black/White',
    stock: 25,
  },
  {
    name: 'Nike Dri-FIT Running Shirt',
    description: 'Stay dry and comfortable with Nike Dri-FIT technology.',
    price: '35.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/16a04d6e-bcaa-4c58-ab0f-0c096c2e5bb9/dri-fit-miler-mens-running-top-c0Ww8p.png',
    category: 'Apparel',
    brand: 'Nike',
    size: 'L',
    color: 'Navy Blue',
    stock: 50,
  },
  {
    name: 'Nike Air Force 1',
    description: 'The classic Nike Air Force 1 with timeless style.',
    price: '110.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-jBrhbr.png',
    category: 'Shoes',
    brand: 'Nike',
    size: '9',
    color: 'White',
    stock: 30,
  },
  {
    name: 'Nike Swoosh Sports Bra',
    description: 'Medium-support sports bra for your workout needs.',
    price: '30.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3f930e7e-73d4-4b0e-9d8a-b7d4b2b8b8b8/swoosh-medium-support-sports-bra-2V8wZX.png',
    category: 'Apparel',
    brand: 'Nike',
    size: 'M',
    color: 'Black',
    stock: 40,
  },
  {
    name: 'Nike React Infinity Run',
    description: 'Designed to help reduce injury and keep you running.',
    price: '160.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8439f823-86cf-4086-81d2-4f9ff9a66866/react-infinity-run-flyknit-3-mens-road-running-shoes-QMvLZD.png',
    category: 'Shoes',
    brand: 'Nike',
    size: '11',
    color: 'Grey/Orange',
    stock: 20,
  },
  {
    name: 'Nike Tech Fleece Hoodie',
    description: 'Premium fleece hoodie with modern design.',
    price: '100.00',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/1f2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6/tech-fleece-pullover-hoodie-mens-hoodie-2V8wZX.png',
    category: 'Apparel',
    brand: 'Nike',
    size: 'XL',
    color: 'Charcoal',
    stock: 15,
  },
];

async function seed() {
  try {
    console.log('Seeding database with Nike products...');
    
    for (const product of nikeProducts) {
      await db.insert(products).values(product);
      console.log(`Added: ${product.name}`);
    }
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();