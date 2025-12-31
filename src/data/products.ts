import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "MacBook Pro 14\"",
    price: 12999.00,
    originalPrice: 14999.00,
    category: "eletronicos",
    stock: 5,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    description: "Laptop profissional com chip M3 Pro, 18GB de memória unificada e 512GB SSD. Tela Liquid Retina XDR de 14 polegadas.",
    rating: 4.9,
  },
  {
    id: "2",
    name: "iPhone 15 Pro Max",
    price: 9499.00,
    category: "eletronicos",
    stock: 12,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
    description: "O iPhone mais avançado, com chip A17 Pro, câmera de 48MP e Dynamic Island.",
    rating: 4.8,
  },
  {
    id: "3",
    name: "AirPods Pro 2ª Geração",
    price: 1899.00,
    originalPrice: 2299.00,
    category: "eletronicos",
    stock: 25,
    image: "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=600&q=80",
    description: "Fones de ouvido sem fio com cancelamento ativo de ruído e modo ambiente.",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Jaqueta Couro Premium",
    price: 899.00,
    category: "roupas",
    stock: 8,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    description: "Jaqueta de couro legítimo com forro térmico. Design clássico e atemporal.",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Tênis Runner Pro",
    price: 459.00,
    originalPrice: 599.00,
    category: "roupas",
    stock: 0,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    description: "Tênis esportivo com tecnologia de amortecimento avançada para máximo conforto.",
    rating: 4.5,
  },
  {
    id: "6",
    name: "Relógio Automático Luxo",
    price: 2499.00,
    category: "acessorios",
    stock: 3,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    description: "Relógio automático com pulseira em aço inoxidável e vidro de safira.",
    rating: 4.9,
  },
  {
    id: "7",
    name: "Bolsa Tote Elegance",
    price: 649.00,
    category: "acessorios",
    stock: 15,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    description: "Bolsa tote em couro sintético de alta qualidade. Espaçosa e versátil.",
    rating: 4.4,
  },
  {
    id: "8",
    name: "Óculos de Sol Aviador",
    price: 349.00,
    originalPrice: 449.00,
    category: "acessorios",
    stock: 20,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    description: "Óculos de sol estilo aviador com proteção UV400 e armação em metal.",
    rating: 4.3,
  },
  {
    id: "9",
    name: "Camiseta Premium Cotton",
    price: 129.00,
    category: "roupas",
    stock: 50,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    description: "Camiseta básica em algodão egípcio premium. Corte moderno e confortável.",
    rating: 4.2,
  },
  {
    id: "10",
    name: "Smart Watch Series 9",
    price: 3299.00,
    category: "eletronicos",
    stock: 7,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
    description: "Smartwatch avançado com monitoramento de saúde e GPS integrado.",
    rating: 4.8,
  },
  {
    id: "11",
    name: "Carteira Slim Carbon",
    price: 189.00,
    category: "acessorios",
    stock: 0,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
    description: "Carteira slim com acabamento em fibra de carbono. Design minimalista.",
    rating: 4.1,
  },
  {
    id: "12",
    name: "Moletom Oversized Urban",
    price: 279.00,
    category: "roupas",
    stock: 22,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    description: "Moletom oversized em algodão macio com capuz ajustável.",
    rating: 4.6,
  },
];

// Simulate async data fetching
export const fetchProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 800);
  });
};

export const fetchProductById = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.find((p) => p.id === id));
    }, 400);
  });
};
