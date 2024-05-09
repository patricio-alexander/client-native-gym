import { Avatar, Button, Card, Text } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import { View } from "react-native";

const Home = () => {
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>GYM APP IN REACT NATIVE </Text>
    </View>
  );
};

export default Home;
