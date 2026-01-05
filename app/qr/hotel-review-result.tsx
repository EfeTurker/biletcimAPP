import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/theme';
import { useAlert } from '@/context/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function HotelReviewResultScreen() {
    const router = useRouter();
    const { showAlert } = useAlert();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        if (rating === 0) {
            showAlert({ title: 'Hata', message: 'Lütfen bir puan seçin.', type: 'warning' });
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            showAlert({
                title: 'Teşekkürler',
                message: 'Değerlendirmeniz başarıyla kaydedildi.',
                type: 'success'
            });
            router.push('/(tabs)/qr');
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/(tabs)/qr')} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Otel Değerlendirmesi</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.hotelCard}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="business" size={40} color={theme.primary} />
                    </View>
                    <Text style={styles.hotelName}>Antalya Resort & Spa</Text>
                    <Text style={styles.hotelLocation}>Antalya, Türkiye</Text>
                    <Text style={styles.stayDate}>Konaklama: 12-15 Ekim 2025</Text>
                </View>

                <Text style={styles.sectionTitle}>Puanınız</Text>
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={star <= rating ? "star" : "star-outline"}
                                size={40}
                                color="#FFD700"
                                style={{ marginHorizontal: 8 }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Yorumunuz</Text>
                <Input
                    placeholder="Deneyimlerinizi paylaşın..."
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    numberOfLines={4}
                    style={{ height: 120, textAlignVertical: 'top' }}
                />

                <Button
                    title="Değerlendirmeyi Gönder"
                    onPress={handleSubmit}
                    isLoading={isLoading}
                    variant="primary"
                    style={{ marginTop: 30 }}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 20,
    },
    hotelCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 30,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    hotelName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    hotelLocation: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    stayDate: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        marginTop: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
    }
});
