import { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { useStockStore } from '@/store/useStockStore';
import { Ionicons } from '@expo/vector-icons';

export default function StockScreen() {
  const stockData = useStockStore((state) => state.stockData);
  const [search, setSearch] = useState('');

  const filtered = stockData.filter(item =>
    item.Marka.toLowerCase().includes(search.toLowerCase()) ||
    item["Ürün Kodu"].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Stack.Screen options={{ title: 'Stok Listesi', headerShown: false }} />

      {/* Header & Search */}
      <View className="bg-white p-4 border-b border-slate-200 pt-12">
        <Text className="text-2xl font-bold text-slate-800 mb-4">Stoklar</Text>
        <View className="flex-row items-center bg-slate-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-2 text-slate-700"
            placeholder="Ürün Ara (Kod, Marka)..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item["Ürün Kodu"]}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-xl border border-slate-100 mb-3 flex-row justify-between items-center shadow-sm">
            <View className="flex-1">
              <Text className="font-bold text-slate-800">{item.Marka}</Text>
              <Text className="text-xs text-slate-500">{item["Ürün Kodu"]}</Text>
              <Text className="text-xs text-slate-400 mt-1">{item["Ürün Grubu"]}</Text>
            </View>
            <View className="items-end">
              <Text className="text-lg font-bold text-indigo-600">{item.Envanter}</Text>
              <Text className="text-xs text-slate-400">Adet</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Text className="text-slate-400">Sonuç bulunamadı.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
