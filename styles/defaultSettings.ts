import { DefaultTheme, Theme } from "@react-navigation/native";

// import {
//     useFonts,
//     Poppins_100Thin,
//     Poppins_100Thin_Italic,
//     Poppins_200ExtraLight,
//     Poppins_200ExtraLight_Italic,
//     Poppins_300Light,
//     Poppins_300Light_Italic,
//     Poppins_400Regular,
//     Poppins_400Regular_Italic,
//     Poppins_500Medium,
//     Poppins_500Medium_Italic,
//     Poppins_600SemiBold,
//     Poppins_600SemiBold_Italic,
//     Poppins_700Bold,
//     Poppins_700Bold_Italic,
//     Poppins_800ExtraBold,
//     Poppins_800ExtraBold_Italic,
//     Poppins_900Black,
//     Poppins_900Black_Italic,
//   } from '@expo-google-fonts/poppins';

export const colors = {
    primary: DefaultTheme.colors.primary,
    dark: DefaultTheme.colors.text,
    light: DefaultTheme.colors.background,
    theme: "#21242c",
    muted: "#9ea0a3",
    success: "#5cb85c",
} as const;

// export const darkTheme: Theme = {
//     dark: true,
//     colors: {
//     ...DefaultTheme.colors,
//       background: DefaultTheme.colors.text,
//       card: DefaultTheme.colors.text,
//       text: DefaultTheme.colors.background,
//       border: DefaultTheme.colors.background,
//       notification: DefaultTheme.colors.background,
//     },
// }

// export const lightTheme: Theme = {
//     dark: false,
//     colors: DefaultTheme.colors,
// }

export default colors;