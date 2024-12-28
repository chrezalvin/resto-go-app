import { Food } from "./Food";

export interface FoodList{
    food_id: Food["food_id"];
    quantity: number;
    note?: string;
}

export function isFoodList(value: unknown): value is FoodList{
    if(typeof value !== 'object' || value === null) return false;
  
    if("food_id" in value && typeof value.food_id !== 'number')
      return false;
  
    if("quantity" in value && typeof value.quantity !== 'number')
      return false;
  
    if("note" in value && typeof value.note !== 'string')
      return false;
  
    return true;
}