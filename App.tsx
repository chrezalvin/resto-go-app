import { PaperProvider, Text } from 'react-native-paper';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CombinedDarkTheme, CombinedDefaultTheme, customFonts } from './themeConfig';
import { Screens } from './Screens';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { populateAsyncStorage, setItem } from './libs/AsyncStorage';
import { useEffect } from 'react';
import { store, useAppDispatch, useAppSelector } from './state';
import { Provider } from 'react-redux';

function App() {
  const dispatch = useAppDispatch();
  const isDarkTheme = useAppSelector(state => state.isDark.isDark);
  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme;
  const [fontsLoaded] = useFonts({
    "poppins-thin": require("./assets/fonts/Poppins_100Thin.ttf"),
    "poppins-extra-light": require("./assets/fonts/Poppins_200ExtraLight.ttf"),
    "poppins-light": require("./assets/fonts/Poppins_300Light.ttf"),
    "poppins-regular": require("./assets/fonts/Poppins_400Regular.ttf"),
    "poppins-medium": require("./assets/fonts/Poppins_500Medium.ttf"),
    "poppins-semi-bold": require("./assets/fonts/Poppins_600SemiBold.ttf"),
    "poppins-bold": require("./assets/fonts/Poppins_700Bold.ttf"),
    "poppins-extra-bold": require("./assets/fonts/Poppins_800ExtraBold.ttf"),
    "poppins-black": require("./assets/fonts/Poppins_900Black.ttf"),
  });

  useEffect(() => {
    async function initialization(){
      await populateAsyncStorage();
    }

    initialization();
  });

  if(!fontsLoaded)
    return <Text>Loading...</Text>;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme as any}>
        <NavigationContainer
          theme={{
            ...theme,
            fonts: customFonts
          }}
          documentTitle={{
            formatter: () => "All You Can Shop"
          }}
        >
          <StatusBar />
          <Screens />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function ReduxWrapper(){
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}