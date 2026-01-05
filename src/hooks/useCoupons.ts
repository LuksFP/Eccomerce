import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/context/NotificationsContext";

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number | null;
  maxUses: number | null;
  usedCount: number;
  validFrom: Date;
  validUntil: Date | null;
  isActive: boolean;
};

export type CouponValidation = {
  isValid: boolean;
  discount: number;
  message: string;
  coupon?: Coupon;
};

export const useCoupons = () => {
  const [isValidating, setIsValidating] = useState(false);
  const { addNotification } = useNotifications();

  const validateCoupon = useCallback(
    async (code: string, subtotal: number): Promise<CouponValidation> => {
      if (!code.trim()) {
        return { isValid: false, discount: 0, message: "Digite um código de cupom" };
      }

      setIsValidating(true);

      try {
        const { data, error } = await supabase
          .from("coupons")
          .select("*")
          .eq("code", code.toUpperCase().trim())
          .eq("is_active", true)
          .maybeSingle();

        if (error || !data) {
          return { isValid: false, discount: 0, message: "Cupom inválido ou não encontrado" };
        }

        const now = new Date();
        
        // Check if expired
        if (data.valid_until && new Date(data.valid_until) < now) {
          return { isValid: false, discount: 0, message: "Este cupom expirou" };
        }

        // Check if not yet valid
        if (new Date(data.valid_from) > now) {
          return { isValid: false, discount: 0, message: "Este cupom ainda não está ativo" };
        }

        // Check minimum purchase
        if (data.min_purchase && subtotal < Number(data.min_purchase)) {
          return {
            isValid: false,
            discount: 0,
            message: `Compra mínima de R$ ${Number(data.min_purchase).toFixed(2)} necessária`,
          };
        }

        // Check max uses
        if (data.max_uses && data.used_count >= data.max_uses) {
          return { isValid: false, discount: 0, message: "Cupom esgotado" };
        }

        // Calculate discount
        let discount = 0;
        if (data.discount_type === "percentage") {
          discount = subtotal * (Number(data.discount_value) / 100);
        } else {
          discount = Math.min(Number(data.discount_value), subtotal);
        }

        const coupon: Coupon = {
          id: data.id,
          code: data.code,
          description: data.description,
          discountType: data.discount_type as "percentage" | "fixed",
          discountValue: Number(data.discount_value),
          minPurchase: data.min_purchase ? Number(data.min_purchase) : null,
          maxUses: data.max_uses,
          usedCount: data.used_count,
          validFrom: new Date(data.valid_from),
          validUntil: data.valid_until ? new Date(data.valid_until) : null,
          isActive: data.is_active,
        };

        const discountText =
          data.discount_type === "percentage"
            ? `${data.discount_value}% de desconto`
            : `R$ ${Number(data.discount_value).toFixed(2)} de desconto`;

        addNotification({
          type: "promotion",
          title: "Cupom aplicado!",
          message: `${data.code}: ${discountText}`,
        });

        return {
          isValid: true,
          discount,
          message: data.description || discountText,
          coupon,
        };
      } catch {
        return { isValid: false, discount: 0, message: "Erro ao validar cupom" };
      } finally {
        setIsValidating(false);
      }
    },
    [addNotification]
  );

  const fetchActiveCoupons = useCallback(async (): Promise<Coupon[]> => {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((c) => ({
      id: c.id,
      code: c.code,
      description: c.description,
      discountType: c.discount_type as "percentage" | "fixed",
      discountValue: Number(c.discount_value),
      minPurchase: c.min_purchase ? Number(c.min_purchase) : null,
      maxUses: c.max_uses,
      usedCount: c.used_count,
      validFrom: new Date(c.valid_from),
      validUntil: c.valid_until ? new Date(c.valid_until) : null,
      isActive: c.is_active,
    }));
  }, []);

  return {
    validateCoupon,
    fetchActiveCoupons,
    isValidating,
  };
};
