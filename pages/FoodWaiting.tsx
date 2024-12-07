import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { View, Image } from "react-native";
import { Text } from "react-native-paper";
import styles from "../styles";

const foodWaitingImg = require("../assets/images/pesanan_berhasil.png");
const clockIcon = require("../assets/images/clock.png");

const routeName = routeList.foodWaiting;
type FoodWaitingProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function FoodWaiting(props: FoodWaitingProps){
    return (
        <View style={[
            styles.p3,
            styles.containerFill,
        ]}>
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
                <Text variant="headlineSmall" style={[styles.textLight, styles.textCenter]}>18m 44s...</Text>
            </View>
        </View>
    );
}

export default {
    name: routeName,
    component: FoodWaiting,
} as PageIndex<typeof routeName>;