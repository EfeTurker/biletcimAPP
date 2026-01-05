import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/theme';
import { useAlert } from '@/context/AlertContext';
import { MockDataService } from '@/services/mockData';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function PaymentScreen() {
    const { showAlert } = useAlert();
    const router = useRouter();
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = () => {
        if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
            showAlert({ title: 'Uyarı', message: 'Lütfen tüm ödeme alanlarını doldurun.', type: 'warning' });
            return;
        }

        setIsLoading(true);

        const tripData = {
            company: (params.type === 'HOTEL' ? params.hotelName : params.company) as string,
            from: (params.type === 'HOTEL' ? params.city : params.from) as string,
            to: (params.type === 'HOTEL' ? params.city : params.to) as string,
            date: params.date as string || new Date().toISOString(),
            time: params.time as string || '14:00',
            price: Number(params.price),
            type: (params.type || (params.mode === 'plane' ? 'FLIGHT' : 'BUS')) as 'FLIGHT' | 'BUS' | 'HOTEL',
            duration: 'Belirtilmedi',
            passengerName: params.name as string || cardHolder.split(' ')[0] || 'Misafir',
            passengerSurname: params.surname as string || cardHolder.split(' ')[1] || '',
            seatNumber: params.selectedSeat as string || '',
            checkIn: params.checkIn as string,
            checkOut: params.checkOut as string,
            guestCount: params.guestCount ? Number(params.guestCount) : 1
        };

        MockDataService.saveTrip(tripData);

        // Simulate Processing
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to success screen
            router.push({
                pathname: '/payment-success',
                params: {
                    type: tripData.type
                }
            });
        }, 2000);
    };

    const isHotel = params.type === 'HOTEL';

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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Ödeme</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Payment Summary */}
                <View style={[styles.summaryCard, { borderColor: theme.primary }]}>
                    <Text style={styles.summaryTitle}>Ödenecek Tutar</Text>
                    <Text style={[styles.price, { color: theme.primary }]}>{params.price || '500'} TL</Text>

                    <View style={styles.divider} />

                    {isHotel ? (
                        <>
                            <Text style={[styles.detailText, { fontWeight: 'bold', fontSize: 16 }]}>{params.hotelName}</Text>
                            <Text style={styles.detailText}>{params.city}</Text>
                            <View style={{ marginTop: 8 }}>
                                <Text style={styles.detailText}>Giriş: {new Date(params.checkIn as string).toLocaleDateString()}</Text>
                                <Text style={styles.detailText}>Çıkış: {new Date(params.checkOut as string).toLocaleDateString()}</Text>
                                {params.guestCount && (
                                    <Text style={styles.detailText}>Misafir: {params.guestCount}</Text>
                                )}
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={styles.detailText}>Sefer: {params.from} - {params.to}</Text>
                            {params.name && <Text style={styles.detailText}>Yolcu: {params.name} {params.surname}</Text>}
                        </>
                    )}
                </View>

                <View style={styles.formContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Kart Bilgileri</Text>

                    <Input
                        placeholder="Kart Üzerindeki İsim"
                        value={cardHolder}
                        onChangeText={setCardHolder}
                        icon="person-outline"
                    />

                    <Input
                        placeholder="Kart Numarası"
                        value={cardNumber}
                        onChangeText={(text) => setCardNumber(text.replace(/[^0-9]/g, '').slice(0, 16))}
                        keyboardType="numeric"
                        maxLength={16}
                        icon="card-outline"
                    />

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Input
                                placeholder="AA/YY"
                                value={expiryDate}
                                onChangeText={(text) => {
                                    if (text.length === 2 && !text.includes('/') && expiryDate.length === 1) {
                                        setExpiryDate(text + '/');
                                    } else {
                                        setExpiryDate(text);
                                    }
                                }}
                                maxLength={5}
                                keyboardType="numeric"
                                icon="calendar-outline"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Input
                                placeholder="CVV"
                                value={cvv}
                                onChangeText={setCvv}
                                maxLength={3}
                                keyboardType="numeric"
                                secureTextEntry
                                icon="lock-closed-outline"
                            />
                        </View>
                    </View>

                    <Button
                        title={`Ödeme Yap (${params.price || '500'} TL)`}
                        onPress={handlePayment}
                        isLoading={isLoading}
                        variant="primary"
                        style={{ marginTop: 24 }}
                    />

                    <View style={styles.secureBadge}>
                        <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
                        <Text style={styles.secureText}>Ödemeniz 128-bit SSL ile korunmaktadır.</Text>
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
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    summaryTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    price: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 16,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        width: '100%',
        textAlign: 'center',
    },
    formContainer: {

    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    secureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        opacity: 0.8,
    },
    secureText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 6,
    },
});
