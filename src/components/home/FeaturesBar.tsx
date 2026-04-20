import { useRef } from "react";
import { Truck, CreditCard, Headphones, FlaskConical } from "lucide-react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Acima de R$ 199",
  },
  {
    icon: FlaskConical,
    title: "Qualidade Certificada",
    description: "Produtos testados em lab",
  },
  {
    icon: CreditCard,
    title: "Parcelamento",
    description: "Em até 12x sem juros",
  },
  {
    icon: Headphones,
    title: "Suporte Especialista",
    description: "Nutricionistas online 24h",
  },
];

export const FeaturesBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="py-8 border-y border-border/30 glass-subtle">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ y: -4 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm sm:text-base">
                  {feature.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
