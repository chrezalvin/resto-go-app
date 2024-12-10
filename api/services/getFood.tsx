import { Food, isCustomer, isFood, isTransaction, Transaction } from "../models";
import axiosInstance from "../../shared/axios";
import { CustomerView, isCustomerView } from "../models/CustomerView";
import { isTransactionFoodDetail, TransactionFoodDetail } from "../models/TransactionFoodDetail";

export async function getFoodList(): Promise<Food[]>{
    console.log("getting food list");
    const res = await axiosInstance.get("/food");

    if(res.status === 200){
        const data = res.data as unknown;

        if(Array.isArray(data) && data.every(isFood)){
            return data;
        }
    }

    throw new Error("Invalid response");
}

export async function getFoodByTransaction(branch_id: number){
    const res = await axiosInstance.get(`/food/${branch_id}`);

    if(res.status === 200){
        const data = res.data as unknown;

        if(Array.isArray(data) && data.every(isFood)){
            return data;
        }
    }

    throw new Error("Invalid response");
}

interface CustomerInBranchResponse{
    customer: CustomerView;
    transaction: Transaction;
    foods: TransactionFoodDetail[];
}

function isCustomerInBranchResponse(data: unknown): data is CustomerInBranchResponse{
    if(typeof data !== "object" || data === null)
        return false;

    if(!("customer" in data) || !isCustomerView(data.customer))
        return false;

    if(!("transaction" in data) || !isTransaction(data.transaction))
        return false;

    if(!("foods" in data) || !Array.isArray(data.foods))
        return false;

    if(!data.foods.every(isTransactionFoodDetail))
        return false;

    return true;
}

export async function getCustomerInBranch(branch_id: number): Promise<CustomerInBranchResponse[]>{
    const res = await axiosInstance.get(`/food/branch/${branch_id}`);

    if(res.status !== 200)
        throw new Error("Invalid response");

    if(!Array.isArray(res.data) || !res.data.every(isCustomerInBranchResponse))
        throw new Error("Invalid response");

    return res.data;
}