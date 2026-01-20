import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi giriniz.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            Alert.alert('Giriş Başarısız', error.message);
        } else {
            // Auth state change will be handled in _layout.tsx via redirect, 
            // but we can also push here for immediate feedback if needed.
            // Ideally, the global auth listener handles the navigation.
            router.replace('/(tabs)');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center p-6"
            >
                <View className="items-center mb-10">
                    <View className="w-24 h-24 bg-indigo-600 rounded-2xl items-center justify-center transform rotate-3 mb-4 shadow-lg">
                        <Ionicons name="cube-outline" size={48} color="white" />
                    </View>
                    <Text className="text-3xl font-bold text-slate-800 dark:text-white">Flope Mobile</Text>
                    <Text className="text-slate-500 dark:text-slate-400 mt-2">Depo ve Satış Yönetim Sistemi</Text>
                </View>

                <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 w-full">
                    <View className="mb-4">
                        <Text className="text-slate-600 dark:text-slate-300 font-medium mb-2 ml-1">E-posta</Text>
                        <View className="flex-row items-center bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3">
                            <Ionicons name="mail-outline" size={20} color="#94a3b8" />
                            <TextInput
                                className="flex-1 ml-3 text-slate-800 dark:text-white"
                                placeholder="ornek@sirket.com"
                                placeholderTextColor="#94a3b8"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-slate-600 dark:text-slate-300 font-medium mb-2 ml-1">Şifre</Text>
                        <View className="flex-row items-center bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3">
                            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                            <TextInput
                                className="flex-1 ml-3 text-slate-800 dark:text-white"
                                placeholder="••••••••"
                                placeholderTextColor="#94a3b8"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className={`bg-indigo-600 py-4 rounded-xl items-center ${loading ? 'opacity-70' : ''}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Giriş Yap</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="mt-8 items-center">
                    <Text className="text-slate-400 text-sm">© 2026 Stokly v2.0</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
