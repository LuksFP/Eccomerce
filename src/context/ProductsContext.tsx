import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { products as mockProducts } from "@/data/products";
import { Product, ProductCategory } from "@/types/product";

type ProductsContextType = {
  products: Product[];
  isLoading: boolean;
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
  seedProducts: () => Promise<void>;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || undefined,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        image: p.image,
        category: p.category as ProductCategory,
        stock: p.stock,
        rating: p.rating ? Number(p.rating) : undefined,
      })));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const seedProducts = useCallback(async () => {
    // Insert mock products into database
    const productsToInsert = mockProducts.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price,
      original_price: p.originalPrice || null,
      image: p.image,
      category: p.category,
      stock: p.stock,
      rating: p.rating || null,
    }));

    const { error } = await supabase
      .from("products")
      .insert(productsToInsert);

    if (error) {
      toast({ title: "Erro ao adicionar produtos", variant: "destructive" });
    } else {
      toast({ title: "Produtos adicionados com sucesso!" });
      fetchProducts();
    }
  }, [fetchProducts]);

  const addProduct = useCallback(async (product: Omit<Product, "id">) => {
    const { error } = await supabase
      .from("products")
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice,
        image: product.image,
        category: product.category,
        stock: product.stock,
        rating: product.rating,
      });

    if (error) {
      toast({ title: "Erro ao adicionar produto", variant: "destructive" });
    } else {
      toast({ title: "Produto adicionado" });
      fetchProducts();
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;

    const { error } = await supabase
      .from("products")
      .update(dbUpdates)
      .eq("id", id);

    if (error) {
      toast({ title: "Erro ao atualizar produto", variant: "destructive" });
    } else {
      toast({ title: "Produto atualizado" });
      fetchProducts();
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Erro ao remover produto", variant: "destructive" });
    } else {
      toast({ title: "Produto removido" });
      fetchProducts();
    }
  }, [fetchProducts]);

  const updateStock = useCallback(async (id: string, newStock: number) => {
    const { error } = await supabase
      .from("products")
      .update({ stock: Math.max(0, newStock) })
      .eq("id", id);

    if (!error) {
      fetchProducts();
    }
  }, [fetchProducts]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        seedProducts,
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
