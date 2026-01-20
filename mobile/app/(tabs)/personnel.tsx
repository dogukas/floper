import { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

interface Personnel {
    id: number;
    Personel: string;
    "İşlem Adedi": number;
    "Satış Adedi": number;
    "Ciro": number;
}

export default function PersonnelScreen() {
    const [personnelData, setPersonnelData] = useState<Personnel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPersonnel();
    }, []);

    const fetchPersonnel = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('personnel_analysis').select('*').order('Ciro', { ascending: false }).limit(50);
        if (!error && data) {
            setPersonnelData(data);
        }
        setLoading(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 pt-12">
                <Text className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Personel Analizi</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-sm">Ciroya göre sıralı</Text>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#f59e0b" />
                </View>
            ) : (
                <FlatList
                    data={personnelData}
                    keyExtractor={(item) => item.id?.toString() || item.Personel}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item, index }) => (
                        <View className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-3 flex-row items-center shadow-sm">
                            {/* Rank Badge */}
                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${index < 3 ? 'bg-amber-100' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                <Text className={`font-bold ${index < 3 ? 'text-amber-600' : 'text-slate-500'}`}>{index + 1}</Text>
                            </View>

                            <View className="flex-1">
                                <Text className="font-bold text-slate-800 dark:text-white">{item.Personel}</Text>
                                <View className="flex-row mt-1">
                                    <Text className="text-xs text-slate-400 mr-3">İşlem: {item["İşlem Adedi"]}</Text>
                                    <Text className="text-xs text-slate-400">Satış: {item["Satış Adedi"]}</Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-lg font-bold text-amber-600">₺{item.Ciro?.toLocaleString()}</Text>
                                <Text className="text-xs text-slate-400">Ciro</Text>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View className="items-center mt-20">
                            <Ionicons name="people-outline" size={48} color="#94a3b8" />
                            <Text className="text-slate-400 mt-4">Personel verisi bulunamadı.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
