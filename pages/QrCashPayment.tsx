import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import QRCode from 'react-native-qrcode-svg';
import styles from "../styles";
import colors from "../styles/defaultSettings";
import BackButton from "../components/BackButton";
import { useAppSelector } from "../state";
import { useEffect, useState } from "react";
import { FoodList } from "../api/models/FoodList";
import { getItem } from "../libs/AsyncStorage";
import { getProfile } from "../api/services/authenticate";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

const burgerLogo = require("../assets/images/burger_logo.png");

const routeName = routeList.qrCashPayment;
type FoodDetailProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function QrCashPayment(props: FoodDetailProps){
    const cart = useAppSelector(state => state.cart.cart);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [foodList, setFoodList] = useState<FoodList[]>([]);
    const [customerId, setCustomerId] = useState<string>("");
    const [error, setError] = useState<string | null>();

    async function confirmPayment(){
        setIsLoading(true);
        setError(null);

        try{
            const profile = await getProfile();

            if(profile?.transaction)
                props.navigation.replace(routeList.foodWaiting);
            else
                setError("Transaction not found");
        }
        catch(e){
            console.error(e);
            setError("Transaction not found");

            impactAsync(ImpactFeedbackStyle.Medium);
        }
        finally{
            setIsLoading(false);
        }
    }

    async function loadFoodList(){
        setIsLoading(true);
        setError(null);

        try {
            const customerId = await getItem("customer_id");
            const foodListData = Object.entries(cart).map(([key, value]) => ({
                food_id: parseInt(key),
                quantity: value
            }));

            if(!customerId)
                throw new Error("Customer ID not found");

            setFoodList(foodListData);
            setCustomerId(customerId);
        } catch (error) {
            console.error(error);

            if(error instanceof Error)
                setError(error.message);

            impactAsync(ImpactFeedbackStyle.Medium);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadFoodList();
    }, []);

    const data = {
        customer_id: customerId,
        note: "Add more salami to the pizza",
        food_list: foodList,
    };

    return (
        <View 
            style={[
                styles.containerFill,
                styles.p4,
            ]}
        >
            <View>
                <BackButton 
                    onBack={props.navigation.goBack}
                />
            </View>
            <View style={[
                styles.containerFill,
                styles.justifyCenter,
                styles.alignItemsCenter,
                styles.gap3,
            ]}>
                <Text
                    variant="headlineMedium"
                    style={[
                        styles.textLight,
                        styles.fwBold,
                        styles.textCenter,
                    ]}
                >Minta kasir untuk scan barcode</Text>
                <View
                    style={{
                        borderColor: colors.danger,
                        borderWidth: 10,
                        borderRadius: 8,
                    }}
                >
                    <QRCode
                        value={JSON.stringify(data)}
                        size={300}
                        logo={burgerLogo}
                    />
                </View>
                <View>
                    {
                        error && (
                            <Text
                                variant="bodyMedium"
                                style={[
                                    styles.textWarning,
                                    styles.textCenter,
                                    styles.fwBold,
                                ]}
                            >{error}</Text>
                        )
                    }
                </View>
            </View>
            <View
                style={[
                    styles.w100,
                ]}
            >
                <Button
                    buttonColor={colors.danger}
                    onPress={isLoading ? undefined : confirmPayment}
                    style={[
                        styles.py1,
                        isLoading && styles.bgMuted,
                    ]}
                >
                    <Text
                        variant="bodyLarge"
                        style={[
                            styles.textLight,
                            styles.fwBold,
                        ]}
                    >Saya sudah bayar</Text>
                </Button>
            </View>
        </View>
    );
}

export default {
    name: routeName,
    component: QrCashPayment,
} as PageIndex<typeof routeName>;