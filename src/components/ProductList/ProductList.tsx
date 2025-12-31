import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { Package } from "lucide-react";

type ProductListProps = {
  products: Product[];
  isLoading?: boolean;
};

const ProductSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm">
    <div className="aspect-square bg-muted shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-16 bg-muted shimmer rounded" />
      <div className="h-5 w-full bg-muted shimmer rounded" />
      <div className="h-5 w-3/4 bg-muted shimmer rounded" />
      <div className="h-6 w-24 bg-muted shimmer rounded" />
      <div className="h-9 w-full bg-muted shimmer rounded" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
      <Package className="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">
      Nenhum produto encontrado
    </h3>
    <p className="text-muted-foreground max-w-md">
      Não encontramos produtos que correspondam aos seus filtros. 
      Tente ajustar sua busca ou limpar os filtros.
    </p>
  </div>
);

export const ProductList = ({ products, isLoading }: ProductListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
