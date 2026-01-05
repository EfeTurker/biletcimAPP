import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/theme';
import { useAlert } from '@/context/AlertContext';
import { AuthService } from '@/services/auth';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function PassengerInfoScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { showAlert } = useAlert();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [tcNumber, setTcNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Try to pre-fill if user is logged in
    useEffect(() => {
        const checkUser = async () => {
            const user = await AuthService.getCurrentUser();
            if (user) {
                setName(user.name);
                setSurname(user.surname);
                setPhone(user.phone);
                setTcNumber(user.tcNumber);
            }
        };
        checkUser();
    }, []);

    const handleContinue = () => {
        if (!name || !surname || !phone || !tcNumber) {
            showAlert({ title: 'Eksik Bilgi', message: 'Lütfen tüm alanları doldurun.', type: 'error' });
            return;
        }

        if (tcNumber.length !== 11) {
            showAlert({ title: 'Hatalı T.C.', message: 'T.C. Kimlik No 11 haneli olmalıdır.', type: 'error' });
            return;
        }

        // Navigate to Payment
        router.push({
            pathname: '/payment',
            params: {
                ...params,
                name,
                surname,
                phone,
                tcNumber
            }
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ ...styles.container, backgroundColor: theme.background }}
        >
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Yolcu Bilgileri</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Trip Summary Card (Mock) */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Seçilen Sefer</Text>
                    <View style={styles.summaryRow}>
                        <Ionicons name="location" size={16} color={theme.primary} />
                        <Text style={styles.summaryText}>
                            {params.from || 'İstanbul'} - {params.to || 'Ankara'}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Ionicons name="calendar" size={16} color={theme.primary} />
                        <Text style={styles.summaryText}>
                            {params.date ? new Date(params.date as string).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}
                        </Text>
                    </View>
                    {params.selectedSeat && (
                        <View style={styles.summaryRow}>
                            <Ionicons name="bus" size={16} color={theme.primary} />
                            <Text style={styles.summaryText}>
                                Koltuk: {params.selectedSeat} ({params.passengerGender === 'male' ? 'Erkek' : 'Kadın'})
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.formContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Kişisel Bilgiler</Text>
                    <Text style={styles.infoText}>Biletiniz bu bilgilere göre oluşturulacaktır.</Text>

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

                    <Input
                        placeholder="Cep Telefonu"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        icon="call-outline"
                    />

                    <Input
                        placeholder="T.C. Kimlik No"
                        value={tcNumber}
                        onChangeText={(text) => setTcNumber(text.replace(/[^0-9]/g, '').slice(0, 11))}
                        keyboardType="numeric"
                        maxLength={11}
                        icon="card-outline"
                    />

                    <Button
                        title="Ödemeye Geç"
                        onPress={handleContinue}
                        isLoading={isLoading}
                        variant="primary"
                        style={{ marginTop: 24 }}
                    />
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    summaryCard: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    summaryText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    formContainer: {

    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
    },
});
