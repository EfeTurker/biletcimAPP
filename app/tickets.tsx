import { Colors } from '@/constants/theme';
import { MockDataService, Trip } from '@/services/mockData';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function TicketListScreen() {
    return (
        <>
            <Stack.Screen options={{ headerTitle: 'Seferler', headerBackTitle: 'Geri' }} />
            <TicketListContent />
        </>
    );
}

function TicketListContent() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { from, to, date, mode } = params;

    useEffect(() => {
        // Simulate API delay
        setTimeout(() => {
            const searchType = mode === 'plane' ? 'FLIGHT' : 'BUS';
            const results = MockDataService.getTrips(
                from as string || 'İstanbul',
                to as string || 'Tokat',
                date as string || new Date().toISOString(),
                searchType
            );
            setTrips(results);
            setIsLoading(false);
        }, 1000);
    }, [from, to, date, mode]);

    const handleSelectTrip = (trip: Trip) => {
        router.push({
            pathname: '/seat-selection',
            params: {
                ...params, // Maintain original search params
                selectedTripId: trip.id,
                company: trip.company,
                price: trip.price,
                time: trip.time
            }
        });
    };

    const renderTripItem = ({ item }: { item: Trip }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.companyName}>{item.company}</Text>
                <Text style={styles.price}>{item.price} TL</Text>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{item.time}</Text>
                    <Ionicons name="arrow-forward" size={16} color="#999" />
                    <Text style={styles.durationText}>{item.duration}</Text>
                </View>

                <View style={styles.routeContainer}>
                    <Text style={styles.routeText}>{item.from} - {item.to}</Text>
                    <Text style={styles.seatInfo}>2+1 Rahat</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.features}>
                    <Ionicons name="wifi" size={16} color="#666" style={{ marginRight: 8 }} />
                    <Ionicons name="tv" size={16} color="#666" style={{ marginRight: 8 }} />
                    <Ionicons name="cafe" size={16} color="#666" />
                </View>
                <TouchableOpacity
                    style={[styles.selectButton, { backgroundColor: theme.primary }]}
                    onPress={() => handleSelectTrip(item)}
                >
                    <Text style={styles.selectButtonText}>Seç</Text>
                    <Ionicons name="chevron-forward" size={16} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>{from} - {to}</Text>
                    <Text style={styles.headerSubtitle}>
                        {new Date(date as string).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                    </Text>
                </View>
                <View style={{ width: 28 }} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text>Seferler Aranıyor...</Text>
                </View>
            ) : (
                <FlatList
                    data={trips}
                    renderItem={renderTripItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text>Sefer bulunamadı.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
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
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    listContent: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timeText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
    },
    durationText: {
        fontSize: 12,
        color: '#999',
    },
    routeContainer: {
        alignItems: 'flex-end',
    },
    routeText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    seatInfo: {
        fontSize: 12,
        color: '#999',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    features: {
        flexDirection: 'row',
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    selectButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginRight: 4,
    },
});
