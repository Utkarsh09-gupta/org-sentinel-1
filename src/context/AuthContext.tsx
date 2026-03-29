import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface CompanySession {
  companyName: string;
  email: string;
  orgId?: string;
}

interface AuthContextType {
  session: CompanySession | null;
  isAuthenticated: boolean;
  login: (data: CompanySession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<CompanySession | null>(() => {
    try {
      const stored = sessionStorage.getItem("org_sentinel_session");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((data: CompanySession) => {
    setSession(data);
    sessionStorage.setItem("org_sentinel_session", JSON.stringify(data));
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    sessionStorage.removeItem("org_sentinel_session");
  }, []);

  return (
    <AuthContext.Provider value={{ session, isAuthenticated: !!session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
