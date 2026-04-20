import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, Eye, EyeOff, AlertCircle, ArrowLeft, Zap, HeartPulse, Leaf } from "lucide-react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const signupSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(50),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const perks = [
  { icon: Zap, text: "Acesso exclusivo a lançamentos" },
  { icon: Leaf, text: "Descontos em suplementos premium" },
  { icon: HeartPulse, text: "Histórico e rastreio de pedidos" },
];

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
      <AlertCircle className="h-3 w-3" />
      {msg}
    </p>
  ) : null;

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });

  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const r = loginSchema.safeParse(loginData);
    if (!r.success) {
      const fe: Record<string, string> = {};
      r.error.errors.forEach((err) => { if (err.path[0]) fe[err.path[0].toString()] = err.message; });
      setErrors(fe);
      return;
    }
    setIsLoading(true);
    const ok = await login(r.data.email, r.data.password);
    setIsLoading(false);
    if (ok) navigate("/");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const r = signupSchema.safeParse(signupData);
    if (!r.success) {
      const fe: Record<string, string> = {};
      r.error.errors.forEach((err) => { if (err.path[0]) fe[err.path[0].toString()] = err.message; });
      setErrors(fe);
      return;
    }
    setIsLoading(true);
    const ok = await signup(r.data.email, r.data.password, r.data.name);
    setIsLoading(false);
    if (ok) navigate("/");
  };

  const inputCls = (err?: string) =>
    `bg-background/60 border-border/40 focus:border-primary transition-colors h-12 rounded-xl text-sm ${err ? "border-destructive" : ""}`;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — brand visual */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 relative overflow-hidden p-12 bg-[hsl(150_10%_6%)] border-r border-border/20">
        {/* Background watermark */}
        <span className="absolute -bottom-8 -left-8 font-display font-black text-[18vw] lg:text-[200px] leading-none text-primary/[0.05] pointer-events-none select-none">
          VZ
        </span>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Vital<span className="text-primary">Zone</span>
          </span>
        </Link>

        {/* Center copy */}
        <div className="z-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4">
            Bem-vindo à comunidade
          </p>
          <h2 className="font-display font-black text-4xl text-foreground leading-[1.05] mb-8">
            Performance
            <br />
            começa com
            <br />
            <span className="text-gradient">o seu login.</span>
          </h2>

          <div className="space-y-4">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="z-10 border-t border-border/20 pt-6">
          <p className="text-sm text-muted-foreground italic">
            "O único treino ruim é aquele que não aconteceu."
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">
            Vital<span className="text-primary">Zone</span>
          </span>
        </Link>

        <div className="w-full max-w-[400px]">
          {/* Tab switcher — raw pill style */}
          <div className="flex bg-secondary/50 rounded-xl p-1 mb-8 border border-border/20">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrors({}); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                  tab === t
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "login" ? "Entrar" : "Cadastrar"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    disabled={isLoading}
                    className={inputCls(errors.email)}
                  />
                  <FieldError msg={errors.email} />
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      disabled={isLoading}
                      className={inputCls(errors.password) + " pr-10"}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FieldError msg={errors.password} />
                </div>

                {/* Demo */}
                <div className="rounded-xl bg-primary/8 border border-primary/15 p-3 text-xs space-y-1">
                  <p className="font-bold text-primary">Demo Admin:</p>
                  <p className="text-muted-foreground font-mono">admin.teste@mail.com / admin123</p>
                </div>

                <Button type="submit" className="w-full h-12 font-bold text-sm rounded-xl glow" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Entrar na VitalZone
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                {[
                  { id: "signup-name", label: "Nome", type: "text", placeholder: "Seu nome", key: "name" as const },
                  { id: "signup-email", label: "Email", type: "email", placeholder: "seu@email.com", key: "email" as const },
                  { id: "signup-password", label: "Senha", type: showPassword ? "text" : "password", placeholder: "••••••••", key: "password" as const },
                  { id: "signup-confirm", label: "Confirmar Senha", type: "password", placeholder: "••••••••", key: "confirmPassword" as const },
                ].map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                      {field.label}
                    </Label>
                    <div className="relative">
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={signupData[field.key]}
                        onChange={(e) => setSignupData({ ...signupData, [field.key]: e.target.value })}
                        disabled={isLoading}
                        className={inputCls(errors[field.key]) + (field.key === "password" ? " pr-10" : "")}
                      />
                      {field.key === "password" && (
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    <FieldError msg={errors[field.key]} />
                  </div>
                ))}

                <Button type="submit" className="w-full h-12 font-bold text-sm rounded-xl glow" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Criar minha conta
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/20">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar à loja
            </Link>
            <Link to="/admin-login" className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
              <Shield className="h-3 w-3" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
