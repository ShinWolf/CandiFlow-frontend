import { createContext, useContext, useState, type ReactNode } from "react";
import { type UserProfile } from "../api/user";

interface AuthContextType {
  token: string | null;
  profile: UserProfile | null;
  login: (token: string) => void;
  logout: () => void;
  setProfile: (profile: UserProfile) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        profile,
        login,
        logout,
        setProfile,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
