export const routeList = {
    QrScanner: "QrScanner",
    pickFood: "pickFood",
    foodDetail: "foodDetail",
    checkout: "checkout",
    foodWaiting: "foodWaiting",
    happyEating: "happyEating",
    qrCashPayment: "qrCashPayment",
    foodFinished: "foodFinished",
    
    // Cashier pages
    cashierhome: "cashierhome",
    cashierBarcodeScanner: "cashierBarcodeScanner",
    cashierConfirmPayment: "cashierConfirmPayment",

    // Chef pages
    chefhome: "chefhome",
    chefOrderDetail: "chefOrderDetail",
} as const;

export type RouteStackParamList = {
    [routeList.QrScanner]: undefined;
    [routeList.pickFood]: undefined;
    [routeList.foodDetail]: undefined;
    [routeList.checkout]: undefined;
    [routeList.foodWaiting]: undefined;
    [routeList.happyEating]: undefined;
    [routeList.qrCashPayment]: undefined;
    [routeList.foodFinished]: undefined;

    // Cashier pages
    [routeList.cashierhome]: undefined;
    [routeList.cashierBarcodeScanner]: undefined;
    [routeList.cashierConfirmPayment]: undefined;

    // Chef pages
    [routeList.chefhome]: undefined;
    [routeList.chefOrderDetail]: undefined;
};