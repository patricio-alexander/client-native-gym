import axios, { jwt } from "./axios.js";

export const getOneCustomerRequest = async (customerId) =>
  await axios.get(`/customers/${customerId}`, {
    headers: {
      Authorization: await jwt(),
    },
  });

export const getCustomers = async () =>
  await axios.get("/customers", {
    headers: {
      Authorization: await jwt(),
    },
  });

export const addCustomerRequest = async (data) =>
  await axios.post("/customers", data, {
    headers: {
      Authorization: await jwt(),
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });

export const removeCustomerRequest = async (customerId) =>
  await axios.delete(`/customers/${customerId}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const updataCustomerDataRequest = async (customerData, customerId) =>
  await axios.put(`/customers/${customerId}`, customerData, {
    headers: {
      Authorization: jwt(),
    },
  });

export const getCurrentPriceRequest = async () =>
  await axios.get("/price/currentPrice");

export const loginRequest = async (data) => await axios.post("/login", data);

export const changePriceRequest = async (data) =>
  await axios.put("/price/changePrice", data);

export const verifyTokenRequest = async () =>
  await axios.get("/auth/verify", {
    headers: {
      Authorization: await jwt(),
    },
  });

export const getCustomersRequest = async (page) =>
  await axios.get("/customers", {
    params: { page, limit: 6 },
  });
