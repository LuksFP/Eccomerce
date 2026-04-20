import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useInView } from "framer-motion";

export const NewsletterSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="container">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-transparent to-[hsl(28_96%_58%/0.05)] p-10 sm:p-16 text-center"
        >
          {/* Blobs */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[hsl(28_96%_58%/0.08)] rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4"
            >
              Newsletter exclusiva
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight mb-4"
            >
              Lançamentos &amp; ofertas
              <br />
              <span className="text-gradient">direto no seu email.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed"
            >
              Receba primeiras novidades, dicas de nutrição e descontos exclusivos
              para assinantes. Sem spam, só conteúdo que agrega.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {submitted ? (
                <div className="flex items-center justify-center gap-3 text-primary font-semibold">
                  <CheckCircle2 className="h-5 w-5" />
                  Inscrito com sucesso! Bem-vindo à comunidade VitalZone.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="flex-1 h-12 px-5 rounded-full bg-background/60 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="submit"
                    className="h-12 px-7 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:bg-primary/90 transition-all glow flex items-center gap-2 justify-center whitespace-nowrap"
                  >
                    Inscrever-se
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
              <p className="text-xs text-muted-foreground/60 mt-4">
                Ao se inscrever, você concorda com nossa política de privacidade. Cancele quando quiser.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
