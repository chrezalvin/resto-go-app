import AsyncStorage from "@react-native-async-storage/async-storage";
import { Customer, Transaction } from "../api/models";

interface AsyncStorageItem {
    isDark: boolean;
    customer_id: Customer["customer_id"] | null;
    previous_transaction_id: Transaction["transaction_id"][];
}

const initialAsyncStorageItem: AsyncStorageItem = {
    isDark: true,
    customer_id: null,
    previous_transaction_id: [],
}

export async function populateAsyncStorage(): Promise<void> {
    for(const key in initialAsyncStorageItem){
        const data = await getItem(key as keyof AsyncStorageItem);

        if(data === null && initialAsyncStorageItem[key as keyof AsyncStorageItem] !== null){
            await setItem(key as keyof AsyncStorageItem, initialAsyncStorageItem[key as keyof AsyncStorageItem]);
        }
    }
}

/**
 * checks whether the input is a JSON object
 * @param item the input
 * @returns true if the input is a JSON object, false otherwise
 */
function isJson(item: unknown): boolean {
    let value = typeof item !== "string" ? JSON.stringify(item) : item;    
    try {
      value = JSON.parse(value);
    } catch (e) {
      return false;
    }

    return typeof value === "object" && value !== null;
}

/**
 * sets an item in the AsyncStorage
 * @param key AsyncStorage key
 * @param value the value to be stored
 */
export async function setItem<_T extends keyof AsyncStorageItem>(key: _T, value: AsyncStorageItem[_T]): Promise<void> {
    try {
        if(value === null)
            return await AsyncStorage.removeItem(key);

        let data: string;

        switch(typeof value){
            case "object":
                data = JSON.stringify(value);
                break;
            case "string":
                data = value;
                break;
            case "number":
            case "boolean":
            case "bigint":
                data = value.toString();
                break
            default:
                data = "";
                break;
        }

        await AsyncStorage.setItem(key, data);
    }
    catch(e){
        console.error(e);
    }
}

/**
 * checks whether the input is an integer, used to anticipate uuid type data
 * @param data input
 * @returns 
 */
function isInteger(data: string): boolean {
    return typeof data === 'string' && /^[+-]?\d+$/.test(data);
}

/**
 * gets an item from the AsyncStorage
 * @param key the key of the item
 * @returns the item stored in the AsyncStorage
 */
export async function getItem<_T extends keyof AsyncStorageItem>(key: _T): Promise<AsyncStorageItem[_T] | null> {
    try {
        const data = await AsyncStorage.getItem(key);
        console.log(`getting data from async storage with key: ${key}, data: ${data}`);
        
        if(data === null)
            return null;
        if(isInteger(data)){
            if(!isNaN(parseInt(data))){
                console.log(`this data is int, ${parseInt(data)}`);
                return parseInt(data) as any;
            }
        }
        
        if(data === "true" || data === "false"){
            return (data === "true") as AsyncStorageItem[_T];
        }

        if(isJson(data)){
            return JSON.parse(data);
        }

        return data as AsyncStorageItem[_T];
    }
    catch(e){
        console.error(e);
    }

    return null;
}