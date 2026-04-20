import { useRef } from "react";
import { Star, Quote } from "lucide-react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    name: "Mariana Costa",
    role: "Atleta de Crossfit",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    rating: 5,
    text: "O Whey Protein da VitalZone é o melhor que já usei. Resultado real em 3 semanas de treino. Suporte impecável e entrega super rápida.",
    product: "Whey Protein Gold Standard",
  },
  {
    name: "Rafael Mendes",
    role: "Personal Trainer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    rating: 5,
    text: "Recomendo para todos os meus alunos. Qualidade certificada, preço justo e a creatina chegou em 2 dias. Excelente custo-benefício.",
    product: "Creatina Monohidratada",
  },
  {
    name: "Julia Ferreira",
    role: "Praticante de Yoga",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
    rating: 5,
    text: "O tapete de yoga é incrível. Grip perfeito, super resistente e chegou bem embalado. O kit de aromaterapia então... virou meu ritual diário.",
    product: "Tapete Yoga Premium + Kit Aromaterapia",
  },
];

export const TestimonialsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background element */}
      <div className="absolute inset-0 -z-10 bg-[hsl(150_10%_6%/0.6)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-3"
            >
              Depoimentos
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight"
            >
              O que nossos
              <br />
              <span className="text-gradient">atletas dizem.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-3 text-sm text-muted-foreground"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <span><strong className="text-foreground">4.9</strong> / 5 · 2.400+ avaliações</span>
          </motion.div>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="relative group rounded-2xl border border-border/20 bg-card/40 backdrop-blur-sm p-6 sm:p-7 hover:border-primary/20 transition-colors duration-300"
            >
              {/* Quote icon */}
              <div className="absolute top-5 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-10 w-10 text-primary" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                "{t.text}"
              </p>

              {/* Product pill */}
              <div className="mb-5 inline-block">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-2.5 py-1">
                  {t.product}
                </span>
              </div>

              {/* Avatar + info */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/20">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-border/30"
                />
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
