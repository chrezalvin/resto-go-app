import { PageIndex } from "../libs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { routeList, RouteStackParamList } from "../shared";
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from "react-native-paper";
import MenuCard from '../components/MenuCard';
import CheckoutButton from '../components/MiniComponent/CheckoutButtonComponent'; // Komponen untuk tombol checkout
import { useEffect, useRef, useState } from "react";
import styles from "../styles";
import { setItem } from "../libs/AsyncStorage";
import { getFoodList } from "../api/services/getFood";
import { getProfile } from "../api/services/authenticate";
import { Food } from "../api/models";

const routeName = routeList.pickFood;
type PickFoodProps = NativeStackScreenProps<RouteStackParamList, typeof routeName>;

const categories = [
    { id: '1', name: 'food', icon: require('../assets/images/Burgers_and_salad.png') }, // Path sesuai dengan ikon Anda
    { id: '2', name: 'drink', icon: require('../assets/images/Drink.png') },
    { id: '3', name: 'other', icon: require('../assets/images/Donuts.png') },
];

export function PickFood(props: PickFoodProps){
    const [selectedCategory, setSelectedCategory] = useState('Food');

    const [foodItems, setFoodItems] = useState<Food[]>([]);
    const [cart2, setCart2] = useState<{[key: number]: number}>({});

    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scrollViewRef = useRef<ScrollView>(null);
    const foodRef = useRef<View>(null);
    const drinkRef = useRef<View>(null);
    const otherRef = useRef<View>(null);

    async function loadMenu(){
        setCart2({});
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

      const a = scrollViewRef.current!;

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

    const handleUpdateQuantity2 = (id: number, action: "increase" | "decrease") => {
      const newCart = {...cart2};

      if(action === "increase"){
        setTotalItems(totalItems + 1);
        newCart[id] = (newCart[id] ?? 0) + 1;
      }
      else{
        setTotalItems(totalItems - 1);
        if(newCart[id] === 1)
          delete newCart[id];
        else
          newCart[id] -= 1;
      }

      setCart2(newCart);
    }

    const menuDisplayUI = (foodList: Food[]) => {
      return foodList.map((food) => (
        <MenuCard
          key={food.food_id}
          title={food.food_name}
          description={food.food_desc}
          price={`Rp. ${food.price.toLocaleString()}`}
          imageUrl={food.img_path ?? ""}
          cartQuantity={cart2[food.food_id] ?? 0}
          onAddToCart={() => handleUpdateQuantity2(food.food_id, "increase")}
          onUpdateQuantity={(_, action) => handleUpdateQuantity2(food.food_id, action)}
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
              onRefresh={() => loadMenu()}
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

function Header(){
    const [address, setAddress] = useState<string | null>();
    const [tableNumber, setTableNumber] = useState<string | null>();
    const [isLoading, setIsLoading] = useState(false);

    async function loadProfile(){
        setIsLoading(true);

        try{
          const profile = await getProfile();
          // setAddress(profile.);
          // setTableNumber(profile.table_number);
        }
        catch(e){
          console.log(e);
        }
        finally{
          setIsLoading(false);
        }
    }

    useEffect(() => {
        getProfile();
    }, [])

    return (
        <View style={[
            {
                height: 30, 
            },
            styles.flexHorizontal,
            styles.gap3,
        ]}>
            <Text>Back</Text>
            <Text>Pick Food</Text>
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