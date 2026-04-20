import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";

const NotFound = () => {
  const location = useLocation();
  const numberRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!numberRef.current || !lineRef.current) return;

    gsap.fromTo(
      numberRef.current,
      { y: 80, opacity: 0, skewY: 6 },
      { y: 0, opacity: 1, skewY: 0, duration: 1, ease: "expo.out", delay: 0.1 }
    );
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left" },
      { scaleX: 1, duration: 0.9, ease: "expo.out", delay: 0.5 }
    );
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 overflow-hidden relative">
      {/* Background giant text */}
      <span
        className="absolute select-none pointer-events-none font-display font-black text-[45vw] leading-none text-foreground/[0.025] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
        aria-hidden
      >
        404
      </span>

      {/* Accent blob */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">
        {/* Giant 404 */}
        <div ref={numberRef} className="overflow-hidden mb-2">
          <span className="font-display font-black text-[clamp(6rem,22vw,14rem)] leading-none text-gradient select-none">
            404
          </span>
        </div>

        {/* Divider line */}
        <div ref={lineRef} className="h-px bg-primary/40 mb-8" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-3">
            Página não encontrada
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-4 leading-tight">
            Você saiu do caminho
            <br />
            <span className="text-muted-foreground font-normal text-lg sm:text-xl">
              mas tudo bem — a loja ainda está aqui.
            </span>
          </h2>
          <p className="text-muted-foreground text-sm mb-10 leading-relaxed">
            A página{" "}
            <code className="text-primary text-xs bg-primary/10 rounded px-1.5 py-0.5 font-mono">
              {location.pathname}
            </code>{" "}
            não existe. Volte para a loja e continue sua jornada.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-bold rounded-full px-8 py-3.5 text-sm tracking-wide hover:bg-primary/90 transition-colors glow"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a VitalZone
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
