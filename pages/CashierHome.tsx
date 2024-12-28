import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import styles from "../styles";
import colors from "../styles/defaultSettings";

const routeName = routeList.cashierhome;
type FoodDetailProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

export function CashierHome(props: FoodDetailProps){
    return (
        <View
            style={[
                styles.p4,
                styles.gap3,
                styles.justifyCenter,
                styles.containerFill,
                styles.alignItemsCenter
            ]}
        >
            <Text
                variant="titleLarge"
                style={[
                    styles.textLight,
                    styles.fwBold,
                    styles.textCenter,
                ]}
            >RestoGo Cashier</Text>
            <Button 
                style={[
                    {
                        width: "100%",
                        maxWidth: 300
                    },
                ]}
                buttonColor={colors.danger}
                onPress={() => props.navigation.navigate(routeList.cashierBarcodeScanner)}
            >
                <Text
                    variant="bodyMedium"
                    style={[
                        styles.textLight,
                        styles.fwBold,
                    ]}
                >Scan Barcode</Text>
            </Button>
        </View>
    );
}

export default {
    name: routeName,
    component: CashierHome,
} as PageIndex<typeof routeName>;