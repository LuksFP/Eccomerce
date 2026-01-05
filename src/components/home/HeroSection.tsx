import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/shared";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-8 sm:py-12 lg:py-20">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/5 rounded-full animate-spin-slow" />
      </div>

      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Nova Coleção 2024</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Descubra o</span>
              <br />
              <span className="text-gradient">Futuro do Estilo</span>
            </h1>

            {/* Subheadline */}
            <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 mb-8">
              Produtos exclusivos de eletrônicos, moda e acessórios com design premium e qualidade incomparável.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="group glow">
                Explorar Coleção
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="glass border-border/50">
                Ver Ofertas
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10 pt-10 border-t border-border/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-primary" />
                <span>Entrega Expressa</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Compra Segura</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-shrink-0 grid grid-cols-2 gap-4 lg:gap-6">
            {[
              { value: 15000, suffix: "+", label: "Clientes Ativos" },
              { value: 500, suffix: "+", label: "Produtos" },
              { value: 98, suffix: "%", label: "Satisfação" },
              { value: 24, suffix: "h", label: "Suporte" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-6 border border-border/30 text-center hover-glow transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="font-display text-3xl sm:text-4xl font-bold text-gradient mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};