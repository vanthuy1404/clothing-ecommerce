// AppContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  is_admin?: boolean; // thêm cờ admin
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("is_admin") === "true";
  });

  // sync khi user thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // sync khi isAdmin thay đổi
  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem("is_admin", "true");
    } else {
      localStorage.removeItem("is_admin");
    }
  }, [isAdmin]);

  return (
    <AppContext.Provider value={{ user, setUser, isAdmin, setIsAdmin }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
