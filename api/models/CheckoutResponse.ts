import { Food, isFood } from "./Food";

export interface CheckoutResponse extends Food{
    quantity: number;
}

export function isCheckoutResponse(value: unknown): value is CheckoutResponse{
    if(!isFood(value))
        return false;

    if(!("quantity" in value) || typeof value.quantity !== "number")
        return false;

    return true;
}