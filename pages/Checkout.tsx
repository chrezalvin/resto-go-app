import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { View } from "react-native";
import { Text } from "react-native-paper";

const routeName = routeList.checkout;
type CheckoutProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function Checkout(props: CheckoutProps){
    return (
        <View>
            <Text>Checkout</Text>
        </View>
    );
}

export default {
    name: routeName,
    component: Checkout,
} as PageIndex<typeof routeName>;