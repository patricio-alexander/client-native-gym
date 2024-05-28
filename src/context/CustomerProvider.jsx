import { useContext, useEffect, useState } from "react";
import mime from "mime";

import {
  removeCustomerRequest,
  getOneCustomerRequest,
  updataCustomerDataRequest,
  addCustomerRequest,
  getCurrentPriceRequest,
  getCustomers,
} from "../api/clients_api";

import { createContext } from "react";

import Toast from "react-native-toast-message";

const CustomerContext = createContext();

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error(
      "useCustomer debe usarse dentro de un CustomerContextProvider"
    );
  }

  return context;
};

export const CustomerContextProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);

  const [currentPrice, setCurrentPrice] = useState(0);

  const iWantRemoveCustomer = async (value) => {
    try {
      const res = await removeCustomerRequest(value.customerId);

      setCustomers(
        customers.filter((customer) => customer.customerId !== value.customerId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const addCustomer = async (values) => {
    const fullFormData = new FormData();

    if (values.photo) {
      Object.entries(values).forEach(([key, value]) => {
        if (key === "photo") {
          fullFormData.append(key, {
            type: mime.getType(value),
            name: value.split("/").pop(),
            uri: value,
          });
          return;
        }
        fullFormData.append(key, value);
      });
    }

    const {
      data: { existCustomer },
    } = await addCustomerRequest(values.photo ? fullFormData : values);

    if (!existCustomer) {
      Toast.show({
        type: "success",
        text1: "Usuario",
        text2: "Usuario registrado con éxito",
      });
      fetchCustomers();

      return { success: true };
    }

    Toast.show({
      type: "info",
      text1: "Usuario",
      text2: "Usuario ya registrado",
    });

    fetchCustomers();
  };

  const updateCustomerData = async (data, customerId) => {
    const { status } = await updataCustomerDataRequest(data, customerId);
    if (status === 200) {
      Toast.show({
        type: "success",
        text1: "Usuario",
        text2: "Datos actualizado con éxito",
      });
      fetchCustomers();
      return { success: true };
    }
  };

  const getCurrentPrice = async () => {
    try {
      const {
        data: [{ currentPrice }],
      } = await getCurrentPriceRequest();
      setCurrentPrice(currentPrice);
    } catch (error) {
      console.log(error);
    }
  };

  const getOneCustomer = async (customerId) => {
    try {
      const { data } = await getOneCustomerRequest(customerId);
      return data[0];
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data } = await getCustomers();

      setCustomers(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCurrentPrice();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        addCustomer,
        fetchCustomers,
        iWantRemoveCustomer,
        getOneCustomer,
        updateCustomerData,
        customers,
        currentPrice,
        getCurrentPrice,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
