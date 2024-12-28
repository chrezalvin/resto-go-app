import { Branch, isBranch } from "./Branch";
import { Customer } from "./Customer";
import { isSeat, Seat } from "./Seat";
import { isTransaction, Transaction } from "./Transaction";

export interface Profile{
    customer_id: Customer["customer_id"];
    transaction: Transaction | null;
    branch: Branch;
    seat: Seat;
}

export function isProfile(value: unknown): value is Profile{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("customer_id" in value) || typeof value.customer_id !== "string")
        return false;

    if(!("transaction" in value) || (value.transaction !== null && !isTransaction(value.transaction)))
        return false;

    if(!("branch" in value) || !isBranch(value.branch))
        return false;

    if(!("seat" in value) || !isSeat(value.seat))
        return false;

    return true;
}