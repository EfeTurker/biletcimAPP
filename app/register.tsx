import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/theme';
import { useAlert } from '@/context/AlertContext';
import { AuthService } from '@/services/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [tcNumber, setTcNumber] = useState('');
    const { showAlert } = useAlert();
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | ''>('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !surname || !email || !phone || !password || !confirmPassword) {
            showAlert({ title: 'Uyarı', message: 'Lütfen tüm alanları doldurun.', type: 'warning' });
            return;
        }

        if (password !== confirmPassword) {
            showAlert({ title: 'Hata', message: 'Şifreler eşleşmiyor!', type: 'error' });
            return;
        }

        setIsLoading(true);
        const result = await AuthService.register({
            name,
            surname,
            email,
            phone,
            password,
            tcNumber,
            gender: gender as 'male' | 'female'
        });
        setIsLoading(false);

        if (result.success) {
            showAlert({ title: 'Başarılı', message: result.message, type: 'success' });
            router.back(); // Go back to Login
        } else {
            showAlert({ title: 'Hata', message: result.message, type: 'error' });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ ...styles.container, backgroundColor: theme.background }}
        >
            <StatusBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={theme.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.formContainer}>
                    <Text style={{ ...styles.title, color: theme.primary }}>Kayıt Ol</Text>
                    <Text style={{ ...styles.subtitle, color: theme.icon }}>Yeni bir hesap oluşturun ve seyahate başlayın.</Text>

                    <Input
                        placeholder="Adınız"
                        value={name}
                        onChangeText={setName}
                        icon="person-outline"
                    />

                    <Input
                        placeholder="Soyadınız"
                        value={surname}
                        onChangeText={setSurname}
                        icon="person-outline"
                    />

                    {/* Gender Selection */}
                    <View style={styles.genderContainer}>
                        <TouchableOpacity
                            style={[
                                styles.genderButton,
                                gender === 'male' && { backgroundColor: '#E3F2FD', borderColor: theme.primary }
                            ]}
                            onPress={() => setGender('male')}
                        >
                            <Ionicons name="male" size={20} color={gender === 'male' ? theme.primary : '#666'} />
                            <Text style={[styles.genderText, gender === 'male' && { color: theme.primary }]}>Erkek</Text>
                        </TouchableOpacity>
                        <View style={{ width: 12 }} />
                        <TouchableOpacity
                            style={[
                                styles.genderButton,
                                gender === 'female' && { backgroundColor: '#FCE4EC', borderColor: '#EC407A' }
                            ]}
                            onPress={() => setGender('female')}
                        >
                            <Ionicons name="female" size={20} color={gender === 'female' ? '#EC407A' : '#666'} />
                            <Text style={[styles.genderText, gender === 'female' && { color: '#EC407A' }]}>Kadın</Text>
                        </TouchableOpacity>
                    </View>

                    <Input
                        placeholder="T.C. Kimlik Numaranız"
                        value={tcNumber}
                        onChangeText={(text) => setTcNumber(text.replace(/[^0-9]/g, '').slice(0, 11))}
                        keyboardType="numeric"
                        maxLength={11}
                        icon="card-outline"
                    />

                    <Input
                        placeholder="Cep Telefonu Numaranız"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        icon="call-outline"
                    />

                    <Input
                        placeholder="Gmail Adresiniz"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        icon="mail-outline"
                    />

                    <Input
                        placeholder="Şifre Oluşturun"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        icon="lock-closed-outline"
                    />

                    <Input
                        placeholder="Şifreyi Tekrar Girin"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        icon="lock-closed-outline"
                    />

                    <Button
                        title="Kayıt Ol"
                        onPress={handleRegister}
                        isLoading={isLoading}
                        variant="primary"
                        style={styles.button}
                    />

                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={{ ...styles.loginLink, color: theme.icon }}>
                            Zaten hesabınız var mı? <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Giriş Yap</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    scrollContent: {
        flexGrow: 1,
    },
    formContainer: {
        padding: 24,
        paddingTop: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32,
    },
    button: {
        marginTop: 16,
    },
    loginLink: {
        marginTop: 24,
        textAlign: 'center',
        fontSize: 14,
    },
    genderContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    genderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
    },
    genderText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
});
