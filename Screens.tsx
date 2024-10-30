import { createNativeStackNavigator } from "@react-navigation/native-stack";
import pagesList from "pages";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { routeList, RouteStackParamList } from "@shared";

export function Screens(){
    const Stack = createNativeStackNavigator<RouteStackParamList>();
    const insets = useSafeAreaInsets();
  
    return (
      <View style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
        },
      ]}>
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
      </View>
    );
}

export default Screens;