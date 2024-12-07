import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { RootState } from "../store";
import { Appearance, Platform } from "react-native";
import { setItem } from "../../libs/AsyncStorage";

export interface IsDarkState {
    /**
     * is dark mode enabled, default to true
     */
    isDark: boolean;
}

const initialState: IsDarkState = {
    isDark: Appearance.getColorScheme() === "light" ? false : true,
};

export const isDarkSlice = createSlice({
    name: "isDark",
    initialState,
    reducers: {
        toggle: (state) => {
            state.isDark = !state.isDark;
            
            // sets color scheme for ios and android
            if(Platform.OS === "ios" ||  Platform.OS === "android")
                Appearance.setColorScheme(state.isDark ? "dark" : "light");

            setItem("isDark", state.isDark);
        },
        setDark: (state, action: PayloadAction<boolean>) => {
            state.isDark = action.payload;

            setItem("isDark", state.isDark);
        }
    },
});

export const { toggle, setDark } = isDarkSlice.actions;

export const selectIsDark = (state: {isDark: IsDarkState}) => state.isDark.isDark;

export default isDarkSlice.reducer;