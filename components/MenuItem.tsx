import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import styles from "../styles";

interface MenuItemProps {
  image: string;
  name: string;
  description?: string;
  price: string;
  style?: object;
  onAddToCart: (itemName: string) => void;
  cartQuantity: number;
  onUpdateQuantity: (itemName: string, action: "increase" | "decrease") => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  image,
  name,
  description,
  price,
  style,
  onAddToCart,
  cartQuantity,
  onUpdateQuantity,
}) => {
  return (
    <View style={[
      styles.flexHorizontal,
      styles.alignItemsCenter,
      styles.rounded3,
      styles.p3,
      styles.mb3,
      styles.shadow, 
      style,
    ]}>
      <Image source={{ uri: image }} style={[
        {
          width: 80,
          height: 80,
        },
        styles.rounded3,
      ]} />
      <View style={[
        styles.containerFill,
        styles.mx3,
        styles.justifyCenter,
      ]}>
        <Text variant="bodyMedium" style={[
          styles.fwBold,
          styles.mb2,
        ]}>{name}</Text>
        {description && <Text variant="bodySmall" style={[styles.mb3]}>{description}</Text>}
        <Text variant="bodySmall" style={[styles.fwBold]}>{price}</Text>
      </View>
      {cartQuantity > 0 ? (
        <View style={[
          styles.flexHorizontal,
          styles.alignItemsCenter,
          styles.my3,
        ]}>
          <TouchableOpacity
            style={[
              styles.p2,
              styles.rounded2,
              styles.mx2,
            ]}
            onPress={() => onUpdateQuantity(name, "decrease")}
          >
            <Text variant="bodySmall">-</Text>
          </TouchableOpacity>
          <Text variant="bodySmall">{cartQuantity}</Text>
          <TouchableOpacity
            style={[
              [
                styles.p2,
                styles.rounded2,
                styles.mx2,
              ]
            ]}
            onPress={() => onUpdateQuantity(name, "increase")}
          >
            <Text variant="bodySmall">+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.py3,
            styles.px5,
            styles.rounded2,
          ]}
          onPress={() => onAddToCart(name)}
        >
          <Text variant="bodySmall" style={[
            styles.fwBold,
          ]}>+ Add</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles2 = StyleSheet.create({
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default MenuItem;
