import axiosInstance from "../../shared/axios";
import { CheckoutResponse, isCheckoutResponse } from "../models/CheckoutResponse";
import { FoodList } from "../models/FoodList";

export async function transaction_checkout(foodList: FoodList[]): Promise<{foodsWithPrice: CheckoutResponse[], totalPrice: number}>{
    const res = await axiosInstance.post("/transaction/checkout", foodList);

    if(res.status !== 200)
        throw new Error(`Error: ${res.data}`);

    const data = res.data as unknown;
    if(typeof data !== "object" || data === null)
        throw new Error("Invalid response");

    if(!("foodsWithPrice" in data) || !Array.isArray(data.foodsWithPrice))
        throw new Error("Invalid response");

    if(!data.foodsWithPrice.every(isCheckoutResponse))
        throw new Error("Invalid response");

    if(!("totalPrice" in data) || typeof data.totalPrice !== "number")
        throw new Error("Invalid response");

    
    return res.data;
}