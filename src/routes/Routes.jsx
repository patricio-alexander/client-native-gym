import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme, Button } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import Login from "../Screens/Login";
import BottomNavigation from "./BottomNavigation";
import { useNavigation } from "@react-navigation/native";
import AddFormCustomer from "../components/AddFormCustomer";

const Stack = createNativeStackNavigator();

const Routes = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [redirecting, setRedirecting] = useState(true);
  const theme = useTheme();
  const navigation = useNavigation();

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: "#fff",
      }}
    >
      {isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen
            name="Main"
            component={BottomNavigation}
            options={{
              headerTitle: "",
              headerBackVisible: false,
              headerRight: () => (
                <Button
                  mode="text"
                  icon="logout"
                  onPress={() => {
                    logout();
                  }}
                >
                  Cerrar Sesión
                </Button>
              ),
            }}
          />

          <Stack.Screen
            name="FormCustomer"
            component={AddFormCustomer}
            options={{
              headerTintColor: "#fff",
              headerTitle: "Cliente",
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
            }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerTitle: "Iniciar sesión",
              headerBackVisible: false,
            }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default Routes;
