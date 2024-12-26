import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { useEffect, useState } from "react";
import { getTransactionBatch } from "../api/services/transaction";
import { TransactionView } from "../api/models/TransactionView";
import { getItem } from "../libs/AsyncStorage";
import { Image, RefreshControl, ScrollView, Touchable, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Card, Icon, Text, TouchableRipple } from "react-native-paper";
import BackButton from "../components/BackButton";
import styles from "../styles";

const cashImage = require('../assets/images/Cash.png');
const debitImage = require('../assets/images/Debit.png');
const qrisImage = require('../assets/images/QR.png');

const routeName = routeList.transactionHistory;
type TransactionHistoryProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function TransactionHistory(props: TransactionHistoryProps){
    const [transactions, setTransactions] = useState<TransactionView[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function loadTransactions(){
        setIsLoading(true);
        setError(null);

        try{
            const transactionIds = await getItem("previous_transaction_id");

            if(transactionIds){
                const transactions = await getTransactionBatch(transactionIds);
                setTransactions(transactions);
            } 
        }
        catch(e){
            console.error(e);
            setError("Failed to load transactions");
        }
        finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadTransactions();
    }, []);

    function TransactionCard(props: {transaction: TransactionView, onPress?: () => void}){
        const date = new Date(props.transaction.created_at);

        return (
            <Card
                onPress={props.onPress}
            >
                <Card.Title
                    rightStyle={[styles.mr2]}
                    title={date.toLocaleString()}
                    subtitle={`Rp. ${props.transaction.price.toLocaleString()}`}
                    right={(rightProps) => (
                        <Icon
                            source="chevron-right"
                            size={rightProps.size}
                        />
                    )}
                    left={(leftProps) => {
                        switch(props.transaction.payment_method){
                            case "cash":
                                return (<Image source={cashImage} style={{width: leftProps.size, height: leftProps.size}} />)
                            case "cashless":
                                return <Image source={debitImage} style={{width: leftProps.size, height: leftProps.size}} />
                            default:
                                return <Image source={cashImage} style={{width: leftProps.size, height: leftProps.size}} />
                        }
                    }}
                />
            </Card>
        );
    }

    return (
        <View style={[
            styles.containerFill,
            styles.gap3,
        ]}>
            <View style={[
                styles.flexHorizontal,
                styles.alignItemsCenter,
                styles.gap3,
            ]}>
                <BackButton
                    onBack={props.navigation.goBack}
                />
                <Text
                    variant="titleLarge"
                    style={[
                        styles.textLight,
                        styles.textCenter,
                        styles.fwBold,
                        styles.w100
                    ]}
                >Transaction History</Text>
            </View>

            {
                isLoading ? (
                    <View style={[
                        styles.containerFill,
                        styles.justifyCenter,
                        styles.alignItemsCenter,
                    ]}>
                        <ActivityIndicator 
                            color="white"
                        />
                    </View>
                ) : (
                    error ? (
                        <Text>{error}</Text>
                    ) : (
                        <ScrollView
                            refreshControl={<RefreshControl onRefresh={loadTransactions} refreshing={isLoading} />}
                            style={[
                                styles.h100,
                                styles.p4
                            ]}
                            contentContainerStyle={[
                                styles.gap2,
                            ]}
                        >
                            {
                                transactions.map((transaction) => (
                                        <TransactionCard 
                                            transaction={transaction} 
                                            onPress={() => props.navigation.navigate(routeList.transactionView, {transaction_id: transaction.transaction_id})}
                                            key={transaction.transaction_id}
                                        />
                                    )
                                )
                            }
                        </ScrollView>
                    )
                )
            }
        </View>
    )
}

export default {
    name: routeName,
    component: TransactionHistory,
} as PageIndex<typeof routeName>;