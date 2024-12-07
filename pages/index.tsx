import { PageIndex } from "../libs";
import PickFood from "./PickFood";
import QrScanner from "./QrScanner";
import FoodWaiting from "./FoodWaiting";
import Checkout from "./Checkout";
import foodDetail from "./FoodDetail";
import HappyEating from "./HappyEating";

export const pagesList: PageIndex<any>[] = [
    PickFood,
    QrScanner,
    FoodWaiting,
    Checkout,
    foodDetail,
    HappyEating,
];

export default pagesList;