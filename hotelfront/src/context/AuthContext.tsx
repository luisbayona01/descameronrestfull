import { createContext, useState, useEffect, ReactNode } from "react";
import { toast } from "react-toastify";
import api from "../api/api";

interface AuthContextType {
  token: string | null;
  user: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<string | null>(() => localStorage.getItem("user"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (user) {
      localStorage.setItem("user", user);
    } else {
      localStorage.removeItem("user");
    }
  }, [token, user]);

  // ✅ Ahora login devuelve un booleano indicando si fue exitoso
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/login", { email, password });

      if (!response.data.ok) {
        toast.error(response.data.message);
        return false; // ❌ Login fallido
      }

      setToken(response.data.token);
      setUser(response.data.user.name);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", response.data.user.name);
      toast.success("Inicio de sesión exitoso");

      return true; // ✅ Login exitoso
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al iniciar sesión");
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Sesión cerrada");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
