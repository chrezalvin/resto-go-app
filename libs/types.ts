import { RouteStackParamList } from "@shared";
import {NativeStackNavigationOptions, NativeStackScreenProps } from "@react-navigation/native-stack";


export interface PageIndex<_T extends keyof RouteStackParamList> {
    name: _T;
    component: ((props: NativeStackScreenProps<RouteStackParamList, _T>) => JSX.Element) | (() => JSX.Element);
    headerOptions?: NativeStackNavigationOptions;
}