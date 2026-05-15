import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useDashboardData } from '../hooks/useDashboardData';
import IncomeCard from '../components/dashboard/IncomeCard';
import StatsCard from '../components/dashboard/StatsCard';
import NetWorthCard from '../components/dashboard/NetWorthCard';
import ChartCard from '../components/dashboard/ChartCard';
import colors from '../constants/colors';

const DashboardScreen = () => {
  const { data, formState, handlers } = useDashboardData();
  
  if (data.loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={data.refreshing} onRefresh={handlers.onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Dashboard</Text>
      </View>

      <IncomeCard
        title="Monthly Income"
        value={data.monthly}
        icon="💰"
        showForm={formState.showMonthly}
        tempAmount={formState.tempAmount}
        onToggle={() => handlers.toggleForm('showMonthly')}
        onSave={handlers.handleSaveIncome}
        onAmountChange={handlers.setTempAmount}
        incomeType="monthly"
      />

      <IncomeCard
        title="Fixed Income"
        value={data.fixed}
        icon="🏦"
        showForm={formState.showFixed}
        tempAmount={formState.tempAmount}
        onToggle={() => handlers.toggleForm('showFixed')}
        onSave={handlers.handleSaveIncome}
        onAmountChange={handlers.setTempAmount}
        incomeType="fixed"
      />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>💰 Total Income</Text>
        <Text style={styles.summaryValue}>{data.totalIncome.toLocaleString()} IRR</Text>
      </View>

      <View style={styles.statsRow}>
        <StatsCard value={data.totalExpenses} label="Expenses" color={colors.danger} />
        <StatsCard value={data.totalClaims} label="Claims" color={colors.success} />
        <StatsCard value={data.totalDebts} label="Debts" color={colors.warning} />
      </View>

      <NetWorthCard value={data.netWorth} />

      <ChartCard
        title="📉 Recent Expenses"
        data={data.recentExpenses}
        color={colors.danger}
        formatValue={(v) => `- ${v.toLocaleString()} IRR`}
      />

      <ChartCard
        title="📈 Recent Claims"
        data={data.recentClaims}
        color={colors.success}
        formatValue={(v) => `+ ${v.toLocaleString()} IRR`}
      />

      <ChartCard
        title="📊 Recent Debts"
        data={data.recentDebts}
        color={colors.warning}
        formatValue={(v) => `- ${v.toLocaleString()} IRR`}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: colors.primary, padding: 16, alignItems: 'center' },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: 'bold' },
  summaryCard: { backgroundColor: colors.success, margin: 12, padding: 16, borderRadius: 12, alignItems: 'center' },
  summaryLabel: { fontSize: 14, color: colors.white, marginBottom: 8 },
  summaryValue: { fontSize: 24, fontWeight: 'bold', color: colors.white },
  statsRow: { flexDirection: 'row', paddingHorizontal: 8, marginTop: 8 },
});

export default DashboardScreen;
