import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { View, Image, ScrollView, RefreshControl } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import styles from "../styles";
import { useEffect, useState } from "react";
import { getProfile } from "../api/services/authenticate";
import config from "../appConfig.json";
import { getItem } from "../libs/AsyncStorage";
import { createCustomerWebSocket } from "../shared/websocket";

const foodWaitingImg = require("../assets/images/pesanan_berhasil.png");
const clockIcon = require("../assets/images/clock.png");

const routeName = routeList.foodWaiting;
type FoodWaitingProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function FoodWaiting(props: FoodWaitingProps){
    const [eta, setEta] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formattedEta, setFormattedEta] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function loadEta(){
        setIsLoading(true);
        setError(null);

        try{
            const profile = await getProfile();
            if(!profile || !profile.transaction){
                props.navigation.replace(routeList.QrScanner);
                throw new Error("Transaction not found");
            }

            if(profile.transaction.finished)
                props.navigation.replace(routeList.foodFinished);

            setEta(profile.transaction.eta);
        }
        catch(e){
            console.error(e);
            setError("Failed to load ETA");
        }
        finally{
            setIsLoading(false);
        }
    }

    function formatEta(eta: string): string{
        const now = new Date();
        const etaDate = new Date(eta);

        const diff = etaDate.getTime() - now.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const seconds = Math.floor(diff / 1000);

        // setFormattedEta(`${hours}h ${minutes % 60}m ${seconds % 60}s`);
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }

    useEffect(() => {
        const ws = createCustomerWebSocket();

        ws.onmessage = (e) => {
            console.log("websocket message", e.data);
            loadEta();
        }

        loadEta();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if(eta)
                setFormattedEta(formatEta(eta));
        }, 1000);

        return () => clearInterval(interval);
    }, [eta])

    return (
        <ScrollView 
            contentContainerStyle={[
                styles.containerFill,
            ]}
            style={[
                styles.p3,
            ]}

            refreshControl={
                <RefreshControl 
                    refreshing={isLoading} 
                    onRefresh={loadEta}
                />
            }
        >
            <View style={[
                styles.gap2,
                styles.containerFill,
            ]}>
                <View style={{
                    width: "50%",
                    aspectRatio: 1,
                    alignSelf: "center",
                }}>
                    <Image
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        source={foodWaitingImg}
                    />
                </View>
                <Text variant="headlineMedium" style={[styles.textLight, styles.textCenter, styles.fwBold]}>Pesanan Berhasil!</Text>
                <Text variant="headlineSmall" style={[styles.textLight, styles.textCenter]}>Tunggu pesanan kamu dibuat ya...</Text>
            </View>
            <View style={[

            ]}>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                    }}
                    source={clockIcon}
                />
                <Text variant="headlineSmall" style={[styles.textLight, styles.textCenter, styles.fwBold]}>Waktu Estimasi</Text>
                {
                    !isLoading && eta? 
                        <Text variant="headlineSmall" style={[styles.textLight, styles.textCenter]}>{formatEta(eta)}...</Text>
                        :
                        <ActivityIndicator />
                }
            </View>
        </ScrollView>
    );
}

export default {
    name: routeName,
    component: FoodWaiting,
} as PageIndex<typeof routeName>;