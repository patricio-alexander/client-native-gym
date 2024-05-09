import { View } from "react-native";
import { ActivityIndicator, MD2Colors, useTheme } from "react-native-paper";

function Loading() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        padding: 20,
      }}
    >
      <ActivityIndicator animating={true} color={MD2Colors.red800} />
    </View>
  );
}

export default Loading;
