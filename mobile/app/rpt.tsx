import { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

interface RPTItem {
    id: string;
    urun_kodu: string;
    target_quantity: number;
    status: string;
    notes: string;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    planned: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Planlı' },
    suggestion: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Öneri' },
    requested: { bg: 'bg-orange-100', text: 'text-orange-600', label: 'Talep' },
    approved: { bg: 'bg-green-100', text: 'text-green-600', label: 'Onaylı' },
};

export default function RPTScreen() {
    const [rptData, setRptData] = useState<RPTItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchRPT();
    }, []);

    const fetchRPT = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('planning').select('*').order('created_at', { ascending: false });
        console.log('RPT response:', { data, error });
        if (!error && data) {
            setRptData(data);
        }
        setLoading(false);
    };

    const filtered = filter === 'all' ? rptData : rptData.filter(item => item.status === filter);

    const updateStatus = async (id: string, newStatus: string) => {
        await supabase.from('planning').update({ status: newStatus }).eq('id', id);
        setRptData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    };

    const getStatusStyle = (status: string) => statusColors[status] || statusColors.planned;

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <Stack.Screen options={{ title: 'RPT Talepleri', headerShown: true, headerBackTitle: 'Geri' }} />

            {/* Filter Tabs */}
            <View className="flex-row p-4 gap-2 flex-wrap">
                {(['all', 'planned', 'requested', 'approved'] as const).map(status => (
                    <TouchableOpacity
                        key={status}
                        onPress={() => setFilter(status)}
                        className={`px-4 py-2 rounded-full ${filter === status ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <Text className={`text-sm font-medium ${filter === status ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                            {status === 'all' ? 'Tümü' : getStatusStyle(status).label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#6366f1" />
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => {
                        const statusStyle = getStatusStyle(item.status);
                        return (
                            <View className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-3 shadow-sm">
                                <View className="flex-row justify-between items-start mb-2">
                                    <Text className="font-bold text-slate-800 dark:text-white flex-1">{item.urun_kodu}</Text>
                                    <View className={`px-3 py-1 rounded-full ${statusStyle.bg}`}>
                                        <Text className={`text-xs font-medium ${statusStyle.text}`}>
                                            {statusStyle.label}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-slate-500 dark:text-slate-400 text-sm">Hedef: {item.target_quantity} adet</Text>
                                {item.notes && <Text className="text-slate-400 text-xs mt-1">{item.notes}</Text>}

                                {/* Action Buttons */}
                                <View className="flex-row gap-2 mt-3">
                                    {(item.status === 'planned' || item.status === 'suggestion') && (
                                        <TouchableOpacity
                                            onPress={() => updateStatus(item.id, 'requested')}
                                            className="bg-orange-100 px-3 py-2 rounded-lg flex-row items-center"
                                        >
                                            <Ionicons name="arrow-forward" size={16} color="#f59e0b" />
                                            <Text className="text-orange-600 font-medium ml-1 text-sm">Talep Et</Text>
                                        </TouchableOpacity>
                                    )}
                                    {item.status === 'requested' && (
                                        <TouchableOpacity
                                            onPress={() => updateStatus(item.id, 'approved')}
                                            className="bg-green-100 px-3 py-2 rounded-lg flex-row items-center"
                                        >
                                            <Ionicons name="checkmark" size={16} color="#22c55e" />
                                            <Text className="text-green-600 font-medium ml-1 text-sm">Onayla</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    }}
                    ListEmptyComponent={
                        <View className="items-center mt-20">
                            <Ionicons name="refresh-circle-outline" size={48} color="#94a3b8" />
                            <Text className="text-slate-400 mt-4">RPT talebi bulunamadı.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
