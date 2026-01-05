import { Link } from "react-router-dom";
import { Laptop, Shirt, Watch, ArrowUpRight } from "lucide-react";
import { SectionHeader, GlassCard } from "@/components/shared";

const categories = [
  {
    id: "eletronicos",
    name: "Eletrônicos",
    description: "Tecnologia de ponta",
    icon: Laptop,
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    count: 120,
  },
  {
    id: "roupas",
    name: "Roupas",
    description: "Moda contemporânea",
    icon: Shirt,
    color: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
    count: 85,
  },
  {
    id: "acessorios",
    name: "Acessórios",
    description: "Detalhes que importam",
    icon: Watch,
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
    count: 64,
  },
];

export const CategoryGrid = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container">
        <SectionHeader
          badge="Categorias"
          title="Explore por"
          highlight="Categoria"
          description="Encontre exatamente o que você procura em nossas categorias cuidadosamente selecionadas"
          className="mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link key={category.id} to={`/?category=${category.id}`}>
              <GlassCard
                hover
                glow
                className="group relative overflow-hidden p-6 sm:p-8 h-full min-h-[200px]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient bg */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 ${category.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-7 w-7" />
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-gradient transition-all">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {category.count} produtos
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};