
import { Colors } from '@/constants/theme';
import { useAlert } from '@/context/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function QRScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { showAlert } = useAlert();

    const handleAction = (type: string) => {
        if (type === 'bus') {
            router.push('/qr/scanner?type=bus');
        } else if (type === 'ticket') {
            router.push('/qr/scanner?type=ticket');
        } else if (type === 'hotel') {
            router.push('/qr/scanner?type=hotel');
        } else {
            showAlert({
                title: 'Yakında',
                message: `Bu özellik çok yakında eklenecek!`,
                type: 'info'
            });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>QR İşlemleri</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Lütfen yapmak istediğiniz işlemi seçin</Text>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: '#E3F2FD' }]}
                    onPress={() => handleAction('ticket')}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#2196F3' }]}>
                        <Ionicons name="ticket-outline" size={40} color="#fff" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Otobüs Bileti Kontrol</Text>
                        <Text style={styles.cardDesc}>QR kod ile biletinizi hızlıca doğrulayın.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#2196F3" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: '#E8F5E9', marginTop: 20 }]}
                    onPress={() => handleAction('bus')}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
                        <Ionicons name="construct-outline" size={40} color="#fff" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Otobüs Kontrolü</Text>
                        <Text style={styles.cardDesc}>Doğru otobüse binip binmediğinizi kontrol edin.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#4CAF50" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: '#FFF3E0', marginTop: 20 }]}
                    onPress={() => handleAction('hotel')}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#FF9800' }]}>
                        <Ionicons name="star-outline" size={40} color="#fff" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Otel Değerlendirmesi</Text>
                        <Text style={styles.cardDesc}>Konaklamanızı QR ile puanlayın ve deneyimlerinizi paylaşın.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#FF9800" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 20,
        flex: 1,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    }
});
