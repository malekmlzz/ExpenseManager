import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { expenseService } from '../services/expenseService';
import { formatCurrency, formatDate } from '../utils/helpers';
import colors from '../constants/colors';

const HomeScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadExpenses = async () => {
    try {
      const data = await expenseService.getAll();
      setExpenses(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load expenses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadExpenses();
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await expenseService.delete(id);
          loadExpenses();
        },
      },
    ]);
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💰 Expense Manager</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddExpense')}>
          <Text style={styles.addBtn}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Expenses</Text>
        <Text style={styles.totalAmount}>{formatCurrency(total)} IRR</Text>
      </View>

      {/* Expenses List */}
      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {expenses.length === 0 ? (
          <Text style={styles.emptyText}>No expenses yet. Tap + to add</Text>
        ) : (
          expenses.map((expense) => (
            <View key={expense.id} style={styles.expenseCard}>
              <View>
                <Text style={styles.amount}>{formatCurrency(expense.amount)} IRR</Text>
                <Text style={styles.category}>{expense.category}</Text>
                <Text style={styles.date}>📅 {expense.date}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(expense.id)}>
                <Text style={styles.deleteBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  addBtn: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  totalCard: {
    backgroundColor: colors.surface,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 8,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray,
    marginTop: 40,
  },
  expenseCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  category: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },
  date: {
    fontSize: 10,
    color: colors.grayLight,
    marginTop: 2,
  },
  deleteBtn: {
    fontSize: 22,
  },
});

export default HomeScreen;
