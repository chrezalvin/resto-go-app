export const routeList = {
    QrScanner: "QrScanner",
    pickFood: "pickFood",
    foodDetail: "foodDetail",
    checkout: "checkout",
    foodWaiting: "foodWaiting",
    happyEating: "happyEating",
    qrCashPayment: "qrCashPayment",
    foodFinished: "foodFinished",
    transactionHistory: "transactionHistory",
    transactionView: "transactionView",
    
    // Cashier pages
    cashierhome: "cashierhome",
    cashierBarcodeScanner: "cashierBarcodeScanner",
    cashierConfirmPayment: "cashierConfirmPayment",

    // Chef pages
    chefhome: "chefhome",
    chefOrderDetail: "chefOrderDetail",
} as const;

export type RouteStackParamList = {
    // Customer Pages
    [routeList.QrScanner]: undefined;
    [routeList.pickFood]: undefined;
    [routeList.foodDetail]: undefined;
    [routeList.checkout]: undefined;
    [routeList.foodWaiting]: undefined;
    [routeList.happyEating]: undefined;
    [routeList.qrCashPayment]: undefined;
    [routeList.foodFinished]: undefined;
    [routeList.transactionHistory]: undefined;
    [routeList.transactionView]: {
        transaction_id: number;
    };

    // Cashier pages
    [routeList.cashierhome]: undefined;
    [routeList.cashierBarcodeScanner]: undefined;
    [routeList.cashierConfirmPayment]: undefined;

    // Chef pages
    [routeList.chefhome]: undefined;
    [routeList.chefOrderDetail]: undefined;
};