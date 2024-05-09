import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, verifyTokenRequest } from "../api/clients_api";
import { jwt, removeItem, saveItem, token } from "../api/axios";
// import { loginRequest, verifyTokenRequest } from "../api/clients_api";

// import Cookies from "js-cookie";

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
  const [isLoading, setIsLoading] = useState(false);

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      const { data } = res;

      saveItem("token", data.token);

      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      setErrors(error.response.data);
    }
  };

  const logout = () => {
    // Cookies.remove("token");
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
          setIsLoading(false);
          setIsAuthenticated(false);
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
