import axiosInstance from "../../shared/axios";
import { Transaction } from "../models";
import { isTransactionFullDetail, TransactionFullDetail } from "../models/TransactionFullDetail";
import { isTransactionView, TransactionView } from "../models/TransactionView";

export async function getTransactionBatch(ids: Transaction["transaction_id"][]): Promise<TransactionView[]>{
    const res = await axiosInstance.post("/transaction/batch", {
        ids,
    });

    if(res.status !== 200)
        throw new Error(`Error: ${res.data}`);

    const data = res.data as unknown;

    if(!Array.isArray(data) || !data.every(isTransactionView))
        throw new Error("Invalid response");

    return data;
}

export async function getTransactionDetail(id: Transaction["transaction_id"]): Promise<TransactionView>{
    const res = await axiosInstance.get(`/transaction/${id}`);

    if(res.status !== 200)
        throw new Error(`Error: ${res.data}`);

    const data = res.data as unknown;

    if(!isTransactionView(data))
        throw new Error("Invalid response");

    return data;
}

export async function getTransactionFullDetail(id: Transaction["transaction_id"]): Promise<TransactionFullDetail>{
    const res = await axiosInstance.get(`/transaction/detail/${id}`);

    if(res.status !== 200)
        throw new Error(`Error: ${res.data}`);

    const data = res.data as unknown;

    if(!isTransactionFullDetail(data))
        throw new Error("Invalid response");

    return data;
}