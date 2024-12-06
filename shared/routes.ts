export const routeList = {
    QrScanner: "QrScanner",
    pickFood: "pickFood",
} as const;

export type RouteStackParamList = {
    [routeList.QrScanner]: undefined;
    [routeList.pickFood]: undefined;
};