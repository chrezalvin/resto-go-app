import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { routeList, RouteStackParamList } from '../shared';
import { Ionicons } from '@expo/vector-icons';

const routeName = routeList.paymentVerification;
type PaymentVerificationProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function PaymentVerification({ navigation }: PaymentVerificationProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate(routeList.foodWaiting);
        }, 4000); // Menunggu 4 detik

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Ionicons name="checkmark-circle" size={120} color="green" />
            <Text style={styles.text}>Pembayaran Anda Telah Berhasil</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        marginTop: 20,
    },
});

export default PaymentVerification;
