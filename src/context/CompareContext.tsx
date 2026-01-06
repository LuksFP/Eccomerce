import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Product } from "@/types/product";
import { toast } from "sonner";

const MAX_COMPARE_ITEMS = 4;

type CompareContextType = {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const addToCompare = useCallback((product: Product) => {
    setCompareItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        toast.info("Produto já está na comparação");
        return prev;
      }

      if (prev.length >= MAX_COMPARE_ITEMS) {
        toast.error(`Máximo de ${MAX_COMPARE_ITEMS} produtos para comparar`);
        return prev;
      }

      toast.success("Produto adicionado à comparação");
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== productId));
    toast.info("Produto removido da comparação");
  }, []);

  const clearCompare = useCallback(() => {
    setCompareItems([]);
    setIsCompareOpen(false);
  }, []);

  const isInCompare = useCallback(
    (productId: string) => compareItems.some((item) => item.id === productId),
    [compareItems]
  );

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareOpen,
        setIsCompareOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
