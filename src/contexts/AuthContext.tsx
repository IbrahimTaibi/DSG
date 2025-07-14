import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";

interface Address {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "store" | "admin" | "delivery";
  avatar?: string;
  mobile?: string;
  address?: Address;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
  login: (
    mobile: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email?: string;
    mobile: string;
    address?: Address;
    password: string;
    role: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
  setError: (error: string) => void;
  forgotPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (
    id: string,
    token: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  updateUser: (
    data: Partial<User>,
  ) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to set auth cookie
  const setAuthCookie = (token: string) => {
    if (typeof document !== 'undefined') {
      document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    }
  };

  // Helper function to clear auth cookie
  const clearAuthCookie = () => {
    if (typeof document !== 'undefined') {
      document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Ensure cookie is set for SSR
      if (typeof document !== 'undefined') {
        document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      }
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010"
        }/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUser(response.data.user);
    } catch {
      localStorage.removeItem("authToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (mobile: string, password: string) => {
    setError("");
    try {
      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010"
        }/api/auth/login`,
        { mobile, password },
      );
      if (response.data && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        setAuthCookie(response.data.token);
        setUser(response.data.user || null);
        return { success: true };
      } else {
        setError("Erreur inattendue. Veuillez réessayer.");
        return {
          success: false,
          error: "Erreur inattendue. Veuillez réessayer.",
        };
      }
    } catch (err: unknown) {
      let errorMsg = "Échec de la connexion";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          errorMsg = "Numéro de mobile ou mot de passe incorrect.";
        } else if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const register = async (data: {
    name: string;
    email?: string;
    mobile: string;
    address?: Address;
    password: string;
    role: string;
  }) => {
    setError("");
    try {
      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010"
        }/api/auth/register`,
        data,
      );
      if (response.data && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        setAuthCookie(response.data.token);
        setUser(response.data.user || null);
        return { success: true };
      } else {
        setError("Erreur inattendue lors de l'inscription.");
        return {
          success: false,
          error: "Erreur inattendue lors de l'inscription.",
        };
      }
    } catch (err: unknown) {
      let errorMsg = "Échec de l'inscription";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          const msg = err.response?.data?.message || "";
          if (msg.includes("mobile")) {
            errorMsg = "Ce numéro de mobile est déjà utilisé.";
          } else if (msg.includes("email")) {
            errorMsg = "Cet email est déjà utilisé.";
          } else if (msg.includes("password")) {
            errorMsg = "Le mot de passe n'est pas valide.";
          } else if (msg.includes("required")) {
            errorMsg = "Veuillez remplir tous les champs obligatoires.";
          } else {
            errorMsg =
              "Erreur de validation. Veuillez vérifier vos informations.";
          }
        } else if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    clearAuthCookie();
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(""), []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      await axios.post(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010"
        }/api/auth/forgot-password`,
        {
          email,
        },
      );
      return { success: true };
    } catch (err: unknown) {
      let errorMsg = "Erreur lors de la demande de réinitialisation.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  const resetPassword = async (id: string, token: string, password: string) => {
    try {
      await axios.post(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010"
        }/api/auth/reset-password`,
        {
          id,
          token,
          password,
        },
      );
      return { success: true };
    } catch (err: unknown) {
      let errorMsg = "Erreur lors de la réinitialisation.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");
      const response = await axios.put(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010"
        }/api/auth/me`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUser(response.data.user);
      return { success: true };
    } catch (err: unknown) {
      let errorMsg = "Erreur lors de la mise à jour du profil.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    setError,
    forgotPassword,
    resetPassword,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
