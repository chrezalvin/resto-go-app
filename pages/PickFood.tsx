import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { View } from "react-native";
import { Text } from "react-native-paper";

const routeName = routeList.pickFood;
type PickFoodProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function PickFood(props: PickFoodProps){
    return (
        <View>
            <Text>Pick Food</Text>
        </View>
    );
}

export default {
    name: routeName,
    component: PickFood,
} as PageIndex<typeof routeName>;