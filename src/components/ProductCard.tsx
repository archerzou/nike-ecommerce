import Card from '@/components/Card';
import type { Product } from '@/lib/db/schema';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.image || '/logo.svg';
  const imageAlt = product.name;
  const title = product.name;
  const subtitle =
    product.description && product.description.length <= 60 ? product.description : undefined;
  const price =
    typeof product.price === 'number' ? product.price : Number(product.price ?? 0);
  const colorCount = product.color ? 1 : undefined;

  return (
    <Card
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      title={title}
      subtitle={subtitle}
      price={price}
      colorCount={colorCount}
      href="#"
      className="h-full"
    />
  );
}
