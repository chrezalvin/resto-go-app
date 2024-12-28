import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

interface CheckoutButtonProps {
  totalItems: number;
  onCheckout?: () => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ totalItems, onCheckout }) => {
  if (totalItems === 0) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
        <Text style={styles.checkoutButtonText}>
          Checkout ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  checkoutButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#ff3333',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CheckoutButton;
