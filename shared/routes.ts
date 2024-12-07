export const routeList = {
    QrScanner: "QrScanner",
    pickFood: "pickFood",
    foodDetail: "foodDetail",
    checkout: "checkout",
    foodWaiting: "foodWaiting",
    happyEating: "happyEating",
    paymentVerification: "paymentVerification",
} as const;

export type RouteStackParamList = {
    [routeList.QrScanner]: undefined;
    [routeList.pickFood]: undefined;
    [routeList.foodDetail]: undefined;
    [routeList.checkout]: undefined;
    [routeList.foodWaiting]: undefined;
    [routeList.happyEating]: undefined;
    [routeList.paymentVerification]: undefined; // Add this line
};