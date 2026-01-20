import { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

interface StockItem {
    id: string;
    marka: string;
    urun_grubu: string;
    urun_kodu: string;
    renk_kodu: string;
    beden: string;
    envanter: string;
    barkod: string;
    sezon: string;
}

export default function StockScreen() {
    const [stockData, setStockData] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('stocks').select('*').limit(100);
        console.log('Stock response:', { data, error });
        if (!error && data) {
            setStockData(data);
        }
        setLoading(false);
    };

    const filtered = stockData.filter(item =>
        item.marka?.toLowerCase().includes(search.toLowerCase()) ||
        item.urun_kodu?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header & Search */}
            <View className="bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 pt-12">
                <Text className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Stok Listesi</Text>
                <View className="flex-row items-center bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2">
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput
                        className="flex-1 ml-2 text-slate-700 dark:text-white"
                        placeholder="Ürün Ara (Kod, Marka)..."
                        placeholderTextColor="#94a3b8"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#6366f1" />
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id || item.urun_kodu}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <View className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-3 flex-row justify-between items-center shadow-sm">
                            <View className="flex-1">
                                <Text className="font-bold text-slate-800 dark:text-white">{item.marka}</Text>
                                <Text className="text-xs text-slate-500 dark:text-slate-400">{item.urun_kodu}</Text>
                                <Text className="text-xs text-slate-400 mt-1">{item.urun_grubu}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-lg font-bold text-indigo-600">{item.envanter}</Text>
                                <Text className="text-xs text-slate-400">Adet</Text>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View className="items-center mt-20">
                            <Text className="text-slate-400">Veri bulunamadı.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
