import Index from "./src";
import { PaperProvider } from "react-native-paper";
import { darkTheme } from "./src/theme/theme";
import { SQLiteProvider } from "expo-sqlite";

export default function App() {
  return (
    <PaperProvider theme={darkTheme}>
      <SQLiteProvider databaseName="iron.db">
        <Index />
      </SQLiteProvider>
    </PaperProvider>
  );
}
