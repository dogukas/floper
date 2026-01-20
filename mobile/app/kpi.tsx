import { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

interface KPIItem {
    id: number;
    Personel: string;
    "Satış Adedi": number;
    "İşlem Adedi": number;
    Ciro: number;
    "Hedef": number;
}

export default function KPIScreen() {
    const [kpiData, setKpiData] = useState<KPIItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchKPI();
    }, []);

    const fetchKPI = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('personnel_kpi').select('*').order('Ciro', { ascending: false });
        if (!error && data) {
            setKpiData(data);
        }
        setLoading(false);
    };

    const getProgressColor = (actual: number, target: number) => {
        const ratio = actual / target;
        if (ratio >= 1) return '#22c55e';
        if (ratio >= 0.7) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <Stack.Screen options={{ title: 'Personel KPI', headerShown: true, headerBackTitle: 'Geri' }} />

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#22c55e" />
                </View>
            ) : (
                <FlatList
                    data={kpiData}
                    keyExtractor={(item) => item.id?.toString() || item.Personel}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => {
                        const target = item.Hedef || 100000;
                        const progress = Math.min((item.Ciro / target) * 100, 100);
                        const progressColor = getProgressColor(item.Ciro, target);

                        return (
                            <View className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-3 shadow-sm">
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="font-bold text-slate-800 dark:text-white text-lg">{item.Personel}</Text>
                                    <View className="flex-row items-center">
                                        <Ionicons
                                            name={progress >= 100 ? 'checkmark-circle' : 'time-outline'}
                                            size={20}
                                            color={progressColor}
                                        />
                                        <Text style={{ color: progressColor }} className="font-bold ml-1">
                                            %{progress.toFixed(0)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Progress Bar */}
                                <View className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                                    <View
                                        style={{ width: `${progress}%`, backgroundColor: progressColor }}
                                        className="h-full rounded-full"
                                    />
                                </View>

                                {/* Stats */}
                                <View className="flex-row justify-between">
                                    <View className="items-center">
                                        <Text className="text-slate-400 text-xs">Ciro</Text>
                                        <Text className="font-bold text-slate-700 dark:text-slate-300">₺{item.Ciro?.toLocaleString()}</Text>
                                    </View>
                                    <View className="items-center">
                                        <Text className="text-slate-400 text-xs">Hedef</Text>
                                        <Text className="font-bold text-slate-700 dark:text-slate-300">₺{target.toLocaleString()}</Text>
                                    </View>
                                    <View className="items-center">
                                        <Text className="text-slate-400 text-xs">Satış</Text>
                                        <Text className="font-bold text-slate-700 dark:text-slate-300">{item["Satış Adedi"]}</Text>
                                    </View>
                                    <View className="items-center">
                                        <Text className="text-slate-400 text-xs">İşlem</Text>
                                        <Text className="font-bold text-slate-700 dark:text-slate-300">{item["İşlem Adedi"]}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                    ListEmptyComponent={
                        <View className="items-center mt-20">
                            <Ionicons name="stats-chart-outline" size={48} color="#94a3b8" />
                            <Text className="text-slate-400 mt-4">KPI verisi bulunamadı.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
