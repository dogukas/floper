import { View, Text, SafeAreaView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSession } from '@/ctx';

export default function SettingsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [notifications, setNotifications] = useState(true);
    const { signOut } = useSession();

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <Stack.Screen options={{ title: 'Ayarlar', headerShown: true, headerBackTitle: 'Geri' }} />

            <View className="p-4">
                {/* Appearance */}
                <Text className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase">Görünüm</Text>
                <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 mb-6">
                    <View className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                        <View className="flex-row items-center">
                            <Ionicons name="moon-outline" size={22} color={colorScheme === 'dark' ? '#fff' : '#64748b'} />
                            <Text className="text-slate-800 dark:text-white ml-3 font-medium">Tema</Text>
                        </View>
                        <Text className="text-slate-500 dark:text-slate-400">{colorScheme === 'dark' ? 'Koyu' : 'Açık'}</Text>
                    </View>
                    <View className="flex-row items-center justify-between p-4">
                        <View className="flex-row items-center">
                            <Ionicons name="notifications-outline" size={22} color={colorScheme === 'dark' ? '#fff' : '#64748b'} />
                            <Text className="text-slate-800 dark:text-white ml-3 font-medium">Bildirimler</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#94a3b8', true: '#6366f1' }}
                        />
                    </View>
                </View>

                {/* Account */}
                <Text className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase">Hesap</Text>
                <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 mb-6">
                    <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                        <View className="flex-row items-center">
                            <Ionicons name="person-outline" size={22} color={colorScheme === 'dark' ? '#fff' : '#64748b'} />
                            <Text className="text-slate-800 dark:text-white ml-3 font-medium">Profil</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            // signOut();
                            Alert.alert('Bilgi', 'Login ekranı geçici olarak devre dışı bırakıldığı için çıkış yapılamaz.');
                        }}
                        className="flex-row items-center justify-between p-4"
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
                            <Text className="text-red-500 ml-3 font-medium">Çıkış Yap</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* About */}
                <Text className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase">Hakkında</Text>
                <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <View className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                        <Text className="text-slate-800 dark:text-white font-medium">Versiyon</Text>
                        <Text className="text-slate-500 dark:text-slate-400">0.1.0</Text>
                    </View>
                    <View className="flex-row items-center justify-between p-4">
                        <Text className="text-slate-800 dark:text-white font-medium">Build</Text>
                        <Text className="text-slate-500 dark:text-slate-400">2026.01.20</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
