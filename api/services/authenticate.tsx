import { Customer, isCustomer } from "../models";
import axiosInstance from "../../shared/axios";

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