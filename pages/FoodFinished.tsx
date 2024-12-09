import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import styles from "../styles";
import colors from "../styles/defaultSettings";
import { logout } from "../api/services/authenticate";
import { useEffect, useState } from "react";
import { setItem } from "../libs/AsyncStorage";
import { useAudioPlayer } from "expo-audio";

const dingAudio = require("../assets/audios/ding.mp3");

const routeName = routeList.foodFinished;
type FoodDetailProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function FoodFinished(props: FoodDetailProps){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const dingAudioPlayer = useAudioPlayer(dingAudio);

    async function onGoBack(){
        setIsLoading(true);
        setError(null);

        try{
            await logout();
        }
        catch(e){
            console.log(e);
            if(e instanceof Error){
                setError(e.message);
            }
        }
        finally{
            setIsLoading(false);
            await setItem("customer_id", null);
            props.navigation.replace(routeList.QrScanner);
        }
    }

    useEffect(() => {
        dingAudioPlayer.play();
    }, []);

    return (
        <View
            style={[
                styles.containerFill,
                styles.p4,
            ]}
        >
            <Text
                variant="titleMedium"
                style={[
                    styles.textCenter,
                    styles.fwBold,
                    styles.textLight,
                ]}
            >Transaction Finished</Text>
            <View
                style={[
                    styles.containerFill,
                ]}
            >

            </View>
            <Button 
                buttonColor={isLoading ? colors.muted : colors.danger}
                onPress={isLoading ? undefined : onGoBack}
            >
                <Text
                    variant="bodyLarge"
                    style={[
                        styles.textLight,
                        styles.fwBold,
                    ]}
                >Go Back</Text>
            </Button>
        </View>
    );
}

export default {
    name: routeName,
    component: FoodFinished,
} as PageIndex<typeof routeName>;