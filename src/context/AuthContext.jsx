import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, verifyTokenRequest } from "../api/clients_api";
import { removeItem, saveItem, token } from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [errors, setErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      const { data } = res;

      saveItem("token", data.token);

      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const logout = () => {
    removeItem("token");

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
        const tk = await token();
        if (!tk) {
          setTimeout(() => {
            setIsAuthenticated(false);
            setIsLoading(false);
          }, 1000);
          return;
        }

        setIsLoading(true);

        const { data } = await verifyTokenRequest();
        if (data) {
          setIsLoading(false);
          setIsAuthenticated(true);
        }
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
