import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, verifyTokenRequest } from "../api/clients_api";
import { jwt, removeItem, saveItem } from "../api/axios";
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
  const [isLoading, setIsLoading] = useState(true);

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      const { data } = res;

      // Cookies.set("token", data.token);
      saveItem("token", data.token);

      if (res.status === 200) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      // console.log(error);
      setErrors(error.response.data);
    }
  };

  const logout = () => {
    // Cookies.remove("token");
    removeItem("token");
    setIsAuthenticated(false);
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
      const token = await jwt();
      // console.log(token);
      // // const cookies = Cookies.get();
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);

        return;
      }

      try {
        const res = await verifyTokenRequest();
        
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setIsLoading(false);
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
