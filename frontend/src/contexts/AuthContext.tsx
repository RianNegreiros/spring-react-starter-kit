import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar_url?: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const clearError = () => setError(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/current`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        const userData = data.data;
        const normalizedUser: User = {
          id: userData.id || userData.userId || userData.sub,
          email: userData.email,
          firstName: userData.firstName || userData.given_name || "",
          lastName: userData.lastName || userData.family_name || "",
          avatar_url:
            userData.avatarUrl || userData.avatar_url || userData.picture,
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Login failed: ${response.status}`);
      }

      await fetchCurrentUser();
      navigate("/profile");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, firstName, lastName, password }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Registration failed: ${response.status}`,
        );
      }

      await login(email, password);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setError(null);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
      setError("Logout failed, but you will be signed out locally");
    } finally {
      setUser(null);
      navigate("/login");
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
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
