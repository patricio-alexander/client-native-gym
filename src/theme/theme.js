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

    outline: "#2d2d36",
    background: "#14161a",

    primary: "#abb1bf",

    background2: "#1c1e23",

    onSurface: "#abb1bf",

    error: "#ff5959",

    secondaryContainer: "#353a45",
    onSecondaryContainer: "#abb1bf",

    surfaceVariant: "#27282f",

    blue1: "#4258ff",
    info: "#66d1ff",
    white: "#ffffff",
    success: "#80ed99",
    warning: "#ffbf69",

    elevation: {
      level0: "transparent",
      level1: "rgb(28, 30, 35)",
      level2: "rgb(33, 35, 40)",
      level3: "rgb(39, 40, 47)",
      level4: "rgb(41, 42, 49)",
      level5: "rgb(45, 45, 54)",
    },
  },
};

export { darkTheme };
// {
//   "colors": {
//     "primary": "rgb(220, 184, 255)",
//     "onPrimary": "rgb(71, 12, 122)",
//     "primaryContainer": "rgb(95, 43, 146)",
//     "onPrimaryContainer": "rgb(240, 219, 255)",
//     "secondary": "rgb(208, 193, 218)",
//     "onSecondary": "rgb(54, 44, 63)",
//     "secondaryContainer": "rgb(77, 67, 87)",
//     "onSecondaryContainer": "rgb(237, 221, 246)",
//     "tertiary": "rgb(243, 183, 190)",
//     "onTertiary": "rgb(75, 37, 43)",
//     "tertiaryContainer": "rgb(101, 58, 65)",
//     "onTertiaryContainer": "rgb(255, 217, 221)",
//     "error": "rgb(255, 180, 171)",
//     "onError": "rgb(105, 0, 5)",
//     "errorContainer": "rgb(147, 0, 10)",
//     "onErrorContainer": "rgb(255, 180, 171)",
//     "background": "rgb(29, 27, 30)",
//     "onBackground": "rgb(231, 225, 229)",
//     "surface": "rgb(29, 27, 30)",
//     "onSurface": "rgb(231, 225, 229)",
//     "surfaceVariant": "rgb(74, 69, 78)",
//     "onSurfaceVariant": "rgb(204, 196, 206)",
//     "outline": "rgb(150, 142, 152)",
//     "outlineVariant": "rgb(74, 69, 78)",
//     "shadow": "rgb(0, 0, 0)",
//     "scrim": "rgb(0, 0, 0)",
//     "inverseSurface": "rgb(231, 225, 229)",
//     "inverseOnSurface": "rgb(50, 47, 51)",
//     "inversePrimary": "rgb(120, 69, 172)",
//     "elevation": {
//       "level0": "transparent",
//       "level1": "rgb(39, 35, 41)",
//       "level2": "rgb(44, 40, 48)",
//       "level3": "rgb(50, 44, 55)",
//       "level4": "rgb(52, 46, 57)",
//       "level5": "rgb(56, 49, 62)"
//     },
//     "surfaceDisabled": "rgba(231, 225, 229, 0.12)",
//     "onSurfaceDisabled": "rgba(231, 225, 229, 0.38)",
//     "backdrop": "rgba(51, 47, 55, 0.4)"
//   }
// }
