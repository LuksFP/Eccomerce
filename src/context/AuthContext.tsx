import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, AuthState, LoginCredentials, SignupData, UserRole } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

type AuthContextType = AuthState & {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "ecommerce-auth";
const USERS_STORAGE_KEY = "ecommerce-users";

// Demo admin account
const DEMO_ADMIN: User = {
  id: "admin-001",
  email: "admin@loja.com",
  name: "Administrador",
  role: "admin",
  createdAt: new Date("2024-01-01"),
};

const DEMO_ADMIN_PASSWORD = "admin123";

type StoredUser = User & { password: string };

const getStoredUsers = (): StoredUser[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      // Initialize with demo admin
      const initial: StoredUser[] = [{ ...DEMO_ADMIN, password: DEMO_ADMIN_PASSWORD }];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  } catch {
    return [{ ...DEMO_ADMIN, password: DEMO_ADMIN_PASSWORD }];
  }
};

const saveStoredUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load auth state on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored) as User;
        setState({ user, isAuthenticated: true, isLoading: false });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    const { email, password } = credentials;
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getStoredUsers();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
      return false;
    }

    const { password: _, ...user } = foundUser;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });

    toast({
      title: "Bem-vindo!",
      description: `Olá, ${user.name}!`,
    });

    return true;
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    const { email, password, name } = data;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getStoredUsers();
    
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      toast({
        title: "Erro no cadastro",
        description: "Este email já está em uso.",
        variant: "destructive",
      });
      return false;
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: "user" as UserRole,
      createdAt: new Date(),
      password,
    };

    users.push(newUser);
    saveStoredUsers(users);

    const { password: _, ...user } = newUser;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });

    toast({
      title: "Conta criada!",
      description: "Bem-vindo à nossa loja!",
    });

    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
    toast({
      title: "Até logo!",
      description: "Você foi desconectado.",
    });
  }, []);

  const isAdmin = state.user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
