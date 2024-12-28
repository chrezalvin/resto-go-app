import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { View } from "react-native";
import { Text } from "react-native-paper";

const routeName = routeList.foodDetail;
type FoodDetailProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function FoodDetail(props: FoodDetailProps){
    return (
        <View>
            <Text>Food Detail</Text>
        </View>
    );
}

export default {
    name: routeName,
    component: FoodDetail,
} as PageIndex<typeof routeName>;