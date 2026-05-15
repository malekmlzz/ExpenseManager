import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

const ChartCard = ({ title, data, color, formatValue }) => {
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.empty}>No data available</Text>
      </View>
    );
  }
  
  const maxValue = Math.max(...data.map(item => item.amount), 1);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {data.map((item, index) => {
        const percentage = (item.amount / maxValue) * 100;
        return (
          <View key={index} style={styles.item}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{item.category || item.person}</Text>
              <Text style={[styles.amount, { color }]}>{formatValue(item.amount)}</Text>
            </View>
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: color }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, margin: 12, padding: 16, borderRadius: 12, elevation: 1 },
  title: { fontSize: 14, fontWeight: 'bold', color: colors.primary, marginBottom: 12 },
  item: { marginBottom: 12 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontSize: 12, color: colors.gray },
  amount: { fontSize: 12, fontWeight: 'bold' },
  barContainer: { height: 24, backgroundColor: colors.lightGray, borderRadius: 6, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: 6 },
  empty: { textAlign: 'center', color: colors.gray, padding: 20 },
});

export default ChartCard;
