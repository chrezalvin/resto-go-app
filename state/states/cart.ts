import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Cart = {[key: number]: number};

interface CartState{
    cart: Cart;
    countItems: number;
}

const initialState: CartState = {
    cart: {},
    countItems: 0
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addCartItem: (state, action: PayloadAction<number>) => {
            const newCart = {...state.cart};

            newCart[action.payload] = (newCart[action.payload] ?? 0) + 1;

            state.cart = newCart;

            state.countItems++;
        },
        removeCartItem: (state, action: PayloadAction<number>) => {
            const newCart = {...state.cart};

            if(newCart[action.payload] === 1)
                delete newCart[action.payload];
            else
                newCart[action.payload]--;

            state.cart = newCart;

            state.countItems--;
        },
        clearCart: () => {
            return initialState
        }
    },
});

export const { addCartItem, clearCart, removeCartItem } = cartSlice.actions;

export const selectCart = (state: {cart: CartState}) => state.cart;

export default cartSlice.reducer;