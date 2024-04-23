import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import Index from "./src";
import { PaperProvider } from "react-native-paper";
import { darkTheme } from "./src/theme/theme";


export default function App() {
  return (
    <PaperProvider theme={darkTheme}>
      <Index />
    </PaperProvider>
  );
}


