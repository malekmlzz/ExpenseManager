import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';

const IncomeCard = ({ title, value, icon, showForm, tempAmount, onToggle, onSave, onAmountChange, incomeType }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onToggle}>
          <Text style={styles.editBtn}>{showForm ? '✕' : '✎'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.value}>{value.toLocaleString()} IRR</Text>
      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={tempAmount}
            onChangeText={onAmountChange}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={() => onSave(incomeType)}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, margin: 12, padding: 16, borderRadius: 12, elevation: 2 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  icon: { fontSize: 24, marginRight: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: colors.gray, flex: 1 },
  editBtn: { fontSize: 18, color: colors.primary, fontWeight: 'bold' },
  value: { fontSize: 20, fontWeight: 'bold', color: colors.primary, textAlign: 'center' },
  form: { marginTop: 12, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  saveBtn: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: colors.white, fontSize: 14, fontWeight: 'bold' },
});

export default IncomeCard;
