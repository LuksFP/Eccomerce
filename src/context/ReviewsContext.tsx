import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Review, ReviewStats } from "@/types/review";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

type ReviewsContextType = {
  getProductReviews: (productId: string) => Review[];
  getProductStats: (productId: string) => ReviewStats;
  addReview: (productId: string, rating: number, title: string, comment: string) => boolean;
  deleteReview: (reviewId: string) => void;
  markHelpful: (reviewId: string) => void;
  hasUserReviewed: (productId: string) => boolean;
};

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const REVIEWS_STORAGE_KEY = "ecommerce-reviews";

// Initial mock reviews
const initialReviews: Review[] = [
  {
    id: "review-1",
    productId: "1",
    userId: "user-demo-1",
    userName: "Maria Silva",
    rating: 5,
    title: "Excelente produto!",
    comment: "O MacBook Pro superou todas as minhas expectativas. Performance incrível e a tela é simplesmente maravilhosa. Recomendo muito!",
    createdAt: new Date("2024-12-15"),
    helpful: 12,
  },
  {
    id: "review-2",
    productId: "1",
    userId: "user-demo-2",
    userName: "João Santos",
    rating: 4,
    title: "Muito bom, mas caro",
    comment: "Produto de altíssima qualidade, porém o preço é um pouco salgado. Bateria dura o dia todo sem problemas.",
    createdAt: new Date("2024-12-10"),
    helpful: 8,
  },
  {
    id: "review-3",
    productId: "2",
    userId: "user-demo-3",
    userName: "Ana Costa",
    rating: 5,
    title: "Melhor iPhone que já tive",
    comment: "A câmera é espetacular! Fotos profissionais sem esforço. O Dynamic Island é muito útil no dia a dia.",
    createdAt: new Date("2024-12-20"),
    helpful: 5,
  },
  {
    id: "review-4",
    productId: "4",
    userId: "user-demo-4",
    userName: "Pedro Oliveira",
    rating: 5,
    title: "Qualidade premium",
    comment: "O couro é de excelente qualidade e o acabamento impecável. Vale cada centavo investido.",
    createdAt: new Date("2024-12-18"),
    helpful: 3,
  },
  {
    id: "review-5",
    productId: "6",
    userId: "user-demo-5",
    userName: "Carla Mendes",
    rating: 4,
    title: "Lindo e elegante",
    comment: "Relógio muito bonito, combina com qualquer ocasião. Só achei um pouco pesado no início, mas acostumei rápido.",
    createdAt: new Date("2024-12-05"),
    helpful: 7,
  },
  {
    id: "review-6",
    productId: "3",
    userId: "user-demo-6",
    userName: "Lucas Ferreira",
    rating: 5,
    title: "Som incrível!",
    comment: "O cancelamento de ruído é absurdo! Perfeito para trabalhar focado. A bateria dura bastante também.",
    createdAt: new Date("2024-12-22"),
    helpful: 15,
  },
];

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load reviews on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const reviewsWithDates = parsed.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
        }));
        setReviews(reviewsWithDates);
      } else {
        setReviews(initialReviews);
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(initialReviews));
      }
    } catch {
      setReviews(initialReviews);
    }
  }, []);

  // Save reviews when they change
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    }
  }, [reviews]);

  const getProductReviews = useCallback(
    (productId: string) => {
      return reviews
        .filter((r) => r.productId === productId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    [reviews]
  );

  const getProductStats = useCallback(
    (productId: string): ReviewStats => {
      const productReviews = reviews.filter((r) => r.productId === productId);
      
      if (productReviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
      }

      const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalRating = 0;

      productReviews.forEach((r) => {
        totalRating += r.rating;
        distribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
      });

      return {
        averageRating: totalRating / productReviews.length,
        totalReviews: productReviews.length,
        distribution,
      };
    },
    [reviews]
  );

  const hasUserReviewed = useCallback(
    (productId: string) => {
      if (!user) return false;
      return reviews.some((r) => r.productId === productId && r.userId === user.id);
    },
    [reviews, user]
  );

  const addReview = useCallback(
    (productId: string, rating: number, title: string, comment: string): boolean => {
      if (!user) {
        toast({
          title: "Faça login",
          description: "Você precisa estar logado para avaliar.",
          variant: "destructive",
        });
        return false;
      }

      if (hasUserReviewed(productId)) {
        toast({
          title: "Já avaliado",
          description: "Você já avaliou este produto.",
          variant: "destructive",
        });
        return false;
      }

      const newReview: Review = {
        id: `review-${Date.now()}`,
        productId,
        userId: user.id,
        userName: user.name,
        rating,
        title,
        comment,
        createdAt: new Date(),
        helpful: 0,
      };

      setReviews((prev) => [newReview, ...prev]);
      toast({
        title: "Avaliação enviada!",
        description: "Obrigado por compartilhar sua opinião.",
      });
      return true;
    },
    [user, hasUserReviewed]
  );

  const deleteReview = useCallback(
    (reviewId: string) => {
      if (!user) return;
      setReviews((prev) =>
        prev.filter((r) => !(r.id === reviewId && r.userId === user.id))
      );
      toast({ title: "Avaliação removida" });
    },
    [user]
  );

  const markHelpful = useCallback((reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r))
    );
  }, []);

  return (
    <ReviewsContext.Provider
      value={{
        getProductReviews,
        getProductStats,
        addReview,
        deleteReview,
        markHelpful,
        hasUserReviewed,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
};
