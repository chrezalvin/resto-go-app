import AsyncStorage from "@react-native-async-storage/async-storage";

interface AsyncStorageItem {
    isDark: boolean;
}

const initialAsyncStorageItem: AsyncStorageItem = {
    isDark: true,
}

export async function populateAsyncStorage(): Promise<void> {
    for(const key in initialAsyncStorageItem){
        const data = await getItem(key as keyof AsyncStorageItem);

        if(data === null){
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
 * gets an item from the AsyncStorage
 * @param key the key of the item
 * @returns the item stored in the AsyncStorage
 */
export async function getItem<_T extends keyof AsyncStorageItem>(key: _T): Promise<AsyncStorageItem[_T] | null> {
    try {
        const data = await AsyncStorage.getItem(key);

        
        if(data === null)
            return null;
        
        if(!isNaN(parseInt(data))){
            return parseInt(data) as any;
        }
        
        if(data === "true" || data === "false"){
            return (data === "true") as any;
        }

        if(isJson(data)){
            return JSON.parse(data);
        }
    }
    catch(e){
        console.error(e);
    }

    return null;
}