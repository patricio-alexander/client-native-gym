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
import { Alert } from "react-native";

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

  const iWantRemoveCustomer = (value) => {
    Alert.alert(
      "Eliminar",
      "¿Está seguro de eliminar al cliente?",
      [
        {
          text: "Cancelar",
          // onPress: () => console.log("Aceptado"),
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              removeCustomerRequest(value.customerId);

              setCustomers(
                customers.filter(
                  (customer) => customer.customerId !== value.customerId
                )
              );
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
      { cancelable: false }
    );
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
      Alert.alert(
        "Cliente agregado",
        "El cliente ha sigo registrado exitosamente",
        [
          {
            text: "Aceptar",
            onPress: async () => await fetchCustomers(),
          },
        ],
        { cancelable: false }
      );
      return { success: true };
    }

    Alert.alert(
      "Cliente encontrado",
      "El cliente ya se encuentra registrado",
      [
        {
          text: "Aceptar",
          onPress: () => console.log("Aceptado"),
        },
      ],
      { cancelable: false }
    );
    fetchCustomers();
  };

  const updateCustomerData = async (data, customerId) => {
    const { status } = await updataCustomerDataRequest(data, customerId);
    if (status === 200) {
      Alert.alert(
        "Cliente editado",
        "El cliente editado con éxito",
        [
          {
            text: "Aceptar",
            onPress: async () => await fetchCustomers(),
          },
        ],
        { cancelable: false }
      );
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
