import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Image, Animated, Easing, Dimensions } from 'react-native';
import { Text, Button, IconButton, Card, Modal, Portal, Divider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routeList, RouteStackParamList } from '../shared';
import styles from '../styles';

// Import images
const cashImage = require('../assets/images/Cash.png');
const debitImage = require('../assets/images/Debit.png');
const qrisImage = require('../assets/images/QR.png');

const routeName = routeList.checkout;
type CheckoutProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function Checkout({ navigation }: CheckoutProps) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const animatedValue = useRef(new Animated.Value(0)).current;

    const handlePaymentMethodSelect = (method: string) => {
        setSelectedPaymentMethod(method);
        handleModalVisibility(false);
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

    const modalTranslateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [Dimensions.get('window').height, 0], // Floating in from bottom
    });

    return (
        <View style={[styles.containerFill, styles.p3]}>
            <View style={[styles.flexHorizontal, styles.alignItemsCenter, styles.mb3]}>
                <IconButton
                    icon={() => <Text style={{ color: 'white', fontSize: 24 }}>{'<'}</Text>}
                    size={32}
                    onPress={() => navigation.navigate(routeList.pickFood)}
                    style={{
                        backgroundColor: styles.bgDanger.backgroundColor,
                        borderRadius: 5,
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
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
                        <View style={[styles.flexHorizontal, styles.justifyBetween, styles.mb1]}>
                            <Text variant="bodyMedium" style={[styles.textDark, styles.fwBold]}>
                                Cheese Burger (1)
                            </Text>
                            <Text variant="bodyMedium" style={[styles.textDark, styles.fwBold]}>
                                Rp. 50.000
                            </Text>
                        </View>
                        <View style={[styles.ml3, styles.mb1]}>
                            <Text variant="bodyMedium" style={[styles.textMuted, { fontWeight: 'bold' }]}>
                                • Ekstra Ham
                            </Text>
                            <Text variant="bodyMedium" style={[styles.textMuted, { fontWeight: 'bold' }]}>
                                • Add Egg
                            </Text>
                        </View>
                        <View style={[styles.flexHorizontal, styles.justifyBetween]}>
                            <Text variant="bodyMedium" style={[styles.textDark, styles.fwBold]}>
                                Other fee(s)
                            </Text>
                            <Text variant="bodyMedium" style={[styles.textDark, styles.fwBold]}>
                                Rp. 1.500
                            </Text>
                        </View>
                        <Divider style={[styles.mb3, { backgroundColor: styles.textDark.color }]} />

                        <View style={[styles.flexHorizontal, styles.justifyBetween, styles.mb3]}>
                            <Text variant="titleMedium" style={[styles.textDark, styles.fwBold]}>
                                Total Payment
                            </Text>
                            <Text variant="titleMedium" style={[styles.textDark, styles.fwBold]}>
                                Rp. 61.500
                            </Text>
                        </View>

                        <Text variant="titleMedium" style={[styles.textDark, styles.fwBold, styles.mb2]}>
                            Payment Method
                        </Text>
                        <Button mode="outlined" style={{ borderColor: 'black' }} onPress={() => handleModalVisibility(true)}>
                            {selectedPaymentMethod || "Cash"}
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>

            <Button
                mode="contained"
                buttonColor={styles.bgDanger.backgroundColor}
                style={[{ paddingVertical: 6, paddingHorizontal: 16, fontSize: 14 }, styles.mt3]}
                onPress={() => navigation.navigate(routeList.foodWaiting)}
            >
                Checkout(1)
            </Button>

            <Portal>
                <Modal visible={isModalVisible} onDismiss={() => handleModalVisibility(false)} contentContainerStyle={{ margin: 0, padding: 0, flex: 1, justifyContent: 'flex-end' }}>
                    <Animated.View style={{ width: '100%', height: '90%', transform: [{ translateY: modalTranslateY }] }}>
                        <Card style={{ width: '100%', height: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                            <Card.Content>
                                <Text variant="titleMedium" style={[styles.textDark, styles.fwBold, styles.mb3]}>
                                    Select a payment method
                                </Text>

                                <Button mode="outlined" style={{ borderColor: 'black', borderWidth: 1, paddingVertical: 24, alignSelf: 'stretch' }} onPress={() => handlePaymentMethodSelect('Cash')}>
                                    <View style={[styles.flexHorizontal, styles.alignItemsCenter]}>
                                        <View style={{ backgroundColor: styles.bgDanger.backgroundColor, padding: 8, borderRadius: 5, marginRight: 8 }}>
                                            <Image source={cashImage} style={{ width: 40, height: 40 }} />
                                        </View>
                                        <View>
                                            <Text variant="titleMedium" style={[styles.textDark]}>
                                                Cash
                                            </Text>
                                            <Text variant="bodyLarge" style={[styles.textMuted]}>
                                                Bayar di cashier
                                            </Text>
                                        </View>
                                    </View>
                                </Button>
                                <Button mode="outlined" style={{ borderColor: 'black', borderWidth: 1, paddingVertical: 24, alignSelf: 'stretch' }} onPress={() => handlePaymentMethodSelect('Debit')}>
                                    <View style={[styles.flexHorizontal, styles.alignItemsCenter]}>
                                        <View style={{ backgroundColor: styles.bgDanger.backgroundColor, padding: 8, borderRadius: 5, marginRight: 8 }}>
                                            <Image source={debitImage} style={{ width: 40, height: 40 }} />
                                        </View>
                                        <View>
                                            <Text variant="titleMedium" style={[styles.textDark]}>
                                                Debit
                                            </Text>
                                            <Text variant="bodyLarge" style={[styles.textMuted]}>
                                                Gunakan debit card pada pembayaran
                                            </Text>
                                        </View>
                                    </View>
                                </Button>
                                <Button mode="outlined" style={{ borderColor: 'black', borderWidth: 1, paddingVertical: 24, alignSelf: 'stretch' }} onPress={() => handlePaymentMethodSelect('QRIS')}>
                                    <View style={[styles.flexHorizontal, styles.alignItemsCenter]}>
                                        <View style={{ backgroundColor: styles.bgDanger.backgroundColor, padding: 8, borderRadius: 5, marginRight: 8 }}>
                                            <Image source={qrisImage} style={{ width: 40, height: 40 }} />
                                        </View>
                                        <View>
                                            <Text variant="titleMedium" style={[styles.textDark]}>
                                                QRIS
                                            </Text>
                                            <Text variant="bodyLarge" style={[styles.textMuted]}>
                                                Scan untuk bayar menggunakan QR Code
                                            </Text>
                                        </View>
                                    </View>
                                </Button>
                            </Card.Content>
                        </Card>
                    </Animated.View>
                </Modal>
            </Portal>
        </View>
    );
}

export default {
    name: routeName,
    component: Checkout,
} as PageIndex<typeof routeName>;
