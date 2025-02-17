import { StatusBar, View } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import Routes from "./routes/Routes";
import { CustomerContextProvider } from "./context/CustomerProvider";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import Toast, { BaseToast, InfoToast } from "react-native-toast-message";
import { useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";

import * as SQLite from "expo-sqlite";

const Index = () => {
  const theme = useTheme();
  const db = useSQLiteContext();

  const toastConf = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.colors.success,
          backgroundColor: theme.colors.background2,
        }}
        // contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 17,
          color: "white",
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),

    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: theme.colors.success,
          backgroundColor: theme.colors.background2,
        }}
        text1Style={{
          fontSize: 17,
          color: "white",
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),

    info: (props) => (
      <InfoToast
        {...props}
        style={{
          borderLeftColor: theme.colors.info,
          backgroundColor: theme.colors.background2,
        }}
        text1Style={{
          fontSize: 17,
          color: "white",
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
  };

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await db.execAsync(`

          CREATE TABLE IF NOT EXISTS users (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            userName TEXT NOT NULL,
            password TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS customers (
            customerId INTEGER PRIMARY KEY AUTOINCREMENT,
            dni INTEGER,
            names TEXT,
            lastnames TEXT,
            startDate TEXT,
            endingDate TEXT,
            duration INTEGER,
            planCost INTEGER,
            amount INTEGER,
            description TEXT,
            photo TEXT DEFAULT NULL
          );

          CREATE TABLE IF NOT EXISTS price (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            currentPrice INTEGER 
          );
        `);
        const users = await db.getAllAsync("SELECT * FROM users");
        const price = await db.getFirstAsync("SELECT currentPrice FROM price");

        if (!users.length) {
          await db.execAsync(
            "INSERT INTO users (userName, password) VALUES ('user', '123');",
          );
        }

        if (!price) {
          await db.execAsync("INSERT INTO price (currentPrice) VALUES (25);");
        }
      } catch (e) {
        console.error(e);
      }
    };
    initializeDatabase();
  }, []);

  return (
    <CustomerContextProvider>
      <AuthProvider>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: theme.colors.background,
          }}
        >
          <StatusBar
            backgroundColor={theme.colors.background}
            barStyle="dark-content"
          />

          <NavigationContainer>
            <Routes />
            <Toast config={toastConf} />
          </NavigationContainer>
        </View>
      </AuthProvider>
    </CustomerContextProvider>
  );
};

export default Index;
