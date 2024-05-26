import { StatusBar, View } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import Routes from "./routes/Routes";
import { CustomerContextProvider } from "./context/CustomerProvider";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import Toast, { BaseToast, InfoToast } from "react-native-toast-message";

const Index = () => {
  const theme = useTheme();

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
