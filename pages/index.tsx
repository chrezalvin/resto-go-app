import { PageIndex } from "../libs";
import PickFood from "./PickFood";
import QrScanner from "./QrScanner";
import FoodWaiting from "./FoodWaiting";
import Checkout from "./Checkout";
import foodDetail from "./FoodDetail";
import HappyEating from "./HappyEating";
import qrCashPayment from "./QrCashPayment";

export const pagesList: PageIndex<any>[] = [
    PickFood,
    QrScanner,
    FoodWaiting,
    Checkout,
    foodDetail,
    HappyEating,
    qrCashPayment,
];

export default pagesList;