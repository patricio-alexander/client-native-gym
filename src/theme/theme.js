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
    background2: "#17191d",
    
    
    error: "#ffb4ab",
    // red1: "#ff6666",
    text1: "#abb1bf",
    text2: "#768198",
    blue1: "#4258ff",
    white: "#ffffff",
    success: "#80ed99",
    warning: "#ffbf69"
  },
};

// const theme = {
//   ...MD3LightTheme,
//   // Specify custom property
//   myOwnProperty: true,
//   // Specify custom property in nested object
//   colors: {
//     ...MD3LightTheme.colors,
//     dark1: "#14161a",
//     dark2: "#181b20",
//     red1: "#ff6666",
//     text1: "#abb1bf",
//     text2: "#768198",
//     blue1: "#4258ff",
//     white: "#ffffff",
//   },
// };

export { darkTheme };
