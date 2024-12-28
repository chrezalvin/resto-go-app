import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { ActivityIndicator, View } from "react-native";
import { Text } from "react-native-paper";
import { BarcodeScanningResult, CameraView } from "expo-camera";
import styles from "../styles";
import { FoodList, isFoodList } from "../api/models/FoodList";
import { useEffect, useState } from "react";
import { setCart, useAppDispatch } from "../state";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { setItem } from "../libs/AsyncStorage";
import { getProfile } from "../api/services/authenticate";

const routeName = routeList.cashierBarcodeScanner;
type CashierDetailProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

interface CashBarcodeData {
    customer_id: string;
    note: string;
    food_list: FoodList[];
}

function isCashBarcodeData(data: unknown): data is CashBarcodeData{
    if(typeof data !== "object" || data === null)
        return false;

    if(!("customer_id" in data) || typeof data.customer_id !== "string")
        return false;

    if(!("note" in data) || typeof data.note !== "string")
        return false;

    if(!("food_list" in data) || !Array.isArray(data.food_list))
        return false;

    if(!data.food_list.every(isFoodList))
        return false;

    return true;
}

export function CashierBarcodeScanner(props: CashierDetailProps){
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function onBarcodeScanned(data: BarcodeScanningResult){
        setIsLoading(true);
        setError(null);

        try{
            const dataJson = JSON.parse(data.data);

            if(!isCashBarcodeData(dataJson)){
                setError("Invalid barcode data");
                return;
            }
            else{
                const cartToSet: {[key: number]: number} = dataJson
                    .food_list
                    .reduce((acc, item) => {
                        acc[item.food_id] = item.quantity;
                        return acc;
                    }, {} as {[key: number]: number});

                dispatch(setCart(cartToSet));
                await setItem("customer_id", dataJson.customer_id);

                // make sure the transaction haven't been made
                const profile = await getProfile();

                if(!profile){
                    setError("Invalid User!");
                    return;
                }

                if(profile.transaction)
                    setError("Transaction has already been made");
                else
                    props.navigation.navigate(routeList.cashierConfirmPayment);
            }
        }
        catch(e){
            console.error(e);
            setError("Failed to scan barcode");
        }
        finally{
            setIsLoading(false);
        }
    }

    // vibrate when error
    useEffect(() => {
        if(error)
            impactAsync(ImpactFeedbackStyle.Medium);
    }, [error]);

    return (
        <View
            style={[
                styles.containerFill,
                styles.justifyCenter,
                styles.alignItemsCenter,
                styles.gap3,
            ]}
        >
            <Text 
                variant="titleLarge"
                style={[
                    styles.textLight,
                    styles.fwBold,
                    styles.textCenter,
                ]}
            >
                Scan barcode
            </Text>
            <View
                style={[
                    {
                        width: "60%",
                        aspectRatio: 1,
                    }
                ]}
            >
                    {
                        isLoading ? (
                            <View 
                                style={[
                                    styles.containerFill,
                                    styles.bgDark,
                                ]}
                            />
                        ) : (
                            <CameraView
                                style={[
                                    styles.containerFill,
                                    styles.rounded4
                                ]}
                                barcodeScannerSettings={{
                                    barcodeTypes: ["qr"]
                                }}
                            
                                onBarcodeScanned={onBarcodeScanned}
                                // accessing barcode on web
                                //@ts-ignore
                                barCodeScannerSettings={{
                                    barCodeTypes: ["qr"],
                                }}
                                //@ts-ignore
                                onBarCodeScanned={onBarcodeScanned}
                            />
                        )
                    }
            </View>
            {
                error !== null &&
                <Text
                    variant="bodyMedium"
                    style={[
                        styles.textLight,
                        styles.fwBold,
                        styles.textCenter,
                    ]}
                >
                    {error}
                </Text>
            }

            {
                isLoading && (
                    <View style={[
                        styles.absolute,
                        styles.top0,
                        styles.left0,
                        styles.right0,
                        styles.bottom0,
                    ]}>
                        <View 
                            style={[
                                {
                                    opacity: 0.5
                                },
                                styles.absolute,
                                styles.top0,
                                styles.left0,
                                styles.right0,
                                styles.bottom0,
                                styles.bgMuted,
                            ]}
                        />
                        <View style={[
                            styles.flexHorizontal,
                            styles.justifyCenter,
                            styles.alignItemsCenter,
                            styles.containerFill,
                            styles.gap3,
                        ]}>
                            <View style={[
                                {
                                    width: 100,
                                    height: 100,
                                    elevation: 10,
                                },
                                styles.bgLight,
                                styles.justifyCenter,
                                styles.alignItemsCenter,
                            ]}>
                                <ActivityIndicator size={50} />
                            </View>
                        </View>
                    </View>
                )
            }
        </View>
    );
}

export default {
    name: routeName,
    component: CashierBarcodeScanner,
} as PageIndex<typeof routeName>;