import { StyleSheet } from 'react-native';
import { colors } from './defaultSettings';

export const sets = StyleSheet.create({
    shadow: {
        shadowColor: colors.dark,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    shadowNone: {
      shadowRadius: 0,
    }
});

export default sets;