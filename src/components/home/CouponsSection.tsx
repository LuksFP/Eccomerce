import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Ticket, Copy, Percent, Clock, Sparkles } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_purchase: number | null;
  valid_until: string | null;
};

export const CouponsSection = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("is_active", true)
        .order("discount_value", { ascending: false })
        .limit(3);

      if (!error && data) {
        setCoupons(data);
      }
      setIsLoading(false);
    };

    fetchCoupons();
  }, []);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Cupom copiado!",
        description: `O código ${code} foi copiado para sua área de transferência.`,
      });
    } catch {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código.",
        variant: "destructive",
      });
    }
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discount_type === "percentage") {
      return `${coupon.discount_value}% OFF`;
    }
    return formatPrice(coupon.discount_value) + " OFF";
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      "from-primary/20 to-primary/5 border-primary/30",
      "from-purple-500/20 to-purple-500/5 border-purple-500/30",
      "from-warning/20 to-warning/5 border-warning/30",
    ];
    return gradients[index % gradients.length];
  };

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl shimmer" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (coupons.length === 0) return null;

  return (
    <section className="py-12 overflow-hidden">
      <div className="container">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Cupons Disponíveis</h2>
            <p className="text-muted-foreground text-sm">Use no checkout e economize</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map((coupon, index) => (
            <Card
              key={coupon.id}
              className={`relative overflow-hidden border-2 bg-gradient-to-br ${getGradientClass(index)} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
            >
              {/* Decorative elements */}
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-current opacity-5" />
              <div className="absolute -left-3 -bottom-3 w-16 h-16 rounded-full bg-current opacity-5" />
              
              <CardContent className="p-5 relative">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="gap-1.5 text-xs">
                    <Ticket className="h-3 w-3" />
                    Cupom
                  </Badge>
                  <div className="font-display text-2xl font-bold text-primary">
                    {formatDiscount(coupon)}
                  </div>
                </div>

                <p className="text-sm text-foreground mb-3 line-clamp-2">
                  {coupon.description || "Aproveite este desconto exclusivo!"}
                </p>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                  {coupon.min_purchase && coupon.min_purchase > 0 && (
                    <span className="flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      Mín: {formatPrice(coupon.min_purchase)}
                    </span>
                  )}
                  {coupon.valid_until && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Até {new Date(coupon.valid_until).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 rounded-lg bg-background/50 border border-dashed border-border font-mono text-sm font-bold tracking-wider text-center">
                    {coupon.code}
                  </div>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => copyToClipboard(coupon.code)}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
