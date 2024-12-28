import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Image, Animated, Easing, Dimensions, TouchableOpacity, ImageSourcePropType, ActivityIndicator } from 'react-native';
import { Text, Button, Card, Modal, Portal, Divider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routeList, RouteStackParamList } from '../shared';
import styles from '../styles';
import BackButton from '../components/BackButton';
import { createCashlessPayment, transaction_checkout } from '../api/services/payment';
import { CheckoutResponse } from '../api/models/CheckoutResponse';
import { useAppDispatch, useAppSelector } from '../state';
import { FoodList } from '../api/models/FoodList';
import colors from '../styles/defaultSettings';
import { PageIndex } from '../libs';
import { getItem, setItem } from '../libs/AsyncStorage';

// Import images
const cashImage = require('../assets/images/Cash.png');
const debitImage = require('../assets/images/Debit.png');
const qrisImage = require('../assets/images/QR.png');

const routeName = routeList.checkout;
type CheckoutProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function Checkout({ navigation }: CheckoutProps) {
    const dispatch = useAppDispatch();
    const cart = useAppSelector(state => state.cart.cart);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [checkoutList, setCheckoutList] = useState<CheckoutResponse[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const animatedValue = useRef(new Animated.Value(0)).current;

    async function doCashlessPayment(){
        setIsLoading(true);
        setError(null);

        try{
            const transaction = await createCashlessPayment({
                note: "",
                food_list: Object
                    .entries(cart)
                    .map(([key, value]) => ({
                        food_id: parseInt(key),
                        quantity: value
                    }))
            });

            const transactionId = transaction.transaction_id;
            const transactionIdList = await getItem("previous_transaction_id");
            
            if(transactionIdList)
                await setItem("previous_transaction_id", [transactionId, ...transactionIdList]);

            navigation.replace(routeList.foodWaiting);
        }
        catch(e){
            console.log(e);

            if(e instanceof Error)
                setError(e.message);
        }
        finally{
            setIsLoading(false);
        }
    }

    const handlePaymentMethodSelect = (method: string) => {
        setModalVisible(false);
        navigation.navigate(routeList.qrCashPayment);
        // setSelectedPaymentMethod(method);
        // handleModalVisibility(false);
    };

    const handleModalVisibility = (isVisible: boolean) => {
        setModalVisible(isVisible);
        Animated.timing(animatedValue, {
            toValue: isVisible ? 1 : 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        if (isModalVisible) {
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [isModalVisible]);

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

    useEffect(() => {
        loadCheckout();
    }, []);

    const modalTranslateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [Dimensions.get('window').height, 0], // Floating in from bottom
    });

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

    const PaymentMethodButtonUI = (props: {
        image?: ImageSourcePropType,
        title?: string,
        description?: string,
        onPress: () => void,
    }) => {
        return (
            <TouchableOpacity
                style={[
                    { 
                        height: 80, 
                        borderWidth: 1, 
                    },
                    styles.alignItemsCenter,
                    styles.rounded4,
                ]} 
                onPress={props.onPress}
            >
                <View 
                    style={[
                        styles.flexHorizontal, 
                        styles.alignItemsCenter,
                        styles.containerFill,
                    ]}
                >
                    <View style={{ backgroundColor: styles.bgDanger.backgroundColor, padding: 8, borderRadius: 5, marginRight: 8 }}>
                        <Image source={props.image} style={{ width: 40, height: 40 }} />
                    </View>
                    <View>
                        <Text variant="titleMedium" style={[styles.textDark]}>
                            {props.title}
                        </Text>
                        <Text variant="bodyLarge" style={[styles.textMuted]}>
                            {props.description}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
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
                onPress={isLoading ? undefined : () => handleModalVisibility(true)}
            >
                <Text variant="bodyMedium" style={[
                    styles.textLight, 
                    styles.fwBold, 
                ]}>
                    Lanjut ke pembayaran
                </Text>
            </Button>

            <Portal>
                <Modal 
                    visible={isModalVisible} 
                    onDismiss={() => handleModalVisibility(false)} 
                    contentContainerStyle={[
                        styles.containerFill,
                        styles.justifyEnd,
                        styles.p0,
                        styles.m0,
                    ]}
                    dismissable={true}
                    dismissableBackButton={true}
                >
                    <Animated.View style={{ width: '100%', height: '90%', transform: [{ translateY: modalTranslateY }] }}>
                        <Card 
                            style={[
                                {
                                    borderTopLeftRadius: 16,
                                    borderTopRightRadius: 16,
                                },
                                styles.containerFill,
                                styles.p3,
                            ]}
                        >
                            <Card.Title 
                                title="Select a payment method"
                                titleStyle={[
                                    styles.fwBold,
                                ]}
                            />
                            <Card.Content>
                                <View
                                    style={[
                                        styles.gap3,
                                    ]}
                                >
                                    <PaymentMethodButtonUI
                                        image={cashImage}
                                        title="Cash"
                                        description="Bayar di kasir"
                                        onPress={() => handlePaymentMethodSelect('Cash')}
                                    />
                                    <PaymentMethodButtonUI
                                        image={debitImage}
                                        title="Debit"
                                        description="Gunakan debit card pada pembayaran"
                                        onPress={() => doCashlessPayment()}
                                    />
                                    <PaymentMethodButtonUI
                                        image={qrisImage}
                                        title="QRIS"
                                        description="Scan untuk bayar menggunakan QR Code"
                                        onPress={() => handlePaymentMethodSelect('QRIS')}
                                    />
                                </View>
                            </Card.Content>
                        </Card>
                    </Animated.View>
                </Modal>

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
            </Portal>
            
        </View>
    );
}

export default {
    name: routeName,
    component: Checkout,
} as PageIndex<typeof routeName>;
