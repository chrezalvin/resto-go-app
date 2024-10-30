import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import {
    MD3DarkTheme,
    MD3LightTheme,
    adaptNavigationTheme,
} from "react-native-paper";

const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});
  
export const CombinedDefaultTheme = {
...MD3LightTheme,
...LightTheme,
colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    // background: "#f0f0f0",
    // backdrop: "rgb(240, 240, 240)",
}
};

export const CombinedDarkTheme = {
...MD3DarkTheme,
...DarkTheme,
colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    // surface: "#0b214a",
    // backdrop: "#2e3d5a"
}
};