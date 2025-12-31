export type ProductCategory = "eletronicos" | "roupas" | "acessorios";

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

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

export type FilterState = {
  search: string;
  category: ProductCategory | "all";
  sortBy: SortOption;
};

export const categoryLabels: Record<ProductCategory, string> = {
  eletronicos: "Eletrônicos",
  roupas: "Roupas",
  acessorios: "Acessórios",
};

export const categoryBadgeVariant: Record<ProductCategory, "electronics" | "clothing" | "accessories"> = {
  eletronicos: "electronics",
  roupas: "clothing",
  acessorios: "accessories",
};
