import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { useEffect, useState } from "react";
import { getTransactionFullDetail } from "../api/services/transaction";
import { Image, View } from "react-native";
import { ActivityIndicator, Card, Text } from "react-native-paper";
import styles from "../styles";
import BackButton from "../components/BackButton";
import { TransactionFullDetail } from "../api/models/TransactionFullDetail";
import colors from "../styles/defaultSettings";
import Awaitable from "../components/Awaitable";
import { TransactionCashless } from "../api/models/TransactionCashless";

const routeName = routeList.transactionView;
type TransactionViewProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

const cashImage = require('../assets/images/Cash.png');
const debitImage = require('../assets/images/Debit.png');
const qrisImage = require('../assets/images/QR.png');

export function TransactionViewPage(props: TransactionViewProps){
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [transaction, setTransaction] = useState<TransactionFullDetail | null>(null);

    async function loadTransaction(){
        setIsLoading(true);
        setError(null);
        setTransaction(null);

        try{
            const newTransaction = await getTransactionFullDetail(props.route.params.transaction_id);

            console.log(`newTransaction: ${JSON.stringify(newTransaction)}`);

            setTransaction(newTransaction);
        }
        catch(e){
            console.error(e);
            setError("Failed to load transaction");
        }
        finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadTransaction();
    }, []);

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
            </View>

            <Awaitable 
                isLoading={isLoading}
                isError={error !== null}
                errorNode={(<Text>{error}</Text>)}
                loadingNode={(
                    <View
                        style={[
                            styles.containerFill,
                            styles.justifyCenter,
                            styles.alignItemsCenter,
                            styles.gap3,
                            styles.p3,
                        ]}
                    >
                        <ActivityIndicator
                            color={colors.light}
                            size="large"
                        />
                    </View>
                )}
                loadedNode={transaction ? (
                    <View style={[
                        styles.containerFill,
                        styles.alignItemsCenter,
                        styles.gap3,
                        styles.p3,
                    ]}>
                        <Text style={[styles.textLight]}>{transaction.transaction.branch_name} | {transaction.transaction.address}</Text>
                        <Image 
                            source={transaction.transaction.payment_method === "cash" ? cashImage : debitImage}
                            style={{
                                width: 100,
                                height: 100,
                            }}
                        />

                        <Text variant="bodyLarge" style={[styles.textLight]}>Rp. {transaction.transaction.price}</Text>
                        <Text style={[styles.textLight]}>Payment via: {transaction.transaction.payment_method === "cash" ? "cash" : (transaction.payment as TransactionCashless).cashless_payment_method}</Text>
                        <Text style={[styles.textLight]}>{transaction.transaction.created_at}</Text>

                        {
                            transaction.transaction.note && (
                                <Text 
                                    style={[
                                        styles.textLight, 
                                        styles.textLeft,
                                        styles.w100,
                                    ]}
                                >Note: {transaction.transaction.note}</Text>
                            )
                        }
                        <View style={[
                            styles.gap1,
                            styles.containerFill,
                            styles.w100
                        ]}>
                            {
                                transaction.foods.map((food) => (
                                    <Card key={food.food_id}>
                                        <Card.Title
                                            title={food.food_name}
                                            subtitle={`Rp. ${food.price.toLocaleString()}`}
                                            rightStyle={[styles.mr3]}
                                            right={(_) => (
                                                <Text variant="titleMedium">
                                                    {food.quantity}
                                                </Text>
                                            )}
                                            left={(leftProps) => {
                                                if(!food.img_path) return null;

                                                return (
                                                    <Image 
                                                        source={{uri: food.img_path}}
                                                        style={{
                                                            width: leftProps.size,
                                                            height: leftProps.size,
                                                        }}
                                                    />
                                                );
                                            }}
                                        />
                                        {
                                            food.note && <Card.Content>
                                                <Text>note: {food.note}</Text>
                                            </Card.Content>
                                        }
                                    </Card>
                                ))
                            }
                        </View>
                    </View>
                ) : (<View></View>)}
            />
        </View>
    );
}

export default {
    name: routeName,
    component: TransactionViewPage,
} as PageIndex<typeof routeName>;