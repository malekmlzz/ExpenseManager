import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const StatsCard = ({ value, label, color }) => {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.value}>{value.toLocaleString()} IRR</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1, margin: 4, padding: 12, borderRadius: 10, alignItems: 'center' },
  value: { fontSize: 14, fontWeight: 'bold', color: colors.white },
  label: { fontSize: 12, color: colors.white, marginTop: 4 },
});

export default StatsCard;
