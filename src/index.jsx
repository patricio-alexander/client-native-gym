import { View } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import Routes from "./routes/Routes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomerContextProvider } from "./context/CustomerProvider";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "react-native-paper";

const Index = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <CustomerContextProvider>
      <AuthProvider>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: theme.colors.background,
            // Paddings to handle safe area
            // paddingTop: insets.top,
            // paddingBottom: insets.bottom,
            // paddingLeft: insets.left,
            // paddingRight: insets.right,
          }}
        >
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </View>
      </AuthProvider>
    </CustomerContextProvider>
  );
};

export default Index;
