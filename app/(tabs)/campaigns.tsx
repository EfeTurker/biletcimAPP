import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface Campaign {
    id: string;
    title: string;
    description: string;
    discount: string;
    color: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const CAMPAIGNS: Campaign[] = [
    {
        id: '1',
        title: 'İlk Biletin Bizden',
        description: 'Yeni üyelere özel ilk otobüs biletinde geçerli %50 indirim fırsatı!',
        discount: '%50',
        color: '#FF5722',
        icon: 'bus'
    },
    {
        id: '2',
        title: 'Yaz Fırsatı',
        description: 'Antalya, Bodrum ve İzmir seferlerinde %20 indirim.',
        discount: '%20',
        color: '#FFA000',
        icon: 'sunny'
    },
    {
        id: '3',
        title: 'Öğrenci İndirimi',
        description: 'Öğrenci kimliğini doğrulayan herkese tüm seferlerde %15 indirim.',
        discount: '%15',
        color: '#1976D2',
        icon: 'school'
    },
    {
        id: '4',
        title: 'Dönüş Biletinde İndirim',
        description: 'Gidiş-dönüş bilet alımlarında anında ekstra %10 indirim.',
        discount: '%10',
        color: '#4CAF50',
        icon: 'repeat'
    },
    {
        id: '5',
        title: 'Mobil Uygulama Bonusu',
        discount: '50 TL',
        color: '#9C27B0',
        icon: 'phone-portrait'
    },
    {
        id: '6',
        title: 'Hafta Sonu Kaçamağı',
        description: 'Cuma gidiş Pazar dönüş biletlerinde %10 indirim sizi bekliyor.',
        discount: '%10',
        color: '#E91E63',
        icon: 'heart'
    },
    {
        id: '7',
        title: 'Erken Rezervasyon',
        description: 'Biletini 15 gün önceden al, %25 daha az öde!',
        discount: '%25',
        color: '#009688',
        icon: 'calendar'
    }
];

export default function CampaignsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const renderItem = ({ item }: { item: Campaign }) => (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={32} color={item.color} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={[styles.badge, { backgroundColor: item.color }]}>
                        <Text style={styles.badgeText}>{item.discount}</Text>
                    </View>
                </View>
                <Text style={styles.description}>{item.description}</Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={[styles.buttonText, { color: item.color }]}>Detaylar</Text>
                    <Ionicons name="arrow-forward" size={16} color={item.color} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Kampanyalar</Text>
            </View>

            <FlatList
                data={CAMPAIGNS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
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
    listContent: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 100, // Extra space at bottom for better scrolling
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    }
});
