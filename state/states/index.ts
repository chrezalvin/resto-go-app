import isDarkConnector from "./isDark";

export {
    toggle,
    setDark,
} from "./isDark";

export const reducer = {
    isDark: isDarkConnector,
}

export default reducer;