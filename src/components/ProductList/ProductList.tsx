import { useRef } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { Package } from "lucide-react";
import { GlassCard } from "@/components/shared";
import { motion, useInView } from "framer-motion";

type ProductListProps = {
  products: Product[];
  isLoading?: boolean;
};

const ProductSkeleton = () => (
  <div className="glass rounded-2xl overflow-hidden border border-border/30">
    <div className="aspect-[4/5] bg-secondary/50 shimmer" />
    <div className="p-4 space-y-3">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-3 w-3 bg-muted shimmer rounded" />
        ))}
      </div>
      <div className="h-5 w-full bg-muted shimmer rounded" />
      <div className="h-5 w-3/4 bg-muted shimmer rounded" />
      <div className="h-7 w-28 bg-muted shimmer rounded" />
      <div className="h-10 w-full bg-muted shimmer rounded-lg" />
    </div>
  </div>
);

const EmptyState = () => (
  <GlassCard className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6">
      <Package className="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 className="font-display text-xl font-bold text-foreground mb-2">
      Nenhum produto encontrado
    </h3>
    <p className="text-muted-foreground max-w-md text-sm">
      Não encontramos produtos que correspondam aos seus filtros.
      Tente ajustar sua busca ou limpar os filtros.
    </p>
  </GlassCard>
);

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: (i % 8) * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const ProductList = ({ products, isLoading }: ProductListProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          custom={i}
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};
