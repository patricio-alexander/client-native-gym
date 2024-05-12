import { StatusBar, View } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import Routes from "./routes/Routes";
import { CustomerContextProvider } from "./context/CustomerProvider";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "react-native-paper";

const Index = () => {
  const theme = useTheme();

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
          </NavigationContainer>
        </View>
      </AuthProvider>
    </CustomerContextProvider>
  );
};

export default Index;
