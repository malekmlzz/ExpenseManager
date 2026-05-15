import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { addExpense } from '../services/api';
import colors from '../constants/colors';

const AddExpenseScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!amount || !category) {
      Alert.alert('Error', 'Please enter amount and category');
      return;
    }
    setLoading(true);
    try {
      await addExpense({ amount: parseFloat(amount), category, description, date });
      Alert.alert('Success', 'Expense added');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Amount (IRR)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} />

        <Text style={styles.label}>Category</Text>
        <TextInput style={styles.input} value={category} onChangeText={setCategory} />

        <Text style={styles.label}>Description (optional)</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} />

        <Text style={styles.label}>Date</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} />

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSave} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Expense'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray },
  header: { backgroundColor: colors.primary, padding: 16, flexDirection: 'row', alignItems: 'center' },
  backText: { color: colors.white, fontSize: 16, marginRight: 16 },
  headerTitle: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  form: { padding: 16 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginTop: 12, color: colors.black },
  input: { backgroundColor: colors.white, borderRadius: 8, padding: 12, fontSize: 16, borderWidth: 1, borderColor: colors.border },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  buttonDisabled: { backgroundColor: colors.gray },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});

export default AddExpenseScreen;
