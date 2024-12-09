import { PageIndex } from "../libs";
import PickFood from "./PickFood";
import QrScanner from "./QrScanner";
import FoodWaiting from "./FoodWaiting";
import Checkout from "./Checkout";
import foodDetail from "./FoodDetail";
import HappyEating from "./HappyEating";
import qrCashPayment from "./QrCashPayment";
import FoodFinished from "./FoodFinished";

import CashierHome from "./CashierHome";
import CashierBarcodeScanner from "./CashierBarcodeScanner";
import CashierConfirmPayment from "./CashierConfirmPayment";

export const pagesList: PageIndex<any>[] = [
    PickFood,
    QrScanner,
    FoodWaiting,
    Checkout,
    foodDetail,
    HappyEating,
    qrCashPayment,
    FoodFinished,

    CashierHome,
    CashierBarcodeScanner,
    CashierConfirmPayment,
];

export default pagesList;