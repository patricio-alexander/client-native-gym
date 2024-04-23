import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/Login";

import TabsNavigator from "./TabsNavigator";
import { Button } from "react-native-paper";
import AddFormCustomer from "../components/AddFormCustomer";
import { useTheme } from "react-native-paper";

const Stack = createNativeStackNavigator();

const Routes = () => {
  const theme = useTheme();
  const { isAuthenticated, isLoading, logout } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoading && !isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                title: "Login",
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
              }}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen
              name="GYM CUSTOMERS TRACKER"
              component={TabsNavigator}
              options={{
                headerTitle: "",

                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
                headerRight: () => (
                  <Button icon="exit-to-app" mode="text" onPress={logout}>
                    Cerrar Sesión
                  </Button>
                ),
              }}
            />
            <Stack.Screen
              name="addCustomer"
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
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
