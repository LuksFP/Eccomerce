import { useRef } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, HeartPulse, Leaf, ArrowUpRight } from "lucide-react";
import { SectionHeader, GlassCard } from "@/components/shared";
import { motion, useInView } from "framer-motion";

const categories = [
  {
    id: "suplementos",
    name: "Suplementos",
    description: "Whey, creatina, vitaminas e muito mais",
    icon: Leaf,
    color: "from-primary/25 to-[hsl(142_76%_46%/0.15)]",
    iconColor: "text-primary",
    iconBg: "bg-primary/15",
    count: 5,
  },
  {
    id: "fitness",
    name: "Fitness",
    description: "Equipamentos para treinar onde quiser",
    icon: Dumbbell,
    color: "from-[hsl(28_96%_58%/0.25)] to-[hsl(22_100%_55%/0.15)]",
    iconColor: "text-[hsl(28_96%_58%)]",
    iconBg: "bg-[hsl(28_96%_58%/0.15)]",
    count: 4,
  },
  {
    id: "bem-estar",
    name: "Bem-estar",
    description: "Recuperação, sono e qualidade de vida",
    icon: HeartPulse,
    color: "from-[hsl(270_80%_68%/0.25)] to-[hsl(290_75%_60%/0.15)]",
    iconColor: "text-[hsl(270_80%_68%)]",
    iconBg: "bg-[hsl(270_80%_68%/0.15)]",
    count: 3,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export const CategoryGrid = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container">
        <SectionHeader
          badge="Categorias"
          title="Explore por"
          highlight="Categoria"
          description="Encontre exatamente o que você precisa para evoluir na sua jornada de saúde e performance"
          className="mb-10"
        />

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={cardVariants}>
              <Link to={`/?category=${category.id}`}>
                <GlassCard
                  hover
                  glow
                  className="group relative overflow-hidden p-6 sm:p-8 h-full min-h-[220px]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: [0, -8, 8, 0], scale: 1.15 }}
                      transition={{ duration: 0.5 }}
                      className={`w-14 h-14 rounded-2xl ${category.iconBg} flex items-center justify-center mb-6`}
                    >
                      <category.icon className={`h-7 w-7 ${category.iconColor}`} />
                    </motion.div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-gradient transition-all">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">
                        {category.count} produtos
                      </span>
                      <motion.div
                        whileHover={{ x: 3, y: -3 }}
                        className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
