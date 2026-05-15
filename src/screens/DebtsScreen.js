import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { debtService } from '../services/debtService';
import colors from '../constants/colors';

const DebtsScreen = () => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // فرم
  const [amount, setAmount] = useState('');
  const [person, setPerson] = useState('');
  const [description, setDescription] = useState('');
  
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [dueDate, setDueDate] = useState(getToday());

  const loadDebts = async () => {
    try {
      const data = await debtService.getAll();
      setDebts(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load debts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDebts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDebts();
  };

  const handleAddDebt = async () => {
    if (!amount || !person) {
      Alert.alert('Error', 'Please enter amount and person name');
      return;
    }

    try {
      await debtService.create({
        amount: parseFloat(amount),
        person,
        description,
        due_date: dueDate,
      });
      
      setAmount('');
      setPerson('');
      setDescription('');
      setDueDate(getToday());
      setShowForm(false);
      
      loadDebts();
      Alert.alert('Success', 'Debt added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add debt');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await debtService.delete(id);
          loadDebts();
        },
      },
    ]);
  };

  const total = debts.reduce((sum, d) => sum + d.amount, 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📉 Debts</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addBtn}>{showForm ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add New Debt</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Amount (IRR)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Person (you owe to)"
            value={person}
            onChangeText={setPerson}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Due date (YYYY-MM-DD)"
            value={dueDate}
            onChangeText={setDueDate}
          />
          
          <TouchableOpacity style={styles.saveBtn} onPress={handleAddDebt}>
            <Text style={styles.saveBtnText}>Save Debt</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Debts</Text>
        <Text style={styles.totalAmount}>{total.toLocaleString()} IRR</Text>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {debts.length === 0 ? (
          <Text style={styles.emptyText}>No debts yet. Tap + to add</Text>
        ) : (
          debts.map((debt) => (
            <View key={debt.id} style={styles.debtCard}>
              <View style={styles.debtInfo}>
                <Text style={styles.amount}>{debt.amount.toLocaleString()} IRR</Text>
                <Text style={styles.person}>👤 {debt.person}</Text>
                {debt.description ? (
                  <Text style={styles.description}>{debt.description}</Text>
                ) : null}
                {debt.due_date ? (
                  <Text style={styles.dueDate}>📅 Due: {debt.due_date}</Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => handleDelete(debt.id)}>
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
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: colors.primary, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: 'bold' },
  addBtn: { color: colors.white, fontSize: 28, fontWeight: 'bold' },
  formCard: { backgroundColor: colors.white, margin: 16, padding: 16, borderRadius: 12, elevation: 2 },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  saveBtn: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  totalCard: { backgroundColor: colors.white, margin: 16, padding: 20, borderRadius: 12, alignItems: 'center', elevation: 2 },
  totalLabel: { fontSize: 14, color: colors.gray },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: colors.primary, marginTop: 8 },
  list: { flex: 1, paddingHorizontal: 16 },
  emptyText: { textAlign: 'center', color: colors.gray, marginTop: 40 },
  debtCard: { backgroundColor: colors.white, borderRadius: 10, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  debtInfo: { flex: 1 },
  amount: { fontSize: 16, fontWeight: 'bold', color: colors.black },
  person: { fontSize: 14, color: colors.primary, marginTop: 4 },
  description: { fontSize: 12, color: colors.gray, marginTop: 2 },
  dueDate: { fontSize: 10, color: colors.grayLight, marginTop: 2 },
  deleteBtn: { fontSize: 22 },
});

export default DebtsScreen;
