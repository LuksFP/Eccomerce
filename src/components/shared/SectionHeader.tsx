import { useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";

interface SectionHeaderProps {
  badge?: string | React.ReactNode;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const SectionHeader = ({
  badge,
  title,
  highlight,
  description,
  align = "left",
  className,
}: SectionHeaderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className={cn(align === "center" && "text-center", className)}>
      {badge && (
        <motion.span
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {badge}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={1}
        className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight"
      >
        {title}
        {highlight && <span className="text-gradient"> {highlight}</span>}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={2}
          className="mt-3 text-muted-foreground max-w-2xl text-sm sm:text-base"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};
