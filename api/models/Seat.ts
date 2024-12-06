export interface Seat{
    seat_id: number;
    branch_id: number;
    seat_no: string;
    available: boolean;
}

export function isSeat(value: unknown): value is Seat{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("seat_id" in value) || typeof value.seat_id !== "number")
        return false;

    if(!("branch_id" in value) || typeof value.branch_id !== "number")
        return false;

    if(!("seat_no" in value) || typeof value.seat_no !== "string")
        return false;

    if(!("available" in value) || typeof value.available !== "boolean")
        return false;
    
    return true;
}