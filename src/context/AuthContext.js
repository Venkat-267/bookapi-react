import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("AccessToken");
    const expiry = localStorage.getItem("tokenExpiry");
    if (token && expiry && Date.now() < Number(expiry)) {
      return { isAuthenticated: true };
    } else {
      localStorage.clear();
      return { isAuthenticated: false };
    }
  });

  const login = (data) => {
    localStorage.setItem("AccessToken", data.AccessToken);
    localStorage.setItem("RefreshToken", data.RefreshToken);
    localStorage.setItem("UserId", data.UserId);
    localStorage.setItem("Role", data.Role);
    localStorage.setItem("tokenExpiry", Date.now() + 60 * 60 * 1000); // 1 hour
    setAuth({ isAuthenticated: true });

    setTimeout(() => {
      logout();
    }, 60 * 60 * 1000); // Auto logout after 1 hour
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
