import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useReviews } from "@/context/ReviewsContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Loader2, ImagePlus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type ReviewFormProps = {
  productId: string;
  onSuccess?: () => void;
};

export const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
  const { isAuthenticated, user } = useAuth();
  const { addReview, hasUserReviewed } = useReviews();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const alreadyReviewed = hasUserReviewed(productId);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 4) {
      toast({
        title: "Limite de imagens",
        description: "Você pode adicionar no máximo 4 imagens.",
        variant: "destructive",
      });
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Arquivo inválido",
          description: `${file.name} não é uma imagem válida.`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 5MB.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);
    
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0 || !user) return [];

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const image of images) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("review-images")
          .upload(fileName, image);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("review-images")
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
        }
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }

    return uploadedUrls;
  };

  if (!isAuthenticated) {
    return (
      <Card className="glass">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">
            Faça login para deixar sua avaliação
          </p>
          <Button asChild>
            <Link to="/auth">Entrar</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (alreadyReviewed) {
    return (
      <Card className="glass">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Você já avaliou este produto. Obrigado!
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) return;
    if (!title.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    
    // Upload images first
    const imageUrls = await uploadImages();
    
    const success = addReview(productId, rating, title.trim(), comment.trim(), imageUrls);
    
    if (success) {
      setRating(0);
      setTitle("");
      setComment("");
      setImages([]);
      setImagePreviews([]);
      onSuccess?.();
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg">Escreva sua avaliação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Sua nota</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-warning text-warning"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground self-center">
                  {rating === 1 && "Ruim"}
                  {rating === 2 && "Regular"}
                  {rating === 3 && "Bom"}
                  {rating === 4 && "Muito bom"}
                  {rating === 5 && "Excelente"}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="review-title">Título</Label>
            <Input
              id="review-title"
              placeholder="Resuma sua experiência"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              disabled={isSubmitting}
              className="glass"
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="review-comment">Comentário</Label>
            <Textarea
              id="review-comment"
              placeholder="Conte mais detalhes sobre sua experiência com o produto..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={4}
              disabled={isSubmitting}
              className="glass"
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/1000
            </p>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Fotos (opcional)</Label>
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-colors"
                  disabled={isSubmitting}
                >
                  <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Adicionar</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Até 4 fotos, máximo 5MB cada
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={rating === 0 || !title.trim() || !comment.trim() || isSubmitting || isUploading}
            className="w-full"
          >
            {(isSubmitting || isUploading) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isUploading ? "Enviando fotos..." : "Enviar Avaliação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
