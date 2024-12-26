import { isTransactionCash, TransactionCash } from "./TransactionCash";
import { isTransactionCashless, TransactionCashless } from "./TransactionCashless";
import { TransactionFoodDetailView, isTransactionFoodDetailView } from "./TransactionFoodDetailView";
import { TransactionView, isTransactionView } from "./TransactionView";

export interface TransactionFullDetail{
    transaction: TransactionView;
    payment: TransactionCash | TransactionCashless;
    foods: TransactionFoodDetailView[];
}

export function isTransactionFullDetail(data: unknown): data is TransactionFullDetail{
    if(typeof data !== "object" || data === null)
        return false;

    if(!("transaction" in data) || !isTransactionView(data.transaction))
        return false;

    if(("payment" in data))
        switch(data.transaction.payment_method){
            case "cash":
                if(!isTransactionCash(data.payment))
                    return false;
                break;
            case "cashless":
                if(!isTransactionCashless(data.payment))
                    return false;
                break;

            default:
                return false;
        }
    else
        return false;

    if(!("foods" in data) || !Array.isArray(data.foods))
        return false;

    if(!data.foods.every(isTransactionFoodDetailView))
        return false;

    return true;
}