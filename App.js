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
