import { useState } from "react";
import { Review, ReviewStats } from "@/types/review";
import { useAuth } from "@/context/AuthContext";
import { useReviews } from "@/context/ReviewsContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, ThumbsUp, Trash2, MessageSquare, Filter, Image as ImageIcon } from "lucide-react";

type ReviewsListProps = {
  productId: string;
};

const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating ? "fill-warning text-warning" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const { user } = useAuth();
  const { deleteReview, markHelpful } = useReviews();
  const isOwner = user?.id === review.userId;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {review.userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{review.userName}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Rating & Title */}
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={review.rating} />
            <h4 className="font-semibold">{review.title}</h4>
          </div>

          {/* Comment */}
          <p className="text-muted-foreground text-sm leading-relaxed">
            {review.comment}
          </p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {review.images.map((imageUrl, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <button className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Foto ${index + 1} da avaliação`}
                        className="w-16 h-16 object-cover rounded-lg border border-border hover:border-primary transition-colors"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-white" />
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-2">
                    <img
                      src={imageUrl}
                      alt={`Foto ${index + 1} da avaliação`}
                      className="w-full h-auto rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-8 px-2"
              onClick={() => markHelpful(review.id)}
            >
              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
              Útil ({review.helpful})
            </Button>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive h-8 px-2"
                onClick={() => deleteReview(review.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Excluir
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsDisplay = ({ stats, onFilterChange, currentFilter }: { 
  stats: ReviewStats; 
  onFilterChange: (filter: number | null) => void;
  currentFilter: number | null;
}) => {
  const maxCount = Math.max(...Object.values(stats.distribution), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-bold">{stats.averageRating.toFixed(1)}</p>
          <StarRating rating={Math.round(stats.averageRating)} size="md" />
          <p className="text-sm text-muted-foreground mt-1">
            {stats.totalReviews} {stats.totalReviews === 1 ? "avaliação" : "avaliações"}
          </p>
        </div>
        <div className="flex-1 space-y-2">
          {([5, 4, 3, 2, 1] as const).map((star) => (
            <button
              key={star}
              onClick={() => onFilterChange(currentFilter === star ? null : star)}
              className={`flex items-center gap-2 w-full group transition-colors ${
                currentFilter === star ? "opacity-100" : "opacity-70 hover:opacity-100"
              }`}
            >
              <span className="text-xs text-muted-foreground w-3">{star}</span>
              <Star className="h-3 w-3 fill-warning text-warning" />
              <Progress
                value={(stats.distribution[star] / maxCount) * 100}
                className={`h-2 flex-1 ${currentFilter === star ? "ring-2 ring-primary ring-offset-2" : ""}`}
              />
              <span className="text-xs text-muted-foreground w-6">
                {stats.distribution[star]}
              </span>
            </button>
          ))}
        </div>
      </div>
      {currentFilter && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Filter className="h-3 w-3" />
            Mostrando {currentFilter} estrela{currentFilter > 1 ? "s" : ""}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onFilterChange(null)}
            className="h-6 px-2 text-xs"
          >
            Limpar filtro
          </Button>
        </div>
      )}
    </div>
  );
};

export const ReviewsList = ({ productId }: ReviewsListProps) => {
  const { getProductReviews, getProductStats } = useReviews();
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "rating">("recent");
  
  let reviews = getProductReviews(productId);
  const stats = getProductStats(productId);

  // Apply star filter
  if (starFilter) {
    reviews = reviews.filter((r) => r.rating === starFilter);
  }

  // Apply sorting
  reviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "helpful":
        return b.helpful - a.helpful;
      case "rating":
        return b.rating - a.rating;
      case "recent":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (stats.totalReviews === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sem avaliações ainda</h3>
        <p className="text-muted-foreground">
          Seja o primeiro a avaliar este produto!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsDisplay stats={stats} onFilterChange={setStarFilter} currentFilter={starFilter} />

      <Separator />

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"}
          {starFilter && ` com ${starFilter} estrela${starFilter > 1 ? "s" : ""}`}
        </p>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-[180px] glass">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais recentes</SelectItem>
            <SelectItem value="helpful">Mais úteis</SelectItem>
            <SelectItem value="rating">Maior nota</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <Filter className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Nenhuma avaliação com {starFilter} estrela{starFilter && starFilter > 1 ? "s" : ""}.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};
