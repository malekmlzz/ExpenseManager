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
import { claimService } from '../services/claimService';
import colors from '../constants/colors';

const ClaimsScreen = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // فرم
  const [amount, setAmount] = useState('');
  const [person, setPerson] = useState('');
  const [description, setDescription] = useState('');
  
  // تاریخ پیش‌فرض: امروز به فرمت YYYY-MM-DD
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [dueDate, setDueDate] = useState(getToday());

  const loadClaims = async () => {
    try {
      const data = await claimService.getAll();
      setClaims(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load claims');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadClaims();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadClaims();
  };

  const handleAddClaim = async () => {
    if (!amount || !person) {
      Alert.alert('Error', 'Please enter amount and person name');
      return;
    }

    try {
      await claimService.create({
        amount: parseFloat(amount),
        person,
        description,
        due_date: dueDate,
      });
      
      // Reset form
      setAmount('');
      setPerson('');
      setDescription('');
      setDueDate(getToday());  // ریست به تاریخ امروز
      setShowForm(false);
      
      // Reload list
      loadClaims();
      Alert.alert('Success', 'Claim added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add claim');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await claimService.delete(id);
          loadClaims();
        },
      },
    ]);
  };

  const total = claims.reduce((sum, c) => sum + c.amount, 0);

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
        <Text style={styles.headerTitle}>📈 Claims</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addBtn}>{showForm ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add New Claim</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Amount (IRR)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Person (who owes you)"
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
          
          <TouchableOpacity style={styles.saveBtn} onPress={handleAddClaim}>
            <Text style={styles.saveBtnText}>Save Claim</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Claims</Text>
        <Text style={styles.totalAmount}>{total.toLocaleString()} IRR</Text>
      </View>

      {/* Claims List */}
      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {claims.length === 0 ? (
          <Text style={styles.emptyText}>No claims yet. Tap + to add</Text>
        ) : (
          claims.map((claim) => (
            <View key={claim.id} style={styles.claimCard}>
              <View style={styles.claimInfo}>
                <Text style={styles.amount}>{claim.amount.toLocaleString()} IRR</Text>
                <Text style={styles.person}>👤 {claim.person}</Text>
                {claim.description ? (
                  <Text style={styles.description}>{claim.description}</Text>
                ) : null}
                {claim.due_date ? (
                  <Text style={styles.dueDate}>📅 Due: {claim.due_date}</Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => handleDelete(claim.id)}>
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
  claimCard: { backgroundColor: colors.white, borderRadius: 10, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  claimInfo: { flex: 1 },
  amount: { fontSize: 16, fontWeight: 'bold', color: colors.black },
  person: { fontSize: 14, color: colors.primary, marginTop: 4 },
  description: { fontSize: 12, color: colors.gray, marginTop: 2 },
  dueDate: { fontSize: 10, color: colors.grayLight, marginTop: 2 },
  deleteBtn: { fontSize: 22 },
});

export default ClaimsScreen;
