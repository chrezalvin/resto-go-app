import React from 'react';
import { View, Image} from 'react-native';
import { Text } from 'react-native-paper';
import AddButton from './MiniComponent/AddButtonComponent'; // Impor komponen AddButton
import styles from '../styles';

interface MenuCardProps {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  cartQuantity: number;
  onAddToCart: (itemName: string) => void;
  onUpdateQuantity: (itemName: string, action: 'increase' | 'decrease') => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  title,
  description,
  price,
  imageUrl,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
}) => {
  return (

    // Masing2 item menu dalam bentuk card
    // didalam card dipisah per-view gambar, judul, deskripsi, harga
    // dan tombol add

    <View style={[
      {
        elevation: 4,
      },
      styles.flexHorizontal,
      styles.rounded3,
      styles.overflowHidden,
      styles.shadow,
      styles.bgLight,
    ]}>
      <Image source={{ uri: imageUrl }} style={[
        {
          width: 120,
          height: 150,
        },
        styles.m3,
        styles.rounded3,
      ]} />
      <View style={[
        styles.containerFill,
        styles.p3,
        styles.justifyBetween,
      ]}>

        {/* Title */}
        <View style={[
          styles.mb3,
        ]}>
          <Text variant="bodyLarge" style={[
            styles.fwBold
          ]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Description */}
        <View style={[
          styles.mb3,
        ]}>
          <Text variant="bodyMedium" style={{
            lineHeight: 18,
          }} numberOfLines={2}>
            {description}
          </Text>
        </View>

        {/* Section price & button */}
        <View style={[
          styles.flexHorizontal,
          styles.justifyBetween,
          styles.alignItemsCenter,
          styles.mt3,
        ]}>
          {/* Price */}
          <View style={[styles.justifyCenter]}>
            <Text variant="bodyMedium" style={[styles.fwBold]}>{price}</Text>
          </View>

          {/* Add Button */}
          <View style={[
            {
              maxWidth: 120,
            },
            styles.justifyCenter,
            styles.alignItemsCenter,
            styles.containerFill,
          ]}>
            <AddButton
              isInCart={cartQuantity > 0}
              onAdd={() => onAddToCart(title)}
              onIncrease={() => onUpdateQuantity(title, 'increase')}
              onDecrease={() => onUpdateQuantity(title, 'decrease')}
              quantity={cartQuantity}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MenuCard;
