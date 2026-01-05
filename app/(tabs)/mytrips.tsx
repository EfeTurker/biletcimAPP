import { Colors } from '@/constants/theme';
import { MockDataService, MyTrip } from '@/services/mockData';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, useColorScheme, View } from 'react-native';

export default function MyTripsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [trips, setTrips] = useState<MyTrip[]>([]);

    useFocusEffect(
        useCallback(() => {
            const data = MockDataService.getMyTrips();
            setTrips([...data]); // Create a new array to ensure re-render
        }, [])
    );

    const renderItem = ({ item }: { item: MyTrip }) => {
        const isHotel = item.type === 'HOTEL';

        return (
            <View style={styles.card}>
                <View style={[styles.cardHeader, { borderBottomColor: '#f0f0f0' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons
                            name={isHotel ? 'bed' : (item.type === 'FLIGHT' ? 'airplane' : 'bus')}
                            size={20}
                            color={theme.primary}
                            style={{ marginRight: 8 }}
                        />
                        <Text style={styles.companyName}>{item.company}</Text>
                    </View>
                    <Text style={[styles.pnr, { color: theme.primary }]}>PNR: {item.pnr}</Text>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.label}>{isHotel ? 'Şehir' : 'Nereden'}</Text>
                            <Text style={styles.value}>{item.from}</Text>
                        </View>
                        {!isHotel && <Ionicons name="arrow-forward" size={16} color="#ccc" style={{ marginTop: 12 }} />}
                        {!isHotel && (
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.label}>Nereye</Text>
                                <Text style={styles.value}>{item.to}</Text>
                            </View>
                        )}
                    </View>

                    <View style={[styles.row, { marginTop: 16 }]}>
                        <View>
                            <Text style={styles.label}>{isHotel ? 'Giriş - Çıkış' : 'Tarih & Saat'}</Text>
                            <Text style={styles.value}>
                                {isHotel && item.checkIn && item.checkOut
                                    ? `${new Date(item.checkIn).toLocaleDateString('tr-TR')} - ${new Date(item.checkOut).toLocaleDateString('tr-TR')}`
                                    : `${new Date(item.date).toLocaleDateString('tr-TR')} - ${item.time}`
                                }
                            </Text>
                        </View>
                        {isHotel ? (
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.label}>Misafir</Text>
                                <Text style={styles.value}>{item.guestCount || 1} Kişi</Text>
                            </View>
                        ) : (
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.label}>Koltuk</Text>
                                <Text style={styles.value}>{item.seatNumber}</Text>
                            </View>
                        )}
                    </View>

                    <View style={[styles.row, { marginTop: 16 }]}>
                        <View>
                            <Text style={styles.label}>Yolcu</Text>
                            <Text style={styles.value}>{item.passengerName} {item.passengerSurname}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.label}>Tutar</Text>
                            <Text style={[styles.value, { color: '#2E7D32' }]}>{item.price} TL</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Seyahatlerim</Text>
            </View>

            <FlatList
                data={trips}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="ticket-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>Henüz bir seyahatiniz bulunmuyor.</Text>
                    </View>
                }
            />
        </SafeAreaView>
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
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        // Shadow
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
        padding: 16,
        borderBottomWidth: 1,
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    pnr: {
        fontSize: 14,
        fontWeight: '600',
    },
    cardBody: {
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    value: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#999',
    },
});
