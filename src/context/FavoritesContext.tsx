import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

type FavoritesContextType = {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = "ecommerce-favorites";

const getStorageKey = (userId: string | undefined) => 
  userId ? `${FAVORITES_STORAGE_KEY}-${userId}` : FAVORITES_STORAGE_KEY;

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Load favorites when user changes
  useEffect(() => {
    try {
      const key = getStorageKey(user?.id);
      const stored = localStorage.getItem(key);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } catch {
      setFavorites([]);
    }
  }, [user?.id]);

  // Save favorites when they change
  useEffect(() => {
    if (user?.id) {
      const key = getStorageKey(user.id);
      localStorage.setItem(key, JSON.stringify(favorites));
    }
  }, [favorites, user?.id]);

  const addFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
    toast({
      title: "Adicionado aos favoritos",
      description: product.name,
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
    toast({
      title: "Removido dos favoritos",
    });
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.some((p) => p.id === productId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (product: Product) => {
      if (isFavorite(product.id)) {
        removeFavorite(product.id);
      } else {
        addFavorite(product);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
