import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CookieState {
    customer_id: string | null;
}

const initialState: CookieState = {
    customer_id: null,
};

export const cookieSlice = createSlice({
    name: "cookie",
    initialState,
    reducers: {
        setCustomer: (state, action: PayloadAction<string>) => {
            state.customer_id = action.payload;
        },
        resetCustomer: (state) => {
            state.customer_id = null;
        }
    },
});

export const { setCustomer, resetCustomer } = cookieSlice.actions;

export const selectCookie = (state: {cookie: CookieState}) => state.cookie;

export default cookieSlice.reducer;