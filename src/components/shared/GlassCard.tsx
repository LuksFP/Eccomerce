import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "solid";
  hover?: boolean;
  glow?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = false, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-border/50 transition-all duration-500",
          variant === "default" && "glass",
          variant === "subtle" && "glass-subtle",
          variant === "solid" && "bg-card",
          hover && "product-card-hover cursor-pointer",
          glow && "hover-glow",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";