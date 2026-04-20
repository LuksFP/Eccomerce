import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Ticket, Copy, Percent, Clock, Tag } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_purchase: number | null;
  valid_until: string | null;
};

const staticCoupons: Coupon[] = [
  {
    id: "static-1",
    code: "VITALNEW",
    description: "10% off na primeira compra para novos clientes",
    discount_type: "percentage",
    discount_value: 10,
    min_purchase: null,
    valid_until: null,
  },
  {
    id: "static-2",
    code: "FRETEGRATIS",
    description: "Frete grátis em qualquer pedido acima de R$ 150",
    discount_type: "shipping",
    discount_value: 0,
    min_purchase: 150,
    valid_until: null,
  },
  {
    id: "static-3",
    code: "WHEY15",
    description: "15% off em todos os suplementos proteicos",
    discount_type: "percentage",
    discount_value: 15,
    min_purchase: 200,
    valid_until: null,
  },
];

const accentByIndex = [
  { pill: "bg-primary/15 text-primary border-primary/20", value: "text-primary" },
  { pill: "bg-[hsl(28_96%_58%/0.15)] text-[hsl(28_96%_58%)] border-[hsl(28_96%_58%/0.2)]", value: "text-[hsl(28_96%_58%)]" },
  { pill: "bg-[hsl(270_80%_68%/0.15)] text-[hsl(270_80%_68%)] border-[hsl(270_80%_68%/0.2)]", value: "text-[hsl(270_80%_68%)]" },
];

export const CouponsSection = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    const fetchCoupons = async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("is_active", true)
        .order("discount_value", { ascending: false })
        .limit(3);

      setCoupons(!error && data && data.length > 0 ? data : staticCoupons);
    };
    fetchCoupons();
  }, []);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: "Cupom copiado!", description: `Código ${code} copiado.` });
    } catch {
      toast({ title: "Erro ao copiar", variant: "destructive" });
    }
  };

  const formatDiscount = (c: Coupon) => {
    if (c.discount_type === "percentage") return `${c.discount_value}% OFF`;
    if (c.discount_type === "shipping") return "Frete Grátis";
    return `${formatPrice(c.discount_value)} OFF`;
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="container">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-2">
              Promoções
            </p>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-foreground">
              Cupons <span className="text-gradient">disponíveis.</span>
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground border border-border/20 rounded-full px-4 py-2">
            <Tag className="h-3.5 w-3.5 text-primary" />
            Use no checkout
          </div>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {coupons.map((coupon, i) => {
            const accent = accentByIndex[i % accentByIndex.length];
            return (
              <motion.div
                key={coupon.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ y: -5 }}
                className="relative overflow-hidden rounded-2xl border border-border/20 bg-card/40 backdrop-blur-sm p-5"
              >
                {/* Decorative corner */}
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-current opacity-[0.04]" />

                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${accent.pill}`}>
                    <Ticket className="h-3 w-3" />
                    Cupom
                  </span>
                  <span className={`font-display font-black text-xl ${accent.value}`}>
                    {formatDiscount(coupon)}
                  </span>
                </div>

                <p className="text-sm text-foreground font-medium mb-1 line-clamp-2">
                  {coupon.description || "Desconto exclusivo VitalZone"}
                </p>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
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
                  <div className="flex-1 px-3 py-2.5 rounded-xl bg-background/60 border border-dashed border-border/40 font-mono text-sm font-black tracking-widest text-center text-foreground">
                    {coupon.code}
                  </div>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => copyToClipboard(coupon.code)}
                    className="rounded-xl flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
