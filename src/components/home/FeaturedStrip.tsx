import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProducts } from "@/context/ProductsContext";
import { formatPrice } from "@/utils/formatPrice";

gsap.registerPlugin(ScrollTrigger);

export const FeaturedStrip = () => {
  const { products } = useProducts();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(sectionRef as React.RefObject<Element>, { once: true, margin: "-60px" });

  const featured = products[0];
  const rest = products.slice(1, 5);

  useEffect(() => {
    if (!headingRef.current) return;
    const letters = headingRef.current.querySelectorAll(".letter");
    gsap.fromTo(
      letters,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.04,
        ease: "expo.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
        },
      }
    );
  }, [products]);

  if (!featured) return null;

  const word = "DESTAQUES";

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 overflow-hidden">
      <div className="container">
        {/* Animated heading with staggered letters */}
        <div className="mb-10 overflow-hidden">
          <h2
            ref={headingRef}
            aria-label="Destaques"
            className="font-display font-black text-[clamp(3rem,8vw,6rem)] leading-none text-foreground flex gap-[0.04em] overflow-hidden"
          >
            {word.split("").map((char, i) => (
              <span key={i} className="letter inline-block opacity-0">
                {char}
              </span>
            ))}
            <span className="letter inline-block opacity-0 text-primary ml-2">.</span>
          </h2>
        </div>

        {/* Asymmetric layout: big featured on left, 4 small stacked/scrollable on right */}
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
          {/* Big featured card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to={`/produto/${featured.id}`} className="block group">
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-[16/12] lg:aspect-auto lg:h-[520px] border border-border/20">
                <img
                  src={featured.image}
                  alt={featured.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Category */}
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-primary text-primary-foreground">
                    Suplementos
                  </span>
                </div>

                {/* Discount */}
                {featured.originalPrice && (
                  <div className="absolute top-5 right-5 text-xs font-black bg-destructive text-white px-2.5 py-1 rounded-full">
                    -{Math.round(((featured.originalPrice - featured.price) / featured.originalPrice) * 100)}%
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-2 font-medium">
                    Produto em destaque
                  </p>
                  <h3 className="font-display font-black text-white text-2xl sm:text-3xl leading-tight mb-3">
                    {featured.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-6 line-clamp-2 max-w-sm">
                    {featured.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-black text-primary text-2xl">{formatPrice(featured.price)}</span>
                      {featured.originalPrice && (
                        <span className="text-white/30 line-through text-sm ml-2">{formatPrice(featured.originalPrice)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300">
                      Ver produto <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* 4 small cards in 2x2 grid — offset to create depth */}
          <div className="grid grid-cols-2 gap-4 lg:mt-8">
            {rest.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/produto/${p.id}`} className="block group">
                  <div className="relative overflow-hidden rounded-xl aspect-[3/4] border border-border/20">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-106"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="font-display font-bold text-white text-xs sm:text-sm line-clamp-2 mb-1">
                        {p.name}
                      </p>
                      <span className="font-black text-primary text-xs sm:text-sm">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
