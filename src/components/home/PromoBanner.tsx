import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

export const PromoBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.0]);

  return (
    <section ref={ref} className="py-8">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border border-border/20 min-h-[420px] sm:min-h-[480px] flex items-center">
          {/* Background image with parallax */}
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=85"
              alt="Promoção VitalZone"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-primary bg-primary/15 border border-primary/25 rounded-full px-4 py-1.5 mb-6"
            >
              <Flame className="h-3.5 w-3.5" />
              Oferta limitada
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-4"
            >
              Até <span className="text-primary">30% off</span>
              <br />
              em suplementos
              <br />
              premium.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/60 text-base sm:text-lg mb-8 leading-relaxed"
            >
              Aproveite descontos exclusivos nos melhores produtos para performance e bem-estar.
              Estoque limitado.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/?category=suplementos"
                className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-bold rounded-full px-8 py-3.5 text-sm tracking-wide hover:bg-primary/90 transition-all duration-200 glow group"
              >
                Aproveitar agora
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
