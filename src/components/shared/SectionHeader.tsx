import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeader = ({
  badge,
  title,
  highlight,
  description,
  align = "left",
  className,
}: SectionHeaderProps) => {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {badge && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {badge}
        </span>
      )}
      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
        {title}
        {highlight && <span className="text-gradient"> {highlight}</span>}
      </h2>
      {description && (
        <p className="mt-3 text-muted-foreground max-w-2xl text-sm sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
};