import { PageIndex } from "@libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "@shared";
import styles from "@styles";
import { CameraView, useCameraPermissions } from "expo-camera";
import { getCurrentPositionAsync, requestBackgroundPermissionsAsync } from "expo-location";
import { useState, useMemo } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

const routeName = routeList.QrScanner;
type QrScannerProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

interface Location{
    latitude: number;
    longitude: number;
}

export function QrScanner(props: QrScannerProps){
    const [barcodeData, setBarCodeData] = useState<string | null>(null);
    const [location, setLocation] = useState<Location | null>(null);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [isLoading, setIsLoading] = useState(false);

    useMemo(() => {
        async function getLocation(){
            await requestCameraPermission();
            const status = await requestBackgroundPermissionsAsync();

            if(status.granted){
                setIsLoading(true);

                const position = await getCurrentPositionAsync();
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                setIsLoading(false);
            }

        }

        getLocation();
    }, []);

    if(isLoading)
        return (
            <View style={[styles.containerFill, styles.justifyCenter]}>
                <Text>
                    Loading...
                </Text>
            </View>
        );

    if(location && cameraPermission)
        return (
            <View style={styles.container}>
                <Text>{barcodeData ?? "scan the barcode"}</Text>
                <View style={{
                width: 300,
                height: 300,
                }}>
                <CameraView
                    barcodeScannerSettings={{
                    barcodeTypes: ["qr"]
                    }}
                
                    onBarcodeScanned={(data) => {
                    console.log("barcode scanned!");
                    setBarCodeData(data.data);
        
                    props.navigation.replace(routeList.pickFood);
                    }}
                    // accessing barcode on web
                    //@ts-ignore
                    barCodeScannerSettings={{
                    barCodeTypes: ["qr"],
                    }}
                    //@ts-ignore
                    onBarCodeScanned={(data) => {
                    console.log("barcode scanned!");
                    setBarCodeData(data.nativeEvent.data);
        
                    props.navigation.replace(routeList.pickFood);
                    }}
                />
                </View>
            </View>
        );
    else    
        return (
            <View style={[styles.containerFill, styles.justifyCenter]}>
                <Text>
                    Location and Camera permissions are required
                </Text>
            </View>
        );
}

export default {
    name: routeName,
    component: QrScanner,
} as PageIndex<typeof routeName>;