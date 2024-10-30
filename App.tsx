import { CombinedDarkTheme, CombinedDefaultTheme } from 'themeConfig';
import { store, useAppDispatch, useAppSelector } from '@redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from 'react-redux';
import Screens from 'Screens';
import { useEffect } from 'react';
import { getItem, populateAsyncStorage } from 'libs/AsyncStorage';

export function AppProvider(){
  const dispatch = useAppDispatch();
  const isDarkTheme = useAppSelector(state => state.isDark.isDark);
  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme;

  useEffect(() => {
    async function initialization(){
      await populateAsyncStorage();
    }
  });

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer 
          theme={theme} 
          documentTitle={{
            formatter: () => "All You Can Shop",
          }}
        >
          <Screens />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function ReduxWrapper(){
  return (
    <Provider store={store}>
      <AppProvider />
    </Provider>
  );
}