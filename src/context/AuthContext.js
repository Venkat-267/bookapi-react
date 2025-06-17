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

  const [user, setUser] = useState(() => {
    const userId = localStorage.getItem("UserId");
    const role = localStorage.getItem("Role");
    if (userId && role) {
      return { UserId: userId, Role: role };
    }
    return null;
  });

  const login = (data) => {
    localStorage.setItem("AccessToken", data.AccessToken);
    localStorage.setItem("RefreshToken", data.RefreshToken);
    localStorage.setItem("UserId", data.UserId);
    localStorage.setItem("Role", data.Role);
    localStorage.setItem("tokenExpiry", Date.now() + 60 * 60 * 1000); // 1 hour
    
    setAuth({ isAuthenticated: true });
    setUser({ UserId: data.UserId, Role: data.Role });

    setTimeout(() => {
      logout();
    }, 60 * 60 * 1000); // Auto logout after 1 hour
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ isAuthenticated: false });
    setUser(null);
  };

  // Check if user is authenticated (for backward compatibility)
  const isAuthenticated = auth.isAuthenticated;

  return (
    <AuthContext.Provider value={{ 
      auth, 
      user, 
      isAuthenticated, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);