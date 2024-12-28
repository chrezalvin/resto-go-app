import { Branch, Customer, isCustomer, isTransaction, Transaction } from "../models";
import axiosInstance from "../../shared/axios";
import { isProfile, Profile } from "../models/Profile";

export async function authenticate(seat_id: number, long: number, lat: number): Promise<Customer | undefined>{
    const res = await axiosInstance.post("/authenticate", {
        seat_id,
        long,
        lat,
    });

    if(res.status !== 200)
        throw new Error(`Error: ${res.data}`);

    const data = res.data as unknown;

    if(isCustomer(data))
        return data;
}

export async function getProfile(): Promise<Profile | undefined>{
    const res = await axiosInstance.get("/profile");

    if(res.status !== 200)
        throw new Error(`Error: ${res.data}`);

    const data = res.data as unknown;

    if(isProfile(data))
        return data;    
}

export async function logout(): Promise<void>{
    const res = await axiosInstance.get("/logout");

    if(res.status !== 200)
        throw new Error(`Error: ${res.data}`);

    return;
}