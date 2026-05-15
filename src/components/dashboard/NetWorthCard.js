import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const NetWorthCard = ({ value }) => {
  const isPositive = value >= 0;
  
  return (
    <View style={[styles.card, { backgroundColor: isPositive ? colors.success : colors.danger }]}>
      <Text style={styles.label}>💰 Net Worth</Text>
      <Text style={styles.value}>{isPositive ? '+' : ''}{value.toLocaleString()} IRR</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { margin: 12, padding: 20, borderRadius: 12, alignItems: 'center', elevation: 4 },
  label: { fontSize: 16, color: colors.white, marginBottom: 8 },
  value: { fontSize: 28, fontWeight: 'bold', color: colors.white },
});

export default NetWorthCard;
