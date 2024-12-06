import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import {
    MD2DarkTheme,
    MD3DarkTheme,
    MD3LightTheme,
    adaptNavigationTheme,
} from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

export const customFonts: ReactNavigation.Theme["fonts"] = {
    regular: {
      fontFamily: 'poppins-regular',  // Or any font you want
      fontWeight:  'normal',
    },
    medium: {
      fontFamily: 'poppins-medium',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'poppins-bold',
      fontWeight: 'normal',
    },
    heavy: {
      fontFamily: 'poppins-extra-bold',
      fontWeight: 'normal',
    },
};

export const customThemeProp: ThemeProp["fonts"] = {
    default: {
        ...MD3LightTheme.fonts.default,
        fontFamily: 'poppins-regular',
    },
    bodyLarge: {
        ...MD3LightTheme.fonts.bodyLarge,
        fontFamily: 'poppins-regular',
    },
    bodyMedium: {
        ...MD3LightTheme.fonts.bodyMedium,
        fontFamily: 'poppins-regular',
    },
    bodySmall: {
        ...MD3LightTheme.fonts.bodySmall,
        fontFamily: 'poppins-regular',
    },
    displayLarge: {
        ...MD3LightTheme.fonts.displayLarge,
        fontFamily: 'poppins-regular',
    },
    displayMedium: {
        ...MD3LightTheme.fonts.displayMedium,
        fontFamily: 'poppins-regular',
    },
    displaySmall: {
        ...MD3LightTheme.fonts.displaySmall,
        fontFamily: 'poppins-regular',
    },
    headlineLarge: {
        ...MD3LightTheme.fonts.headlineLarge,
        fontFamily: 'poppins-regular',
    },
    headlineMedium: {
        ...MD3LightTheme.fonts.headlineMedium,
        fontFamily: 'poppins-regular',
    },
    headlineSmall: {
        ...MD3LightTheme.fonts.headlineSmall,
        fontFamily: 'poppins-regular',
    },
    labelLarge: {
        ...MD3LightTheme.fonts.labelLarge,
        fontFamily: 'poppins-regular',
    },
    labelMedium: {
        ...MD3LightTheme.fonts.labelMedium,
        fontFamily: 'poppins-regular',
    },
    labelSmall: {
        ...MD3LightTheme.fonts.labelSmall,
        fontFamily: 'poppins-regular',
    },
    titleLarge: {
        ...MD3DarkTheme.fonts.titleLarge,
        fontFamily: 'poppins-regular',
    },
    titleMedium: {
        ...MD3DarkTheme.fonts.titleMedium,
        fontFamily: 'poppins-regular',
    },
    titleSmall: {
        ...MD3DarkTheme.fonts.titleSmall,
        fontFamily: 'poppins-regular',
    },
    light: {
        // ...MD2DarkTheme.fonts.light,
        fontFamily: 'poppins-light',
    },
    medium: {
        // ...MD2DarkTheme.fonts.medium,
        fontFamily: 'poppins-medium',
    },
    regular: {
        // ...MD2DarkTheme.fonts.regular,
        fontFamily: 'poppins-regular',
    },
    thin: {
        ...MD2DarkTheme.fonts.thin,
        fontFamily: 'poppins-thin',
    },
}
  
export const CombinedDefaultTheme = {
    ...LightTheme,
    ...MD3LightTheme,
    fonts: customThemeProp,
    colors: {
        ...MD3LightTheme.colors,
        ...LightTheme.colors,
        background: "#892B1B",
        // backdrop: "rgb(240, 240, 240)",
    },
};

export const CombinedDarkTheme = {
    ...DarkTheme,
    ...MD3DarkTheme,
    fonts: customThemeProp,
    colors: {
        ...MD3DarkTheme.colors,
        ...DarkTheme.colors,
        background: "#892B1B",
        // backdrop: "#2e3d5a"
    }
};
