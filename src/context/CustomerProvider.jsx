import { useContext, useState } from "react";

import * as SQLite from "expo-sqlite";

import { createContext } from "react";

import Toast from "react-native-toast-message";

const CustomerContext = createContext();

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error(
      "useCustomer debe usarse dentro de un CustomerContextProvider",
    );
  }

  return context;
};

export const CustomerContextProvider = ({ children }) => {
  const db = SQLite.useSQLiteContext();
  const [customers, setCustomers] = useState([]);

  const [currentPrice, setCurrentPrice] = useState(0);

  const fetchCustomers = async () => {
    try {
      const customers = await db.getAllAsync("SELECT * FROM customers");
      setCustomers(customers);
    } catch (error) {
      console.error(error);
    }
  };

  const iWantRemoveCustomer = async (value) => {
    try {
      await db.runAsync(
        "DELETE FROM customers WHERE customerId = ?",
        value.customerId,
      );

      setCustomers(
        customers.filter(
          (customer) => customer.customerId !== value.customerId,
        ),
      );

      Toast.show({
        type: "success",
        text1: "Usuario",
        text2: "Usuario eliminado con éxito",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentPrice = async () => {
    try {
      const { currentPrice } = await db.getFirstAsync(
        "SELECT currentPrice FROM price",
      );
      setCurrentPrice(currentPrice);
    } catch (error) {
      console.log(error);
    }
  };

  const addCustomer = async (values) => {
    const dni = values.dni;

    //
    // if (values.photo) {
    //   Object.entries(values).forEach(([key, value]) => {
    //     if (key === "photo") {
    //       fullFormData.append(key, {
    //         type: mime.getType(value),
    //         name: value.split("/").pop(),
    //         uri: value,
    //       });
    //       return;
    //     }
    //     fullFormData.append(key, value);
    //   });
    // }

    try {
      const userExist = await db.getFirstAsync(
        "SELECT * FROM customers WHERE dni = ?",
        dni,
      );

      if (!userExist) {
        await db.runAsync(
          `INSERT INTO customers
            (dni, names, lastnames, startDate, endingDate, amount, duration, planCost, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,

          values.dni,
          values.names,
          values.lastnames,
          values.startDate,
          values.endingDate,
          values.amount,
          values.duration,
          values.planCost,
          values.description,
        );

        Toast.show({
          type: "success",
          text1: "Usuario",
          text2: "Usuario registrado con éxito",
        });

        fetchCustomers();
        return { success: true };
      } else {
        Toast.show({
          type: "info",
          text1: "Usuario",
          text2: "Usuario ya registrado",
        });
      }
    } catch (e) {
      console.error(e);
    }

    fetchCustomers();
  };

  const getOneCustomer = async (customerId) => {
    try {
      const customer = await db.getFirstAsync(
        "SELECT * FROM customers WHERE customerId = ?",
        customerId,
      );

      return customer;
    } catch (error) {
      console.log(error);
    }
  };

  const updateCustomerData = async (customer, customerId) => {
    try {
      await db.runAsync(
        `UPDATE customers SET
                dni = ?,
                names = ?,
                lastnames = ?,
                startDate = ?,
                endingDate = ?,
                duration = ?,
                amount = ?,
                planCost = ?,
                description = ?
                WHERE customerId = ?`,

        customer.dni,
        customer.names,
        customer.lastnames,
        customer.startDate,
        customer.endingDate,
        customer.duration,
        customer.amount,
        customer.planCost,
        customer.description,
        customerId,
      );
      Toast.show({
        type: "success",
        text1: "Usuario",
        text2: "Datos actualizado con éxito",
      });
      fetchCustomers();

      return { success: true };
    } catch (e) {
      console.error(e);
    }
  };

  // useEffect(() => {
  //   getCurrentPrice();
  // }, []);

  return (
    <CustomerContext.Provider
      value={{
        fetchCustomers,
        iWantRemoveCustomer,
        getOneCustomer,
        customers,
        currentPrice,
        getCurrentPrice,
        addCustomer,
        updateCustomerData,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
