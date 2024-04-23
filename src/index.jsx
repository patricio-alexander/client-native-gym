import { View } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import Routes from "./routes/Routes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomerContextProvider } from "./context/CustomerProvider";

const Index = () => {
  const { bottom } = useSafeAreaInsets();
  return (
    <CustomerContextProvider>
      <AuthProvider>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Routes />
        </View>
      </AuthProvider>
    </CustomerContextProvider>
  );
};

export default Index;
