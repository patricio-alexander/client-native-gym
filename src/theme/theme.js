import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { useColorScheme } from "react-native";

// const colorScheme = useColorScheme();
// const paperTheme =
//   colorScheme === "dark"
//     ? { ...MD3DarkTheme, colors: theme.dark }
//     : { ...MD3LightTheme, colors: theme.light };

const darkTheme = {
  ...MD3DarkTheme,
  myOwnProperty: true,
  colors: {
    ...MD3DarkTheme.colors,
    // primary: "#ff6666",
    // secondary: "#d0c1da",
    // tertiary: "#f3b7be",
    // title: "#1b1b1d",

    background: "#14161a",
    background2: "#1e2126",

    error: "#ffb4ab",
    text1: "#abb1bf",
    text2: "#768198",
    blue1: "#4258ff",
    info: "#209cee",
    white: "#ffffff",
    success: "#80ed99",
    warning: "#ffbf69",
  },
};

export { darkTheme };
