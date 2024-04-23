import axios from "axios";
import * as SecureStore from "expo-secure-store";
// axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
//   "token"
// )}`;

const instance = axios.create({
  baseURL: "http://192.168.110.53:3000/api",
  withCredentials: true,
});

export const pathPhotos = "http://192.168.110.53:3000/photos"

export const jwt = async () =>
  `Bearer ${await SecureStore.getItemAsync("token")}`;
export const saveItem = async (key, value) =>
  await SecureStore.setItemAsync(key, value);
export const removeItem = async (key) => await SecureStore.deleteItemAsync(key);

export default instance;
