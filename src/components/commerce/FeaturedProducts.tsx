import type { Product } from "@/types/product.types";
import ProductCard from "@/components/commerce/ProductCard";

type Props = {
  products: Product[];
};

export default function FeaturedProducts({ products }: Props) {
  return (
    <div className="grid-responsive">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
