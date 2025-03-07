import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import styles from "../styles";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { getCurrentPositionAsync, LocationObject, requestForegroundPermissionsAsync } from "expo-location";
import { getItem, setItem } from "../libs/AsyncStorage";
import { useState, useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, IconButton, Text } from "react-native-paper";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { authenticate, getProfile } from "../api/services/authenticate";
import colors from "../styles/defaultSettings";

const routeName = routeList.QrScanner;
type QrScannerProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

interface Location{
    latitude: number;
    longitude: number;
}

interface BarcodeDataType{
    seat_id: number;
}

function isBarcodeDataType(value: unknown): value is BarcodeDataType{
    if(typeof value !== "object" || value === null)
        return false;

    if(!("seat_id" in value) || typeof value.seat_id !== "number")
        return false;

    return true;
}

export function QrScanner(props: QrScannerProps){
    const [location, setLocation] = useState<Location | null>(null);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [isCameraPermitted, setCameraPermission] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function checkIfUserIsAuthenticated(): Promise<boolean>{
        try{
            console.log("checking if user is authenticated");
            const customer_id = await getItem("customer_id");
            
            if(customer_id !== null){
                console.log("customer_id found in the storage, getting profile");
                const profile = await getProfile();
                console.log(`obtained profile: ${JSON.stringify(profile)}`);    
    
                if(profile){
                    console.log("user is already authenticated");
                    console.log(`customer_id: ${customer_id}`);
    
                    if(profile.transaction)
                        props.navigation.replace(routeList.foodWaiting);
                    else
                        props.navigation.replace(routeList.pickFood);
        
                    return true;
                }
                else
                    await setItem("customer_id", null);
            }

            return false;
        }
        catch(e){
            console.log(`error: ${e}`);
            await setItem("customer_id", null);

            return false;
        }
    }

    async function onBarcodeScanned(data: BarcodeScanningResult){
        console.log("barcode scanned!");
        setIsLoading(true);
        setError(null);

        try{
            const barcodeData = JSON.parse(data.data);
   
            if(!isBarcodeDataType(barcodeData))
                throw new Error("Invalid barcode data");

            console.log(barcodeData);

            // get location
            const loc = await getLocation();

            if(!loc)
                throw new Error("Please enable location permission to continue");

            const userData = await authenticate(barcodeData.seat_id, loc.coords.longitude, loc.coords.latitude);

            if(userData){
                console.log("setting up user data to the storage");
                console.log(`user data: ${userData.customer_id}`);
                await setItem("customer_id", userData.customer_id);
            }

            props.navigation.replace(routeList.pickFood);
        }
        catch(e){
            setError("Gagal mengakses data atau lokasi tidak valid");
        }
        finally{
            setIsLoading(false);
        }
    }

    async function getLocation(): Promise<LocationObject | undefined>{
        console.log("getting location");

        const status = await requestForegroundPermissionsAsync();

        if(status.granted){
            console.log("permission granted");
            
            const position = await getCurrentPositionAsync({});

            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });

            return position;

            // console.log(position);

            // setLocation({
            //     latitude: position.coords.latitude,
            //     longitude: position.coords.longitude,
            // });

            // console.log("location", location);
        }
    }

    async function requestCamera(){
        const status = await requestCameraPermission();

        if(status.granted)
            setCameraPermission(true);
    }

    useEffect(() => {
        if(error)
            impactAsync(ImpactFeedbackStyle.Light);
    }, [error]);

    // checks both permissions
    useEffect(() => {
        async function checkPermissions(){

            const isUserAuthenticated = await checkIfUserIsAuthenticated();

            if(!isUserAuthenticated){
                console.log("user is not authenticated");

                await getLocation();
                await requestCamera();
            }
        }

        checkPermissions();
    }, []);

    if(location && isCameraPermitted)
        return (
            <View style={[
                styles.container,
                styles.gap3,
            ]}>
                <Text
                    variant="headlineMedium"
                    style={
                    [
                        {
                            fontFamily: "Poppins"
                        },
                        styles.textLight,
                        styles.fwBold   
                    ]}
                >Scan the barcode</Text>
                <View style={{
                    width: "60%",
                    aspectRatio: 1,
                }}>
                    {
                        isLoading ? (
                            <View 
                                style={[
                                    styles.containerFill,
                                    styles.bgDark,
                                ]}
                            />
                        ) : (
                            <CameraView
                                style={[
                                    styles.containerFill,
                                    styles.rounded4
                                ]}
                                barcodeScannerSettings={{
                                    barcodeTypes: ["qr"]
                                }}
                            
                                onBarcodeScanned={onBarcodeScanned}
                                // accessing barcode on web
                                //@ts-ignore
                                barCodeScannerSettings={{
                                    barCodeTypes: ["qr"],
                                }}
                                //@ts-ignore
                                onBarCodeScanned={onBarcodeScanned}
                            />
                        )
                    }
                </View>

                <Text style={[styles.textWarning, styles.fwBold]} variant="labelLarge">
                    {error ?? ""}
                </Text>

                <View style={[
                    styles.absolute,
                    styles.top0,
                    styles.right0,
                    styles.m2,
                ]}>
                    <IconButton
                        icon="history"
                        iconColor="white"
                        size={30}
                        onPress={() => props.navigation.navigate(routeList.transactionHistory)}
                    />
                </View>

                {
                    isLoading && (
                        <View style={[
                            styles.absolute,
                            styles.top0,
                            styles.left0,
                            styles.right0,
                            styles.bottom0,
                        ]}>
                            <View 
                                style={[
                                    {
                                        opacity: 0.5
                                    },
                                    styles.absolute,
                                    styles.top0,
                                    styles.left0,
                                    styles.right0,
                                    styles.bottom0,
                                    styles.bgMuted,
                                ]}
                            />
                            <View style={[
                                styles.flexHorizontal,
                                styles.justifyCenter,
                                styles.alignItemsCenter,
                                styles.containerFill,
                                styles.gap3,
                            ]}>
                                <View style={[
                                    {
                                        width: 100,
                                        height: 100,
                                        elevation: 10,
                                    },
                                    styles.bgLight,
                                    styles.justifyCenter,
                                    styles.alignItemsCenter,
                                ]}>
                                    <ActivityIndicator size={50} />
                                </View>
                            </View>
                        </View>
                    )
                }
            </View>
        );
    else    
        return (
            <View style={[
                styles.containerFill, 
                styles.justifyCenter, 
                styles.gap3
            ]}>
                <Text style={[
                    styles.textCenter
                ]}>
                    Please enable location and camera permission to continue
                </Text>

                <View style={[
                    styles.flexHorizontal,
                    styles.justifyCenter,
                    styles.gap3
                ]}>
                {
                    location ? (
                        <Button
                            mode="contained"
                            buttonColor={colors.success}
                        >
                            Location Permission Granted
                        </Button>
                    ) : (
                        <Button 
                            mode="contained"
                            onPress={getLocation}
                        >
                            Enable Location Permission
                        </Button>
                    )
                }

                {
                    isCameraPermitted ? (
                        <Button
                            buttonColor={colors.success}
                            mode="contained"
                        >
                            Camera Permission Granted
                        </Button>
                    ) : (
                        <Button 
                            mode="contained"
                            onPress={requestCameraPermission}
                        >
                            Enable Camera Permission
                        </Button>
                    )
                }
                </View>
            </View>
        );
}

export default {
    name: routeName,
    component: QrScanner,
} as PageIndex<typeof routeName>;