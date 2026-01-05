-- Add images array to reviews table
ALTER TABLE public.reviews 
ADD COLUMN images text[] DEFAULT '{}';

-- Create shared wishlists table
CREATE TABLE public.shared_wishlists (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  share_code text NOT NULL UNIQUE,
  name text NOT NULL DEFAULT 'Minha Lista de Desejos',
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_wishlists ENABLE ROW LEVEL SECURITY;

-- Policies for shared wishlists
CREATE POLICY "Users can create their own wishlists" 
ON public.shared_wishlists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own wishlists" 
ON public.shared_wishlists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlists" 
ON public.shared_wishlists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlists" 
ON public.shared_wishlists 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public wishlists by share code" 
ON public.shared_wishlists 
FOR SELECT 
USING (is_public = true);

-- Create wishlist items table
CREATE TABLE public.wishlist_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wishlist_id uuid NOT NULL REFERENCES public.shared_wishlists(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  added_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(wishlist_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Policies for wishlist items
CREATE POLICY "Users can manage their wishlist items" 
ON public.wishlist_items 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.shared_wishlists sw 
    WHERE sw.id = wishlist_id AND sw.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view public wishlist items" 
ON public.wishlist_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.shared_wishlists sw 
    WHERE sw.id = wishlist_id AND sw.is_public = true
  )
);

-- Add trigger for updated_at on shared_wishlists
CREATE TRIGGER update_shared_wishlists_updated_at
BEFORE UPDATE ON public.shared_wishlists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for review images
CREATE POLICY "Anyone can view review images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'review-images');

CREATE POLICY "Users can upload review images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'review-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their review images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'review-images' AND auth.uid()::text = (storage.foldername(name))[1]);