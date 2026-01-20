import { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

interface DashboardData {
  totalStock: number;
  totalSales: number;
  totalRevenue: number;
  topBrand: string;
}

export default function HomeScreen() {
  const [data, setData] = useState<DashboardData>({ totalStock: 0, totalSales: 0, totalRevenue: 0, topBrand: '-' });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Fetch stock total
    const { data: stocks } = await supabase.from('stocks').select('envanter');
    const totalStock = stocks?.reduce((acc, item) => acc + (parseInt(item.envanter) || 0), 0) || 0;

    // Fetch sales total
    const { data: sales } = await supabase.from('sales').select('satis_miktari, marka');
    const totalSales = sales?.reduce((acc, item) => acc + (item.satis_miktari || 0), 0) || 0;

    // Find top brand
    const brandCounts: Record<string, number> = {};
    sales?.forEach(sale => {
      if (sale.marka) {
        brandCounts[sale.marka] = (brandCounts[sale.marka] || 0) + (sale.satis_miktari || 0);
      }
    });
    const topBrand = Object.entries(brandCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    setData({ totalStock, totalSales, totalRevenue: 0, topBrand });
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="p-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
      >
        {/* Header */}
        <View className="mb-6 mt-4">
          <Text className="text-3xl font-bold text-slate-800 dark:text-white">Flope</Text>
          <Text className="text-slate-500 dark:text-slate-400">Günlük Özet</Text>
        </View>

        {/* KPI Cards Row 1 */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Ionicons name="cube" size={20} color="#6366f1" />
              <Text className="text-slate-500 dark:text-slate-400 font-medium ml-2">Toplam Stok</Text>
            </View>
            <Text className="text-3xl font-bold text-indigo-600">{data.totalStock.toLocaleString()}</Text>
          </View>
          <View className="flex-1 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Ionicons name="cart" size={20} color="#22c55e" />
              <Text className="text-slate-500 dark:text-slate-400 font-medium ml-2">Satış Adet</Text>
            </View>
            <Text className="text-3xl font-bold text-green-600">{data.totalSales.toLocaleString()}</Text>
          </View>
        </View>

        {/* KPI Cards Row 2 */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Ionicons name="trophy" size={20} color="#ec4899" />
              <Text className="text-slate-500 dark:text-slate-400 font-medium ml-2">Top Marka</Text>
            </View>
            <Text className="text-xl font-bold text-pink-600" numberOfLines={1}>{data.topBrand}</Text>
          </View>
          <View className="flex-1 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Ionicons name="layers" size={20} color="#f59e0b" />
              <Text className="text-slate-500 dark:text-slate-400 font-medium ml-2">SKU Sayısı</Text>
            </View>
            <Text className="text-3xl font-bold text-amber-600">-</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text className="text-lg font-bold text-slate-800 dark:text-white mt-4 mb-3">Hızlı İşlemler</Text>
        <View className="flex-row gap-4">
          <View className="flex-1 bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <Ionicons name="refresh-circle" size={24} color="#6366f1" />
            <Text className="font-bold text-indigo-700 dark:text-indigo-300 mt-2">RPT Talebi</Text>
            <Text className="text-xs text-indigo-400 mt-1">Hızlı talep oluştur</Text>
          </View>
          <View className="flex-1 bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
            <Ionicons name="scan" size={24} color="#f59e0b" />
            <Text className="font-bold text-orange-700 dark:text-orange-300 mt-2">Sayım Yap</Text>
            <Text className="text-xs text-orange-400 mt-1">Barkod okut</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
