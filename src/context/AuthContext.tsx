import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface LoginResponse {
  access_token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

const login = async (username: string, password: string) => {
  const response = await api.post<LoginResponse>("/auth/login", { username, password });
  const accessToken = response.data.access_token;

  if (!accessToken) throw new Error("Token não recebido da API");

  localStorage.setItem("token", accessToken);
  localStorage.setItem("user", JSON.stringify({ username }));

  setToken(accessToken);
  setUser({ username });
};



  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}






