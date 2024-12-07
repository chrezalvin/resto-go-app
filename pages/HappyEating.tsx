import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { View } from "react-native";
import { Text } from "react-native-paper";

const routeName = routeList.happyEating;
type HappyEatingProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function HappyEating(props: HappyEatingProps){
    return (
        <View>
            <Text>Happy Eating</Text>
        </View>
    );
}

export default {
    name: routeName,
    component: HappyEating,
} as PageIndex<typeof routeName>;