import { Colors } from '@/constants/theme';
import { useAlert } from '@/context/AlertContext';
import { Hotel, MockDataService } from '@/services/mockData';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function HotelsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { city, checkIn, checkOut, guestCount } = params;

    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { showAlert } = useAlert();

    const [hotels, setHotels] = useState<Hotel[]>([]);

    useEffect(() => {
        if (city) {
            const data = MockDataService.getHotels(city as string);
            setHotels(data);
        }
    }, [city]);

    const handleSelectHotel = (hotel: Hotel) => {
        router.push({
            pathname: '/payment',
            params: {
                type: 'HOTEL',
                hotelId: hotel.id,
                hotelName: hotel.name,
                city: hotel.city,
                price: hotel.price,
                checkIn,
                checkOut,
                image: hotel.image,
                guestCount
            }
        });
    };

    const renderItem = ({ item }: { item: Hotel }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => handleSelectHotel(item)}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{item.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.locationText}>{item.city}</Text>
                </View>

                <View style={styles.featuresRow}>
                    {item.features.map((feature, index) => (
                        <View key={index} style={styles.featureBadge}>
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.footerRow}>
                    <View>
                        <Text style={styles.priceLabel}>Gecelik</Text>
                        <Text style={[styles.price, { color: theme.primary }]}>
                            {item.price} TL
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.selectButton, { backgroundColor: theme.primary }]}
                        onPress={() => handleSelectHotel(item)}
                    >
                        <Text style={styles.selectButtonText}>Seç</Text>
                        <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>{city} Otelleri</Text>
                    <Text style={styles.headerSubtitle}>
                        {new Date(checkIn as string).toLocaleDateString()} - {new Date(checkOut as string).toLocaleDateString()} • {guestCount} Misafir
                    </Text>
                </View>
            </View>

            <FlatList
                data={hotels}
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 180,
    },
    cardContent: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9C4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FBC02D',
        marginLeft: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    featuresRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    featureBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    featureText: {
        fontSize: 12,
        color: '#666',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 16,
    },
    priceLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    selectButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginRight: 8,
    }
});
