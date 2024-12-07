import isDarkConnector from "./isDark";
import cookiesConnector from "./cookies";

export {
    toggle,
    setDark,
} from "./isDark";

export {
    setCustomer,
    resetCustomer,
} from "./cookies";

export const reducer = {
    isDark: isDarkConnector,
    cookies: cookiesConnector,
};

export default reducer;