import { colors } from "./defaultSettings";
import { StyleSheet } from "react-native";

export const colorStyle = StyleSheet.create({
    textPrimary: {
      color: colors.primary,
    },
    textDark: {
      color: colors.dark,
    },
    textLight: {
      color: colors.light,
    },
    textMuted: {
      color: colors.muted,
    },
    textTheme: {
      color: colors.theme,
    },
    bgPrimary: {
      backgroundColor: colors.primary,
    },
    bgDark: {
      backgroundColor: colors.dark,
    },
    bgLight: {
      backgroundColor: colors.light,
    },
    bgMuted: {
      backgroundColor: colors.muted,
    },
    bgTheme: {
      backgroundColor: colors.theme,
    },
    borderPrimary: {
      borderColor: colors.primary,
    },
    borderDark: {
      borderColor: colors.dark,
    },
    borderLight: {
      borderColor: colors.light,
    },
    borderMuted: {
      borderColor: colors.muted,
    },
    borderTheme: {
      borderColor: colors.theme,
    },
  });

export default colorStyle;