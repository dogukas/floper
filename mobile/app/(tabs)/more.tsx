import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface MenuItem {
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: string;
    color: string;
}

const menuItems: MenuItem[] = [
    {
        title: 'RPT Talepleri',
        subtitle: 'Repeat Order yönetimi',
        icon: 'refresh-circle-outline',
        route: '/rpt',
        color: '#6366f1',
    },
    {
        title: 'Personel KPI',
        subtitle: 'Performans göstergeleri',
        icon: 'stats-chart-outline',
        route: '/kpi',
        color: '#22c55e',
    },
    {
        title: '3D Depo',
        subtitle: 'Görsel depo haritası',
        icon: 'cube-outline',
        route: '/warehouse3d',
        color: '#f59e0b',
    },
    {
        title: 'Ayarlar',
        subtitle: 'Uygulama yapılandırması',
        icon: 'settings-outline',
        route: '/settings',
        color: '#64748b',
    },
];

export default function MoreScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="p-4 pt-12">
                <Text className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Daha Fazla</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-sm">Diğer modüller ve ayarlar</Text>
            </View>

            <ScrollView className="flex-1 px-4">
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => router.push(item.route as any)}
                        className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-3 flex-row items-center shadow-sm active:opacity-70"
                    >
                        <View style={{ backgroundColor: item.color + '20' }} className="w-12 h-12 rounded-xl items-center justify-center mr-4">
                            <Ionicons name={item.icon} size={24} color={item.color} />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-slate-800 dark:text-white">{item.title}</Text>
                            <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.subtitle}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                ))}

                {/* App Info */}
                <View className="mt-8 items-center pb-8">
                    <Text className="text-slate-400 text-xs">Flope Mobile v0.1</Text>
                    <Text className="text-slate-300 text-xs mt-1">© 2026</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
