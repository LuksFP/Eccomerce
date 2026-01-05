import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/utils/formatPrice";
import { Product } from "@/types/product";
import { Header } from "@/components/Header";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Heart,
  Share2,
  Copy,
  Check,
  ShoppingCart,
  Gift,
  Loader2,
  HeartOff,
  ExternalLink,
} from "lucide-react";

type SharedWishlist = {
  id: string;
  name: string;
  share_code: string;
  user_id: string;
  is_public: boolean;
};

const WishlistPage = () => {
  const { shareCode } = useParams<{ shareCode?: string }>();
  const { user, isAuthenticated, profile } = useAuth();
  const { getProductById } = useProducts();
  const { addItem } = useCart();
  const { favorites, removeFavorite } = useFavorites();

  const [wishlist, setWishlist] = useState<SharedWishlist | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  const isOwnWishlist = !shareCode && isAuthenticated;
  const isViewingShared = !!shareCode;

  // Fetch shared wishlist by code
  useEffect(() => {
    const fetchSharedWishlist = async () => {
      if (!shareCode) {
        setIsLoading(false);
        return;
      }

      const { data: wishlistData, error: wishlistError } = await supabase
        .from("shared_wishlists")
        .select("*")
        .eq("share_code", shareCode)
        .single();

      if (wishlistError || !wishlistData) {
        setIsLoading(false);
        return;
      }

      setWishlist(wishlistData);

      const { data: itemsData } = await supabase
        .from("wishlist_items")
        .select("product_id")
        .eq("wishlist_id", wishlistData.id);

      if (itemsData) {
        const prods = itemsData
          .map((item) => getProductById(item.product_id))
          .filter((p): p is Product => !!p);
        setProducts(prods);
      }

      setIsLoading(false);
    };

    fetchSharedWishlist();
  }, [shareCode, getProductById]);

  // For own wishlist, use favorites
  useEffect(() => {
    if (isOwnWishlist) {
      const prods = favorites
        .map((id) => getProductById(id))
        .filter((p): p is Product => !!p);
      setProducts(prods);
      setIsLoading(false);
    }
  }, [favorites, getProductById, isOwnWishlist]);

  // Fetch or create user's shared wishlist
  useEffect(() => {
    const fetchOrCreateWishlist = async () => {
      if (!user || isViewingShared) return;

      const { data } = await supabase
        .from("shared_wishlists")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setWishlist(data);
      }
    };

    fetchOrCreateWishlist();
  }, [user, isViewingShared]);

  const generateShareCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const createShareableLink = async () => {
    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para compartilhar sua wishlist.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingLink(true);

    try {
      let currentWishlist = wishlist;

      if (!currentWishlist) {
        const shareCode = generateShareCode();
        const { data, error } = await supabase
          .from("shared_wishlists")
          .insert({
            user_id: user.id,
            share_code: shareCode,
            name: `Lista de ${profile?.name || "Desejos"}`,
          })
          .select()
          .single();

        if (error) throw error;
        currentWishlist = data;
        setWishlist(data);
      }

      // Sync favorites to wishlist items
      await supabase
        .from("wishlist_items")
        .delete()
        .eq("wishlist_id", currentWishlist.id);

      if (favorites.length > 0) {
        await supabase.from("wishlist_items").insert(
          favorites.map((productId) => ({
            wishlist_id: currentWishlist!.id,
            product_id: productId,
          }))
        );
      }

      const shareUrl = `${window.location.origin}/wishlist/${currentWishlist.share_code}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast({
        title: "Link copiado!",
        description: "Compartilhe com seus amigos e familiares.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o link compartilhável.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isViewingShared && !wishlist) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Cart />
        <main className="container py-16 text-center">
          <HeartOff className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Lista não encontrada</h1>
          <p className="text-muted-foreground mb-6">
            Esta lista de desejos não existe ou foi removida.
          </p>
          <Button asChild>
            <Link to="/">Voltar para a loja</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Cart />

      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Gift className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                {isViewingShared ? wishlist?.name : "Minha Lista de Desejos"}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {isViewingShared
                ? `${products.length} produtos nesta lista`
                : `Você tem ${products.length} produtos salvos`}
            </p>
          </div>

          {isOwnWishlist && (
            <Button
              onClick={createShareableLink}
              disabled={isCreatingLink || products.length === 0}
              className="gap-2"
            >
              {isCreatingLink ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {copied ? "Copiado!" : "Compartilhar Lista"}
            </Button>
          )}
        </div>

        {/* Share Link Display */}
        {isOwnWishlist && wishlist && (
          <Card className="glass mb-8">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 w-full">
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Link compartilhável
                  </label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={`${window.location.origin}/wishlist/${wishlist.share_code}`}
                      className="bg-background/50"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/wishlist/${wishlist.share_code}`
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                        toast({ title: "Link copiado!" });
                      }}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card className="glass">
            <CardContent className="py-16 text-center">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lista vazia</h3>
              <p className="text-muted-foreground mb-6">
                {isViewingShared
                  ? "Esta lista ainda não tem produtos."
                  : "Adicione produtos aos favoritos para criar sua lista de desejos."}
              </p>
              <Button asChild>
                <Link to="/">Explorar Produtos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="glass group overflow-hidden">
                <div className="aspect-square relative overflow-hidden">
                  <Link to={`/produto/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>
                  {product.stock === 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute top-3 left-3"
                    >
                      Esgotado
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <Link
                    to={`/produto/${product.id}`}
                    className="font-medium hover:text-primary transition-colors line-clamp-2 mb-2 block"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xl font-bold text-primary mb-4">
                    {formatPrice(product.price)}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Comprar
                    </Button>
                    {isOwnWishlist && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFavorite(product.id)}
                      >
                        <HeartOff className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isViewingShared && (
          <>
            <Separator className="my-8" />
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Gostou desta lista? Crie a sua própria!
              </p>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/">
                  <ExternalLink className="h-4 w-4" />
                  Ir para a loja
                </Link>
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;
