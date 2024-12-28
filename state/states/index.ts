import isDarkConnector from "./isDark";
import cookiesConnector from "./cookies";
import cartConnector from "./cart";

export {
    toggle,
    setDark,
} from "./isDark";

export {
    setCustomer,
    resetCustomer,
} from "./cookies";

export {
    addCartItem,
    removeCartItem,
    clearCart,
    setCart,
} from "./cart";

export const reducer = {
    isDark: isDarkConnector,
    cookies: cookiesConnector,
    cart: cartConnector,
};

export default reducer;