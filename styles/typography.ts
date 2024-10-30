import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: colorChoice.light,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexHorizontal: {
        flexDirection: 'row',
    },
    flexVertical: {
        flexDirection: 'column',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    justifyEnd: {
        justifyContent: 'flex-end',
    },
    justifyBetween: {
        justifyContent: 'space-between',
    },
    justifyAround: {
        justifyContent: 'space-around',
    },
    justifyEvenly: {
        justifyContent: 'space-evenly',
    },
    alignItemsCenter: {
        alignItems: 'center',
    },
    alignItemsEnd: {
        alignItems: 'flex-end',
    },
    alignItemsStretch: {
        alignItems: 'stretch',
    },
    alignItemsBaseline: {
        alignItems: 'baseline',
    },
    w100: {
        width: '100%',
    },
    h100: {
        height: '100%',
    },
    rounded0: {
        borderRadius: 0,
    },
    rounded1: {
        borderRadius: 2,
    },
    rounded2: {
        borderRadius: 4,
    },
    rounded3: {
        borderRadius: 8,
    },
    rounded4: {
        borderRadius: 16,
    },
    roundedCircle: {
        borderRadius: 9999,
    },
    overflowHidden: {
        overflow: 'hidden',
    },
    overflowVisible: {
        overflow: 'visible',
    },
    overflowScroll: {
        overflow: "scroll",
    },
    containerFill: {
        flex: 1,
    },
    absolute: {
        position: 'absolute',
    },
    relative: {
        position: 'relative',
    },
    static: {
        position: "static"
    },
    bottom0: {
        bottom: 0,
    },
    top0: {
        top: 0,
    },
    left0: {
        left: 0,
    },
    right0: {
        right: 0,
    },
});

export default typography;