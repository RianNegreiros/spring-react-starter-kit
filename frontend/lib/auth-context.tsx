"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, firstName: string, lastName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const clearError = () => setError(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/current", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.data;
        const normalizedUser = {
          id: userData.id || userData.userId || userData.sub,
          email: userData.email,
          name: userData.name || userData.given_name || userData.login,
          avatar_url: userData.avatarUrl || userData.avatar_url || userData.picture,
        };
        setUser(normalizedUser);
        setError(null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Login failed: ${response.status}`);
      }

      await fetchCurrentUser();
      router.push("/profile");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, firstName: string, lastName: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Registration failed: ${response.status}`);
      }

      await login(email, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
      setError("Logout failed, but you will be signed out locally");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isLoading, 
        error, 
        login, 
        register, 
        logout, 
        refreshUser: fetchCurrentUser,
        clearError 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
