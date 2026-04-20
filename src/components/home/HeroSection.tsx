import { useEffect, useRef } from "react";
import { ArrowRight, Flame, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/shared";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stats = [
  { value: 50000, suffix: "+", label: "Atletas Ativos" },
  { value: 200, suffix: "+", label: "Produtos" },
  { value: 99, suffix: "%", label: "Satisfação" },
  { value: 24, suffix: "h", label: "Suporte" },
];

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    if (!orbRef.current) return;
    gsap.to(orbRef.current, {
      y: -30,
      x: 15,
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-10 sm:py-16 lg:py-24">
      {/* Background blobs */}
      <motion.div style={{ y: yParallax }} className="absolute inset-0 -z-10 pointer-events-none">
        <div ref={orbRef} className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[hsl(28_96%_58%/0.08)] rounded-full blur-[100px]" />
        <div className="absolute top-10 right-10 w-60 h-60 bg-[hsl(270_80%_68%/0.06)] rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,hsl(82_90%_48%/0.08),transparent)]" />
      </motion.div>

      <motion.div style={{ opacity: opacityHero }} className="container">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/25 mb-6"
            >
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary tracking-wide">O Nicho #1 do E-commerce em 2026</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
            >
              <span className="text-foreground">Sua Jornada</span>
              <br />
              <span className="text-gradient">para uma Vida</span>
              <br />
              <span className="text-foreground">mais Saudável</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Suplementos premium, equipamentos fitness e produtos de bem-estar selecionados por especialistas para potencializar seus resultados.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="group glow font-semibold text-base">
                Explorar Produtos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="glass border-border/50 font-semibold text-base">
                Ver Suplementos
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10 pt-10 border-t border-border/30"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-primary" />
                <span>Entrega Rápida</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Produtos Certificados</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Flame className="h-4 w-4 text-[hsl(28_96%_58%)]" />
                <span>Fórmulas Premium</span>
              </div>
            </motion.div>
          </div>

          {/* Stats grid */}
          <div className="flex-shrink-0 grid grid-cols-2 gap-4 lg:gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={i + 2}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass rounded-2xl p-6 border border-border/30 text-center hover-glow cursor-default"
              >
                <div className="font-display text-3xl sm:text-4xl font-bold text-gradient mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
