import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/theme';
import { useAlert } from '@/context/AlertContext';
import { AuthService } from '@/services/auth';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { showAlert } = useAlert();

    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);

        const identifier = loginMethod === 'email' ? email : phone;
        const result = await AuthService.login(identifier, password);

        setIsLoading(false);

        if (result.success) {
            showAlert({ title: 'Giriş Başarılı', message: 'Hoş geldiniz!', type: 'success' });
            // Navigate to home (tabs) on success
            router.replace('/(tabs)');
        } else {
            showAlert({ title: 'Hata', message: result.message, type: 'error' });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ ...styles.container, backgroundColor: theme.background }}
        >
            <StatusBar style="light" />

            {/* Back Button added since this is now a pushed screen */}
            <View style={{ position: 'absolute', top: 50, left: 20, zIndex: 1 }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={{ ...styles.header, backgroundColor: theme.primary }}>
                    <Text style={styles.headerTitle}>BİLETCİM</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={{ ...styles.title, color: theme.text }}>Uye Girişi</Text>

                    {/* Login Method Toggle */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                loginMethod === 'email' && { borderBottomColor: theme.primary, borderBottomWidth: 2 }
                            ]}
                            onPress={() => setLoginMethod('email')}
                        >
                            <Text style={[styles.tabText, { color: loginMethod === 'email' ? theme.primary : '#999' }]}>E-Posta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                loginMethod === 'phone' && { borderBottomColor: theme.primary, borderBottomWidth: 2 }
                            ]}
                            onPress={() => setLoginMethod('phone')}
                        >
                            <Text style={[styles.tabText, { color: loginMethod === 'phone' ? theme.primary : '#999' }]}>Telefon</Text>
                        </TouchableOpacity>
                    </View>

                    {loginMethod === 'email' ? (
                        <Input
                            placeholder="E-Posta Adresiniz"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon="mail-outline"
                        />
                    ) : (
                        <Input
                            placeholder="Cep Telefonu Numaranız"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            icon="call-outline"
                        />
                    )}

                    <Input
                        placeholder="Şifreniz"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        icon="lock-closed-outline"
                    />

                    <View style={styles.forgotPasswordContainer}>
                        <Link href="/register" asChild>
                            <Text style={{ ...styles.forgotPassword, color: theme.icon }}>Şifremi Unuttum</Text>
                        </Link>
                    </View>

                    <Button
                        title="Giriş Yap"
                        onPress={handleLogin}
                        isLoading={isLoading}
                        variant="primary"
                    />

                    <View style={styles.registerContainer}>
                        <Text style={{ color: theme.text }}>Üye değil misiniz? </Text>
                        <Link href="/register" asChild>
                            <Text style={{ ...styles.registerLink, color: theme.primary }}>Kayıt Ol</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
    },
    formContainer: {
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    forgotPassword: {
        fontSize: 14,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    registerLink: {
        fontWeight: 'bold',
    },
});
