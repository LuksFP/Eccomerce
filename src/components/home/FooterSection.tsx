import { Link } from "react-router-dom";
import { Leaf, Instagram, Twitter, Youtube, ArrowUpRight } from "lucide-react";

const links = {
  Loja: [
    { label: "Suplementos", to: "/?category=suplementos" },
    { label: "Fitness", to: "/?category=fitness" },
    { label: "Bem-estar", to: "/?category=bem-estar" },
    { label: "Ofertas", to: "/" },
  ],
  Conta: [
    { label: "Entrar", to: "/auth" },
    { label: "Cadastrar", to: "/auth" },
    { label: "Meus Pedidos", to: "/meus-pedidos" },
    { label: "Favoritos", to: "/meus-pedidos?tab=favorites" },
  ],
  Suporte: [
    { label: "FAQ", to: "/faq" },
    { label: "Rastrear Pedido", to: "/rastrear-pedido" },
    { label: "Trocas e Devoluções", to: "/faq" },
    { label: "Fale Conosco", to: "/faq" },
  ],
};

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "X (Twitter)", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export const FooterSection = () => (
  <footer className="border-t border-border/30 bg-[hsl(150_10%_4%)]">
    <div className="container py-16">
      <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Vital<span className="text-primary">Zone</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px] mb-6">
            Suplementos premium, equipamentos fitness e produtos de bem-estar para potencializar sua performance.
          </p>
          <div className="flex gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-secondary/50 border border-border/20 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([title, items]) => (
          <div key={title}>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">
              {title}
            </p>
            <ul className="space-y-3">
              {items.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
        <p>© 2026 VitalZone. Todos os direitos reservados.</p>
        <div className="flex items-center gap-5">
          <Link to="/admin-login" className="hover:text-muted-foreground transition-colors">
            Acesso Admin
          </Link>
          <span>Feito com precisão e propósito.</span>
        </div>
      </div>
    </div>
  </footer>
);
