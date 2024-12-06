import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { routeList, RouteStackParamList } from "./shared";
import pagesList from "./pages";

export function Screens(){
    const Stack = createNativeStackNavigator<RouteStackParamList>();
    const rnpTheme = useTheme();

    return (
      <SafeAreaView 
        mode="padding"
        edges={["bottom", "left", "right", "top"]}
        style={{
          flex: 1,
          backgroundColor: rnpTheme.colors.background,
        }}
      >
        <Stack.Navigator initialRouteName={routeList.QrScanner}>
        {
            pagesList.map((page) => 
              <Stack.Screen 
                key={page.name} 
                name={page.name} 
                component={page.component}
                options={page.headerOptions ?? {headerShown: false}} 
              />
            )
          }
        </Stack.Navigator>
      </SafeAreaView>
    ); 
  }