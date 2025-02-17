import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, verifyTokenRequest } from "../api/clients_api";
import { removeItem, saveItem, auth } from "../api/axios";

import { useSQLiteContext } from "expo-sqlite";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const db = useSQLiteContext();

  const [errors, setErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const signin = async (user) => {
    try {
      const correct = await db.getFirstAsync(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [user.username, user.password],
      );
      if (correct) {
        saveItem("auth", "true");
        setIsAuthenticated(true);
        setIsLoading(false);
      }
      //
      //
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const logout = () => {
    removeItem("auth");

    setIsAuthenticated(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if (errors.message) {
      setTimeout(() => {
        setErrors({});
      }, 5000);
    }
  }, [errors]);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        setIsLoading(true);
        const session = await auth();
        if (!session) {
          setTimeout(() => {
            setIsAuthenticated(false);
            setIsLoading(false);
          }, 1000);
          return;
        }

        setIsLoading(false);
        setIsAuthenticated(true);
      } catch (error) {
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signin, logout, errors, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
