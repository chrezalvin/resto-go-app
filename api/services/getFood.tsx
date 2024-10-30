import { Food, isFood } from "@models";
import axiosInstance from "shared/axios";

export async function getFoodList(): Promise<Food[]>{
    const res = await axiosInstance.get("/food");

    if(res.status === 200){
        const data = res.data as unknown;

        if(Array.isArray(data) && data.every(isFood)){
            return data;
        }
    }

    throw new Error("Invalid response");
}