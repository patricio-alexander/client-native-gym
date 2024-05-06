import { useContext, useEffect, useState } from "react";
import mime from "mime";

import {
  getCustomersRequest,
  removeCustomerRequest,
  // searchCustomerRequest,
  getOneCustomerRequest,
  updataCustomerDataRequest,
  addCustomerRequest,
  getCurrentPriceRequest,
  getCustomers,
} from "../api/clients_api";

import { createContext } from "react";
import { Alert } from "react-native";

// import toast from "react-hot-toast";

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
  const [customer, setCustomer] = useState({});

  // const [form, setForm] = useState(initialStateForm);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [removeCustomerById, setRemoveCustomerDni] = useState(0);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showDialog, setShowDialog] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showModalPrice, setShowModalPrice] = useState(false);

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

  const showCustomerCard = (customer) => {
    setShowCard(true);
    setCustomer(customer);
  };

  const showModalChangePrice = () => setShowModalPrice(true);
  const hiddenModalChangePrice = () => setShowModalPrice(false);

  const hiddenCustomerCard = () => setShowCard(false);

  const addCustomer = async (values) => {
    const fullFormData = new FormData();

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

    

    const {
      data: { existCustomer },
    } = await addCustomerRequest(fullFormData);

    if (!existCustomer) {
      Alert.alert(
        "Cliente Agregado",
        "El cliente ha sigo registrado exitosamente",
        [
          {
            text: "Aceptar",
            onPress: async () => await fetchCustomers(),
          },
        ],
        { cancelable: false }
      );
      return;
    }

    Alert.alert(
      "Cliente Encontrado",
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
        "Cliente Editado",
        "El cliente editado con éxito",
        [
          {
            text: "Aceptar",
            onPress: async () => await fetchCustomers(),
          },
        ],
        { cancelable: false }
      );
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
      // setCustomer(data[0]);
      // setForm(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomers = async () => {
    const { data } = await getCustomers();

    setCustomers(data.items);
    // !search ? loadCustomers() : searchClient();
  };

  useEffect(() => {
    getCurrentPrice();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        addCustomer,

        hiddenCustomerCard,
        fetchCustomers,
        iWantRemoveCustomer,
        showCustomerCard,
        getOneCustomer,
        updateCustomerData,
        customers,

        currentPrice,
        customer,
        getCurrentPrice,
        showModalChangePrice,
        hiddenModalChangePrice,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
