import { StyleSheet } from "react-native";

import typography from "./typography";
import fontStyle from "./font";
import colorStyle from "./colors";
import sets from "./sets";
import spacingStyle from "./spacing";

// re-export lightTheme and darkTheme
export { lightTheme, darkTheme } from "./defaultSettings";

export const styles = StyleSheet.create({
    ...typography,
    ...fontStyle,
    ...colorStyle,
    ...sets,
    ...spacingStyle
} as const);

export default styles;