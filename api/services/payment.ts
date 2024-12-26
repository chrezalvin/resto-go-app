import axiosInstance, { axiosCashierInstance } from "../../shared/axios";
import { CheckoutResponse, isCheckoutResponse } from "../models/CheckoutResponse";
import { FoodList } from "../models/FoodList";
import { isTransaction, Transaction } from "../models";

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

export async function transaction_cash_confirm(transaction_data: {
    customer_id: string,
    note: string,
    food_list: FoodList[],
}): Promise<Transaction>{
    const res = await axiosCashierInstance.post("/payment/cash/confirm", transaction_data);

    if(!isTransaction(res.data))
        throw new Error("Invalid response");

    return res.data;
}

export async function finallizeTransaction(transaction_id: number): Promise<Transaction>{
    const res = await axiosCashierInstance.get(`/chef/transaction/finallize/${transaction_id}`);

    console.log(JSON.stringify(res.data));

    if(res.status !== 200)
        throw new Error(`Error: ${res.data}`);

    if(!isTransaction(res.data))
        throw new Error("Invalid response");

    return res.data;
}

export async function createCashlessPayment(data: {note: string, food_list: FoodList[]}): Promise<Transaction>{
    const res = await axiosInstance.post("/payment/qris/create", data);

    if(res.status !== 200)
        throw new Error("Invalid Cashless Payment!");

    if(!isTransaction(res.data))
        throw new Error("Invalid response");

    return res.data;
}