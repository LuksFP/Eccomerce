import { useRef } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, HeartPulse, Leaf, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/shared";
import { motion, useInView } from "framer-motion";

const categories = [
  {
    id: "suplementos",
    name: "Suple\nmentos",
    description: "Whey, creatina, vitaminas e pré-treino para máxima performance",
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
    accent: "hsl(82 90% 48%)",
    count: 5,
    span: "lg:row-span-2",
    aspectMobile: "aspect-[4/3]",
    aspectDesktop: "lg:h-full lg:min-h-[480px]",
  },
  {
    id: "fitness",
    name: "Fitness",
    description: "Equipamentos para treinar em qualquer lugar",
    icon: Dumbbell,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
    accent: "hsl(28 96% 58%)",
    count: 4,
    span: "",
    aspectMobile: "aspect-[4/3]",
    aspectDesktop: "lg:h-[230px]",
  },
  {
    id: "bem-estar",
    name: "Bem-estar",
    description: "Recuperação, sono e qualidade de vida",
    icon: HeartPulse,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
    accent: "hsl(270 80% 68%)",
    count: 3,
    span: "",
    aspectMobile: "aspect-[4/3]",
    aspectDesktop: "lg:h-[230px]",
  },
];

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
          description="Encontre o que você precisa para evoluir na sua jornada"
          className="mb-10"
        />

        {/* Asymmetric grid: first item spans 2 rows on desktop */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr] lg:grid-rows-2 gap-4"
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={cat.span}
            >
              <Link to={`/?category=${cat.id}`} className="block h-full">
                <div
                  className={`group relative overflow-hidden rounded-2xl ${cat.aspectMobile} ${cat.aspectDesktop} border border-border/20`}
                >
                  {/* Image */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300 group-hover:from-black/90" />

                  {/* Accent bar on hover */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: cat.accent }}
                  />

                  {/* Icon top left */}
                  <div
                    className="absolute top-5 left-5 w-11 h-11 rounded-xl flex items-center justify-center border border-white/10"
                    style={{ background: `${cat.accent}22` }}
                  >
                    <cat.icon className="h-5 w-5" style={{ color: cat.accent }} />
                  </div>

                  {/* Count top right */}
                  <div className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-widest text-white/50 border border-white/10 rounded-full px-2.5 py-1">
                    {cat.count} produtos
                  </div>

                  {/* Text bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3
                      className="font-display font-black text-white leading-none mb-2 whitespace-pre-line"
                      style={{
                        fontSize: i === 0 ? "clamp(2rem, 4vw, 3.2rem)" : "clamp(1.5rem, 3vw, 2rem)",
                      }}
                    >
                      {cat.name}
                    </h3>
                    <p className="text-white/60 text-sm leading-snug max-w-[240px] mb-4 line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300" style={{ color: cat.accent }}>
                      Ver todos
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
