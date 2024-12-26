import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { Audio, AVPlaybackSource } from "expo-av";
import styles from "../styles";
import { getCustomerInBranch, getFoodByBranch } from "../api/services/getFood";
import { FoodList } from "../api/models/FoodList";
import { Food, Transaction } from "../api/models";
import { CustomerView } from "../api/models/CustomerView";
import colors from "../styles/defaultSettings";
import { finallizeTransaction } from "../api/services/payment";
import { createChefWebSocket } from "../shared/websocket";

const dingAudio = require("../assets/audios/ding.mp3");

const routeName = routeList.chefOrderDetail;
type ChefMenuProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

interface PendingFoodOrder{
    customer: CustomerView;
    transaction: Transaction;
    foodList: FoodList[];
}

export function ChefMenu(props: ChefMenuProps){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pendingFoodOrder, setPendingFoodOrder] = useState<PendingFoodOrder[]>([]);
    const [allFoodInBranch, setAllFoodInBranch] = useState<{[key: number]: Food}>({});

    async function loadFoodLookup(){
        setIsLoading(true);
        setError(null);

        try{
            const allFoodInBranch = await getFoodByBranch(1);

            const foodLookup = allFoodInBranch.reduce((acc, food) => {
                acc[food.food_id] = food;
                return acc;
            }, {} as {[key: number]: Food});

            setAllFoodInBranch(foodLookup);
        }
        catch(e){
            console.log(e);
            if(e instanceof Error){
                setError(e.message);
            }
        }
        finally{
            setIsLoading(false);
        }
    }

    async function loadMenu(){
        setIsLoading(true);
        setError(null);

        try{
            const res = await getCustomerInBranch(1);

            const orders: PendingFoodOrder[] = res.map((order) => {
                return {
                    customer: order.customer,
                    transaction: order.transaction,
                    foodList: order.foods.map((food) => {
                        return {
                            food_id: food.food_id,
                            quantity: food.quantity,
                        }
                    }),
                }
            });

            setPendingFoodOrder(orders);
        }
        catch(e){
            console.log(e);
            if(e instanceof Error){
                setError(e.message);
            }
        }
        finally{
            setIsLoading(false);
        }
    }

    async function onFinishButtonClicked(transaction_id: number){
        try{
            await finallizeTransaction(transaction_id);
            await loadMenu();
        }
        catch(e){
            console.log(e);
            if(e instanceof Error){
                setError(e.message);
            }
        }
    }

    const [sound, setSound] = useState<Audio.Sound>();

    async function playSound(audioSource: AVPlaybackSource){
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(audioSource);
      setSound(sound);
  
      console.log('Playing Sound');
      await sound.playAsync();
    }
  
    useEffect(() => {
      return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync();
          }
        : undefined;
    }, [sound]);

    useEffect(() => {
        const ws = createChefWebSocket();
        
        ws.onmessage = async (e) => {
            console.log(e.data);

            await loadMenu();

            playSound(dingAudio);
        }

        ws.onclose = () => {
            console.log("closed");
        }

        loadFoodLookup().then(() => loadMenu());
    }, []);

    function checkoutListUI(item: {id: number, name: string, note: string, quantity: number}) {
        return (
            <View key={item.id}>
                <View style={[styles.flexHorizontal, styles.justifyBetween, styles.mb1]}>
                    <Text variant="bodyMedium" style={[styles.textDark, styles.fwBold]}>
                        {item.name}
                    </Text>
                    <Text variant="bodyMedium" style={[styles.textDark, styles.fwBold]}>
                        x{item.quantity}
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
        <View
            style={[
                styles.containerFill,
                styles.gap3,
                styles.p4,
            ]}
        >
            <Text
                variant="titleLarge"
                style={[
                    styles.fwBold,
                    styles.textCenter,
                    styles.textLight,
                ]}
            >
                Pending Order
            </Text>
            <ScrollView
                refreshControl={<RefreshControl 
                    refreshing={isLoading}
                    onRefresh={loadMenu}
                />}
                contentContainerStyle={[
                    styles.gap3,
                ]}
            >
                {
                    pendingFoodOrder.length === 0 && (
                        <Text
                            variant="titleMedium"
                            style={[
                                styles.textCenter,
                                styles.textLight,
                                styles.fwBold,
                            ]}
                        >
                            No pending order
                        </Text>
                    )
                }
                {
                    pendingFoodOrder.map((pendingOrder) => {
                        return (
                            <Card 
                                style={[styles.mb4, styles.p3]}
                                key={pendingOrder.customer.customer_id}
                            >
                                <Card.Title 
                                    title={`Meja No. ${pendingOrder.customer.seat_no}`}
                                />
                                <Card.Content>
                                    <View style={[
                                        styles.mb2,
                                    ]}>
                                        <Text>Note: {pendingOrder.transaction.note}</Text>
                                    </View>
                                    {
                                        pendingOrder.foodList.map((food) => {
                                            return checkoutListUI({
                                                id: food.food_id,
                                                name: allFoodInBranch[food.food_id].food_name,
                                                note: "",
                                                quantity: food.quantity,
                                            });
                                        })
                                    }
                                </Card.Content>
                                <Card.Actions
                                    style={[
                                        styles.mt2,
                                    ]}
                                >
                                    <Button 
                                        buttonColor={colors.primary}
                                        onPress={() => {
                                            onFinishButtonClicked(pendingOrder.transaction.transaction_id);
                                        }}
                                    >
                                        <Text
                                            variant="bodyMedium"
                                            style={[
                                                styles.textLight,
                                                styles.fwBold,
                                            ]}
                                        >
                                            Finish Order
                                        </Text>
                                    </Button>
                                </Card.Actions>
                            </Card>
                        );
                    })
                }
            </ScrollView>
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
    component: ChefMenu,
} as PageIndex<typeof routeName>;