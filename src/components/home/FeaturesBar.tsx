import { Truck, CreditCard, Headphones, RefreshCcw } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Acima de R$ 199",
  },
  {
    icon: CreditCard,
    title: "Parcelamento",
    description: "Em até 12x",
  },
  {
    icon: RefreshCcw,
    title: "Troca Fácil",
    description: "30 dias garantidos",
  },
  {
    icon: Headphones,
    title: "Suporte 24h",
    description: "Sempre disponível",
  },
];

export const FeaturesBar = () => {
  return (
    <section className="py-8 border-y border-border/30 glass-subtle">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm sm:text-base">
                  {feature.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};