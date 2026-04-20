export type ProductCategory = "suplementos" | "fitness" | "bem-estar";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  stock: number;
  image: string;
  description?: string;
  rating?: number;
  originalPrice?: number;
};

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc" | "rating-desc";

export type FilterState = {
  search: string;
  category: ProductCategory | "all";
  sortBy: SortOption;
  priceRange: [number, number];
  minRating: number;
};

export const categoryLabels: Record<ProductCategory, string> = {
  suplementos: "Suplementos",
  fitness: "Fitness",
  "bem-estar": "Bem-estar",
};

export const categoryBadgeVariant: Record<ProductCategory, "supplements" | "fitness" | "wellness"> = {
  suplementos: "supplements",
  fitness: "fitness",
  "bem-estar": "wellness",
};
