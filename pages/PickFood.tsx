import { PageIndex } from "../libs";
import { NativeStackHeaderProps, NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Text } from "react-native-paper";
import MenuCard from '../components/MenuCard';
import CheckoutButton from '../components/MiniComponent/CheckoutButtonComponent'; // Komponen untuk tombol checkout
import { useEffect, useRef, useState } from "react";
import styles from "../styles";
import { setItem } from "../libs/AsyncStorage";
import { getFoodList } from "../api/services/getFood";
import { getProfile, logout } from "../api/services/authenticate";
import { Food } from "../api/models";
import BackButton from "../components/BackButton";
import { addCartItem, clearCart, removeCartItem, useAppDispatch, useAppSelector } from "../state";

const routeName = routeList.pickFood;
type PickFoodProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

const categories = [
    { id: '1', name: 'food', icon: require('../assets/images/Burgers_and_salad.png') }, // Path sesuai dengan ikon Anda
    { id: '2', name: 'drink', icon: require('../assets/images/Drink.png') },
    { id: '3', name: 'other', icon: require('../assets/images/Donuts.png') },
];

export function PickFood(props: PickFoodProps){
    const dispatch = useAppDispatch();
    const cart = useAppSelector(state => state.cart.cart);
    const totalItems = useAppSelector(state => state.cart.countItems);

    const [selectedCategory, setSelectedCategory] = useState('Food');

    const [foodItems, setFoodItems] = useState<Food[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scrollViewRef = useRef<ScrollView>(null);
    const foodRef = useRef<View>(null);
    const drinkRef = useRef<View>(null);
    const otherRef = useRef<View>(null);

    async function loadMenu(){
        dispatch(clearCart());
        setIsLoading(true);
        setError(null);

        try{
            const foodList = await getFoodList();

            setFoodItems(foodList);
        }
        catch(e){
            console.log(e);

            await setItem("customer_id", null);
            props.navigation.replace(routeList.QrScanner);

            setError("Failed to load menu data");
        }
        finally{
            setIsLoading(false);
        }
    }

    const scrollToSection = (section: Food["category"]) => {
      let ref: typeof drinkRef;
      switch(section){
        case "drink": ref = drinkRef; break;
        case "food": ref = foodRef; break;
        case "other": ref = otherRef; break;
        default: ref = foodRef;
      };

      if(ref.current && scrollViewRef.current){
        ref.current.measureLayout(
          // casting because it's not an error somehow
          (scrollViewRef.current as unknown) as number,
          (x, y) => {
            scrollViewRef.current?.scrollTo({y, animated: true});
          },
          () => {
            console.log("error while attempting to scroll");
          }
        )
      }
    }
  
    useEffect(() => {
        loadMenu();
    }, []);

    {/* Filterya */}
    const foodMenu = foodItems.filter(item => item.category === 'food');
    const drinkMenu = foodItems.filter(item => item.category === 'drink');
    const otherMenu = foodItems.filter(item => item.category === 'other');

    const menuDisplayUI = (foodList: Food[]) => {
      return foodList.map((food) => (
        <MenuCard
          key={food.food_id}
          title={food.food_name}
          description={food.food_desc}
          price={`Rp. ${food.price.toLocaleString()}`}
          imageUrl={food.img_path ?? ""}
          cartQuantity={cart[food.food_id] ?? 0}
          onAddToCart={() => dispatch(addCartItem(food.food_id))}
          onUpdateQuantity={(_, action) => dispatch(action === "increase" ? addCartItem(food.food_id) : removeCartItem(food.food_id))}
      />
      ));
    }
  
    return (
      <View style={[styles.containerFill]}>
        {/* Bagian Filter Category, terdiri dari 3 category */}
        {/* Food, Drinck, Side */}
        {/* Masing2 category, menampilkan hidangannya */}
        <View style={[
            styles.py4,
            styles.alignItemsCenter
        ]}>
            <Text 
                variant="headlineMedium" 
                style={[
                    styles.fwBold, 
                    styles.textLight, 
                    styles.mb3
                ]}
            >Menu</Text>
            <View style={[
                styles.flexHorizontal,
                styles.gap4,
            ]}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                    styles.alignItemsCenter,
                    styles.p3,
                    selectedCategory === category.name ? styles.bgDanger : styles.bgWarning,
                    styles.rounded3,
                ]}
                onPress={() => scrollToSection(category.name as Food["category"])}
              >
                <Image source={category.icon} style={[
                    {
                        width: 40,
                        height: 40,
                    },
                    styles.mb2,
                ]} />
                <Text
                    variant="bodyMedium"
                    style={[
                        styles.fwBold,
                        selectedCategory === category.name ? styles.textLight : styles.textDark,
                    ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
  
        <ScrollView 
          refreshControl={
            <RefreshControl 
              refreshing={isLoading} 
              onRefresh={loadMenu}
            />
          }
          ref={scrollViewRef}
          style={[
            styles.containerFill,
            styles.px4,
            styles.mt2,
          ]}>
          {/* Bagian ini mengambil 2 rekomendasi makanan sesuai filter yang sudah di setting */}

          <View style={[
            styles.gap3,
          ]}>
            <Text variant="titleMedium" style={[
              styles.textLight,
              styles.fwBold
            ]}>Recommended</Text>
            {
              isLoading ? 
                <ActivityIndicator style={{width: 30, height: 30}} /> 
                : 
                menuDisplayUI(foodMenu.slice(0, 2))
            }
          </View>
  
          {/* Bagian ini dibawah rekomendasi makanan, diluar filter */}
          <View 
            ref={foodRef}
            style={[
              styles.gap3,
              styles.my2,
            ]}
          >
            <Text 
              variant="titleMedium" 
              style={[
                styles.textLight,
                styles.fwBold,
              ]}
            >Food Menu</Text>
            {
              isLoading ? 
                <ActivityIndicator style={{width: 30, height: 30}} /> 
                : 
                menuDisplayUI(foodMenu)
            }
          </View>

          <View 
            ref={drinkRef}
            style={[
              styles.gap3,
              styles.my2,
            ]}
          >
            <Text 
              variant="titleMedium" 
              style={[
                styles.textLight,
                styles.fwBold,
              ]}
            >Drinks</Text>
            {
              isLoading ? 
                <ActivityIndicator style={{width: 30, height: 30}} /> 
                : 
                menuDisplayUI(drinkMenu)
            }
          </View>

          <View 
            ref={otherRef}
            style={[
              styles.gap3,
              styles.my2,
            ]}
          >
            <Text 
              variant="titleMedium" 
              style={[
                styles.textLight,
                styles.fwBold,
                styles.my2,
              ]}
            >Others</Text>
            {
              menuDisplayUI(otherMenu)
            }
          </View>
        </ScrollView>
  
        <CheckoutButton 
          totalItems={totalItems} 
          onCheckout={() => {props.navigation.navigate(routeList.checkout)}}
        />
      </View>
    );
}

function Header(props: NativeStackHeaderProps){
    const [address, setAddress] = useState<string | null>();
    const [tableNumber, setTableNumber] = useState<number | null>();
    const [branchName, setBranchName] = useState<string | null>();
    const [isLoading, setIsLoading] = useState(false);

    async function loadProfile(){
        setIsLoading(true);

        try{
          const profile = await getProfile();
          console.log(profile);

          if(profile){
            setAddress(profile.branch.address);
            setTableNumber(profile.seat.seat_no);
            setBranchName(profile.branch.branch_name);
          }
        }
        catch(e){
          console.log(e);
        }
        finally{
          setIsLoading(false);
        }
    }

    useEffect(() => {
      loadProfile();
    }, [])

    return (
        <View style={[
            styles.flexHorizontal,
            styles.gap3,
            styles.alignItemsCenter,
            styles.mx3,
        ]}>
            <BackButton 
              onBack={() => {
                Alert.alert(
                  "Logout?",
                  "Are you sure you want to logout?\nAll your cart items will be removed",
                  [
                    {
                      text: "Logout",
                      onPress: async () => {
                        await logout();
                        await setItem("customer_id", null);
                        props.navigation.replace(routeList.QrScanner);
                      },
                    },
                    {
                      text: "Cancel",
                      style: "cancel",
                    }
                  ]
                );
              }}
            />
            <View
              style={[
                styles.mr3
              ]}
            >
              <Text
                variant="bodyMedium"
                style={[
                  styles.textLight,
                  styles.fwBold,
                ]}
              >Seat No. {tableNumber} | {branchName} | {address}</Text>
            </View>
        </View>    
    );
}

export default {
    name: routeName,
    component: PickFood,
    headerOptions: {
        header: Header
    }
} as PageIndex<typeof routeName>;