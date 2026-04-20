import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Whey Protein Gold Standard 5lbs",
    price: 289.00,
    originalPrice: 349.00,
    category: "suplementos",
    stock: 18,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80",
    description: "Whey protein isolado e concentrado com 24g de proteína por dose. Sabores: Baunilha, Chocolate e Morango. Absorção rápida pós-treino.",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Creatina Monohidratada 500g",
    price: 79.00,
    category: "suplementos",
    stock: 35,
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&q=80",
    description: "Creatina 100% pura, micronizada para melhor absorção. Aumenta força, potência e recuperação muscular. Sem aditivos.",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Vitamina D3 + K2 120 Cápsulas",
    price: 89.00,
    originalPrice: 119.00,
    category: "suplementos",
    stock: 42,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
    description: "Combinação sinérgica de Vitamina D3 (2000 UI) + K2 (MK-7). Fortalece ossos, imunidade e saúde cardiovascular.",
    rating: 4.7,
  },
  {
    id: "4",
    name: "BCAA 2:1:1 Powder 400g",
    price: 99.00,
    originalPrice: 129.00,
    category: "suplementos",
    stock: 25,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    description: "Aminoácidos de cadeia ramificada na proporção ideal 2:1:1. Reduz fadiga muscular e acelera a recuperação pós-treino.",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Pré-Treino Xtreme Power",
    price: 139.00,
    category: "suplementos",
    stock: 14,
    image: "https://images.unsplash.com/photo-1579722820903-4c0fc4c3e031?w=600&q=80",
    description: "Fórmula avançada com cafeína, beta-alanina e citrulina. Energia, foco e pump máximo para seus treinos mais intensos.",
    rating: 4.5,
  },
  {
    id: "6",
    name: "Kit Halteres Ajustável 2-20kg",
    price: 649.00,
    originalPrice: 799.00,
    category: "fitness",
    stock: 6,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
    description: "Kit completo com 5 pares de halteres em borracha antiderrapante. Ajuste rápido, suporte incluso. Ideal para home gym.",
    rating: 4.9,
  },
  {
    id: "7",
    name: "Tapete Yoga Premium 6mm",
    price: 189.00,
    category: "fitness",
    stock: 22,
    image: "https://images.unsplash.com/photo-1601925228008-8c6e6e4e1c7d?w=600&q=80",
    description: "Tapete antiderrapante em TPE ecológico, 183x61cm, 6mm de espessura. Grip superior, impermeável e fácil de limpar.",
    rating: 4.7,
  },
  {
    id: "8",
    name: "Faixas Elásticas Set 5 Níveis",
    price: 149.00,
    category: "fitness",
    stock: 31,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
    description: "Set com 5 faixas de resistência (5 a 40kg). Látex natural premium, bolsa organizadora e manual de exercícios incluso.",
    rating: 4.6,
  },
  {
    id: "9",
    name: "Corda de Pular Speed Pro",
    price: 89.00,
    originalPrice: 119.00,
    category: "fitness",
    stock: 0,
    image: "https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=600&q=80",
    description: "Corda de pular profissional com rolamento de aço, cabo de aço revestido e empunhaduras ergonômicas. Ajuste de comprimento.",
    rating: 4.5,
  },
  {
    id: "10",
    name: "Massageador Percussivo Deep Pro",
    price: 499.00,
    originalPrice: 699.00,
    category: "bem-estar",
    stock: 8,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
    description: "Massageador de percussão profissional com 6 cabeças e 30 velocidades. Motor silencioso, bateria 6h e maleta de transporte.",
    rating: 4.9,
  },
  {
    id: "11",
    name: "Garrafa Térmica Smart 1L",
    price: 129.00,
    category: "bem-estar",
    stock: 40,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    description: "Garrafa de 1 litro em aço inox BPA-free. Mantém frio 24h e quente 12h. Marcação de horários para hidratação ideal.",
    rating: 4.4,
  },
  {
    id: "12",
    name: "Kit Aromaterapia Óleo Essencial",
    price: 79.00,
    category: "bem-estar",
    stock: 19,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80",
    description: "Kit com 6 óleos essenciais 100% puros: lavanda, eucalipto, hortelã, laranja, tea tree e rosa. Difusor de aromas incluso.",
    rating: 4.8,
  },
];

export const fetchProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products), 800);
  });
};

export const fetchProductById = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products.find((p) => p.id === id)), 400);
  });
};
