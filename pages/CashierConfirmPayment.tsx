import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Image, Animated, Easing, Dimensions, Touchable, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Text, Button, Card, Modal, Portal, Divider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routeList, RouteStackParamList } from '../shared';
import styles from '../styles';
import BackButton from '../components/BackButton';
import { transaction_cash_confirm, transaction_checkout } from '../api/services/payment';
import { CheckoutResponse } from '../api/models/CheckoutResponse';
import { clearCart, useAppDispatch, useAppSelector } from '../state';
import { FoodList } from '../api/models/FoodList';
import colors from '../styles/defaultSettings';
import { PageIndex } from '../libs';
import { getItem, setItem } from '../libs/AsyncStorage';

// Import images
const cashImage = require('../assets/images/Cash.png');
const debitImage = require('../assets/images/Debit.png');
const qrisImage = require('../assets/images/QR.png');

const routeName = routeList.cashierConfirmPayment;
type CheckoutProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function CashierConfirmPayment({ navigation }: CheckoutProps) {
    const dispatch = useAppDispatch();
    const cart = useAppSelector(state => state.cart.cart);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [checkoutList, setCheckoutList] = useState<CheckoutResponse[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    async function loadCheckout(){
        setIsLoading(true);
        setError(null);

        try{
            console.log("calling loadChecout");
            const data: FoodList[] = Object
                .entries(cart)
                .map(([key, value]) => ({
                    food_id: Number(key),
                    quantity: value,
                }));

            
            console.log(`using data: ${JSON.stringify(data)}`);
            const res = await transaction_checkout(data);

            setTotalPrice(res.totalPrice);
            setCheckoutList(res.foodsWithPrice);
        }
        catch(e){
            console.log(`error: ${JSON.stringify(e)}`);

            setError(JSON.stringify(e));
        }
        finally{
            setIsLoading(false);
        }
    }

    async function confirmPayment(){
        setIsLoading(true);
        setError(null);

        try{
            const customer_id = await getItem("customer_id");
            const food_list = Object
                .entries(cart)
                .map(([key, value]) => ({ 
                    food_id: Number(key), 
                    quantity: value 
                }));

            if(!customer_id)
                throw new Error("Customer ID not found");

            const res = await transaction_cash_confirm({
                customer_id: customer_id,
                note: "",
                food_list: food_list,
            });

            dispatch(clearCart());
            setItem("customer_id", null);

            navigation.replace(routeList.cashierhome);
        }
        catch(e){
            setError(JSON.stringify(e));
        }
        finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadCheckout();
    }, []);

    function checkoutListUI(item: {id: number, name: string, note: string, quantity: number, price: number}) {
        return (
            <View key={item.id}>
                <View style={[styles.flexHorizontal, styles.justifyBetween, styles.mb1]}>
                    <Text variant="bodyMedium" style={[styles.textDark, styles.fwBold]}>
                        {item.name} ({item.quantity})
                    </Text>
                    <Text variant="bodyMedium" style={[styles.textDark, styles.fwBold]}>
                        Rp. {item.price.toLocaleString()}
                    </Text>
                </View>
                {/* <View style={[styles.ml3, styles.mb1]}>
                    <Text variant="bodyMedium" style={[styles.textMuted, { fontWeight: 'bold' }]}>
                        • Ekstra Ham
                    </Text>
                    <Text variant="bodyMedium" style={[styles.textMuted, { fontWeight: 'bold' }]}>
                        • Add Egg
                    </Text>
                </View> */}
            </View>
        )
    }

    return (
        <View style={[styles.containerFill, styles.p3]}>
            <View style={[styles.flexHorizontal, styles.alignItemsCenter, styles.mb3]}>
                <BackButton 
                    onBack={navigation.goBack}
                />
                <Text variant="headlineSmall" style={[styles.textLight, styles.textCenter, styles.fwBold, { flex: 1 }]}>
                    Checkout
                </Text>
            </View>

            <ScrollView>
                <Text variant="titleLarge" style={[styles.textLight, styles.fwBold, styles.mb2]}>
                    Payment Summary
                </Text>

                <Card style={[styles.mb4, styles.p3]}>
                    <Card.Content>
                        {
                            checkoutList.map((item) => checkoutListUI({
                                id: item.food_id,
                                name: item.food_name,
                                note: "",
                                quantity: item.quantity,
                                price: item.price,
                            }))
                        }
                        <Divider style={[styles.mb3, { backgroundColor: styles.textDark.color }]} />

                        <View style={[styles.flexHorizontal, styles.justifyBetween, styles.mb3]}>
                            <Text variant="titleMedium" style={[styles.textDark, styles.fwBold]}>
                                Total Payment
                            </Text>
                            <Text variant="titleMedium" style={[styles.textDark, styles.fwBold]}>
                                Rp. {totalPrice.toLocaleString()}
                            </Text>
                        </View>

                        {/* <Text variant="titleMedium" style={[styles.textDark, styles.fwBold, styles.mb2]}>
                            Payment Method
                        </Text> */}
                        {/* <Button mode="outlined" style={{ borderColor: 'black' }} onPress={() => handleModalVisibility(true)}>
                            {selectedPaymentMethod || "Cash"}
                        </Button> */}
                    </Card.Content>
                </Card>
            </ScrollView>

            <Button
                mode="contained"
                buttonColor={isLoading ? colors.muted : colors.danger}
                style={[
                    { 
                        paddingVertical: 6, 
                        paddingHorizontal: 16, 
                    }, 
                    styles.mt3,
                ]}
                onPress={isLoading ? undefined : confirmPayment}
            >
                <Text variant="bodyMedium" style={[
                    styles.textLight, 
                    styles.fwBold, 
                ]}>
                    Konfirmasi Pembayaran
                </Text>
            </Button>
        </View>
    );
}

export default {
    name: routeName,
    component: CashierConfirmPayment,
} as PageIndex<typeof routeName>;
