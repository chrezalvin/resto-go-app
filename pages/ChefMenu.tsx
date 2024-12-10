import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { View } from "react-native";
import { Text } from "react-native-paper";
import config from "../appConfig.json";
import { useEffect, useState } from "react";
import { Audio, AVPlaybackSource } from "expo-av";
import styles from "../styles";
import { getCustomerInBranch, getFoodList } from "../api/services/getFood";

const dingAudio = require("../assets/audios/ding.mp3");

const routeName = routeList.chefOrderDetail;
type ChefMenuProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function ChefMenu(props: ChefMenuProps){
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function loadMenu(){
        setIsLoading(true);
        setError(null);

        try{
            const allFoodInBranch = await getFoodList();
            const res = await getCustomerInBranch(1);


            console.log(res);
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
        const ws = new WebSocket(config.WEBSOCKET_URL);

        const branchSocketData = JSON.stringify({
            branch_id: 1,
            subscription: "subscribe"
        });

        ws.onopen = () => {
            console.log("connected, attempting to send data");

            ws.send(branchSocketData);
        };
        
        ws.onmessage = async (e) => {
            console.log(e.data);
            // playSound(dingAudio);
        }

        ws.onclose = () => {
            console.log("closed");
        }
    }, []);

    return (
        <View>
            <Text
                variant="bodyLarge"
                style={[
                    styles.fwBold,
                    styles.textCenter,
                    styles.textLight,
                ]}
            >
                Food Detail
            </Text>
        </View>
    );
}

export default {
    name: routeName,
    component: ChefMenu,
} as PageIndex<typeof routeName>;