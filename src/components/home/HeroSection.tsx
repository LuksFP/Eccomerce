import { useEffect, useRef } from "react";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "50k+", label: "Atletas" },
  { value: "200+", label: "Produtos" },
  { value: "99%", label: "Satisfação" },
  { value: "24h", label: "Suporte" },
];

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  useEffect(() => {
    if (!imgRef.current) return;
    gsap.fromTo(
      imgRef.current,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 1.1, delay: 0.6, ease: "expo.out" }
    );
  }, []);

  useEffect(() => {
    if (!wordRef.current) return;
    gsap.fromTo(
      wordRef.current,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9, delay: 0.2, ease: "expo.out" }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[88vh] flex flex-col justify-center"
    >
      {/* Background watermark */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden"
      >
        <span
          className="absolute -top-8 -left-8 font-display font-black text-[22vw] leading-none text-primary/[0.04] whitespace-nowrap"
          aria-hidden
        >
          VITAL
        </span>
        <span
          className="absolute bottom-0 right-0 font-display font-black text-[22vw] leading-none text-primary/[0.04] whitespace-nowrap"
          aria-hidden
        >
          ZONE
        </span>
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[hsl(28_96%_58%/0.07)] rounded-full blur-[120px]" />
      </motion.div>

      <div className="container relative">
        <div className="grid lg:grid-cols-[1fr_420px] gap-0 items-center min-h-[70vh]">
          {/* Left — text */}
          <div className="py-16 lg:py-0 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-primary mb-8 border border-primary/25 px-4 py-2 rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Nicho #1 E-commerce 2026
            </motion.div>

            <div className="overflow-hidden mb-2">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-black text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] tracking-tight text-foreground"
              >
                SUA
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-2">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-black text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] tracking-tight text-gradient"
              >
                JORNADA
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-black text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] tracking-tight text-foreground"
              >
                COMEÇA
                <span ref={wordRef} className="inline-block ml-4 text-primary align-middle text-[0.55em] leading-none border border-primary/40 rounded-full px-4 py-1">
                  AQUI
                </span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-muted-foreground text-base sm:text-lg max-w-sm mb-10 leading-relaxed"
            >
              Suplementos premium, equipamentos fitness e produtos de bem-estar
              selecionados para potencializar seus resultados.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Button size="lg" className="glow font-bold text-sm tracking-wide rounded-full px-8">
                Explorar Produtos
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="ghost" className="font-semibold text-sm rounded-full px-8 border border-border/40">
                Ver Suplementos
              </Button>
            </motion.div>

            {/* Stats — raw strip, no cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-stretch divide-x divide-border/40 border-t border-border/30 pt-8"
            >
              {stats.map((s) => (
                <div key={s.label} className="flex-1 pr-6 first:pl-0 pl-6">
                  <div className="font-display font-black text-2xl sm:text-3xl text-foreground leading-none mb-1">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — product image (overflows container intentionally) */}
          <div className="hidden lg:block relative h-full min-h-[70vh]">
            <motion.div
              ref={imgRef}
              style={{ y: imgY }}
              className="absolute inset-0 -right-16 top-0"
            >
              <div className="relative h-full w-full overflow-hidden rounded-l-[3rem]">
                <img
                  src="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=85"
                  alt="Atleta VitalZone"
                  className="h-full w-full object-cover object-center"
                />
                {/* Gradient blend left */}
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
                {/* Gradient blend bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

                {/* Floating badge */}
                <div className="absolute bottom-8 left-8 glass rounded-2xl px-5 py-4 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Novo</div>
                      <div className="font-semibold text-sm text-foreground">Pré-Treino Xtreme</div>
                    </div>
                  </div>
                </div>

                {/* Certified badge */}
                <div className="absolute top-8 right-8 glass rounded-full px-4 py-2 border border-border/30 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Certificado</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
