import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, ProductCategory } from "@/types/product";
import { products as initialProducts } from "@/data/products";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

type ProductsContextType = {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  // Admin functions
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = "ecommerce-products";

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  // Load products on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        // Initialize with mock data
        setProducts(initialProducts);
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
      }
    } catch {
      setProducts(initialProducts);
    }
  }, []);

  // Save products when they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    }
  }, [products]);

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const addProduct = useCallback(
    (product: Omit<Product, "id">) => {
      if (!isAdmin) return;
      const newProduct: Product = {
        ...product,
        id: `product-${Date.now()}`,
      };
      setProducts((prev) => [...prev, newProduct]);
      toast({ title: "Produto adicionado" });
    },
    [isAdmin]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      if (!isAdmin) return;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      toast({ title: "Produto atualizado" });
    },
    [isAdmin]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      if (!isAdmin) return;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Produto removido" });
    },
    [isAdmin]
  );

  const updateStock = useCallback(
    (id: string, newStock: number) => {
      if (!isAdmin) return;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
      );
    },
    [isAdmin]
  );

  return (
    <ProductsContext.Provider
      value={{
        products,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
