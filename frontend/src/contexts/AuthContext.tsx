import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { authStorage, type AuthSession, type AuthUser } from "shared/auth/authStorage";
import { clearFocusedAssessmentNavigation } from "shared/constants/assessmentNavigation";

type AuthContextValue = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (session: AuthSession) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(() => authStorage.getUser());

  const login = useCallback((session: AuthSession) => {
    clearFocusedAssessmentNavigation();
    authStorage.save(session);
    setUser(session.user);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      isAuthenticated: Boolean(user) && Boolean(authStorage.getToken()),
      user,
      login,
    };
  }, [user, login]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthContextProvider.");
  }

  return context;
}
