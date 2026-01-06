import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Loader2, Eye, EyeOff, AlertCircle, Lock, KeyRound } from "lucide-react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin && !authLoading) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const success = await login(result.data.email, result.data.password);
    
    if (success) {
      // Wait a bit for the auth state to update
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  };

  // Show access denied if logged in but not admin
  if (isAuthenticated && !isAdmin && !authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900 border-red-500/30">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-white">Acesso Negado</CardTitle>
            <CardDescription className="text-slate-400">
              Você não tem permissões de administrador.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={() => navigate("/")}
            >
              Voltar para a Loja
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-slate-400 hover:text-white"
              onClick={() => navigate("/auth")}
            >
              Entrar com outra conta
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-white">
              Painel Administrativo
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              LojaElegante • Área Restrita
            </p>
          </div>
        </div>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
          <form onSubmit={handleLogin}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-500" />
                Acesso Restrito
              </CardTitle>
              <CardDescription className="text-slate-400">
                Entre com suas credenciais de administrador
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-slate-300">
                  Email Administrativo
                </Label>
                <div className="relative">
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@empresa.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    disabled={isLoading}
                    className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-slate-300">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    disabled={isLoading}
                    className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Demo credentials */}
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-500">
                  <KeyRound className="h-4 w-4" />
                  Credenciais de Teste
                </div>
                <div className="text-sm text-slate-400 font-mono">
                  <p>Email: admin.teste@mail.com</p>
                  <p>Senha: admin123</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-lg shadow-amber-500/25" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isLoading ? "Verificando..." : "Acessar Painel"}
              </Button>
              
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              
              <div className="flex items-center justify-between w-full text-sm">
                <Link 
                  to="/" 
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  ← Voltar para a Loja
                </Link>
                <Link 
                  to="/auth" 
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Login de Cliente →
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-600">
          <Lock className="h-3 w-3" />
          <span>Conexão segura • Acesso monitorado</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
