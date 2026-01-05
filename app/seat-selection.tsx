import { Button } from '@/components/Button';
import { Colors } from '@/constants/theme';
import { useAlert } from '@/context/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

const { width } = Dimensions.get('window');

type Gender = 'male' | 'female';

interface Seat {
    id: number;
    number: number;
    isOccupied: boolean;
    gender?: Gender; // Gender of the passenger if occupied
}

export default function SeatSelectionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { showAlert } = useAlert();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [selectedGender, setSelectedGender] = useState<Gender>('male');
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);

    useEffect(() => {
        // Generate Mock Seats (2+1 Layout)
        // Let's say 40 seats
        const generatedSeats: Seat[] = [];
        for (let i = 1; i <= 40; i++) {
            const isOccupied = Math.random() < 0.4; // 40% occupancy chance
            const gender = isOccupied ? (Math.random() > 0.5 ? 'male' : 'female') : undefined;
            generatedSeats.push({
                id: i,
                number: i,
                isOccupied,
                gender
            });
        }
        setSeats(generatedSeats);
    }, []);

    const handleSeatPress = (seat: Seat) => {
        if (seat.isOccupied) {
            showAlert({
                title: 'Koltuk Dolu',
                message: 'Bu koltuk maalesef dolu.',
                type: 'warning'
            });
            return;
        }

        // Gender Check Logic
        // In 2+1 layout:
        // Rows usually: [Single] [Aisle] [Double_Left] [Double_Right]
        // Or simplified logic:
        // Let's assume standard layout:
        // Seat N and N+1 are pairs if (N % 3 !== 1).
        // 1 (Single) | 2 3 (Double)
        // 4 (Single) | 5 6 (Double)

        // This math is tricky for generic layouts, let's simplify for 2+1:
        // Modulo 3 logic:
        // Remainder 1: Single Seat (No neighbor) -> Safe
        // Remainder 2: Left of Pair -> Neighbor is Remainder 0 (Seat + 1)
        // Remainder 0: Right of Pair -> Neighbor is Remainder 2 (Seat - 1)

        const rem = seat.number % 3;
        let neighborSeatId: number | null = null;

        if (rem === 2) {
            neighborSeatId = seat.number + 1;
        } else if (rem === 0) {
            neighborSeatId = seat.number - 1;
        }

        if (neighborSeatId) {
            const neighbor = seats.find(s => s.number === neighborSeatId);
            if (neighbor && neighbor.isOccupied && neighbor.gender) {
                if (neighbor.gender !== selectedGender) {
                    showAlert({
                        title: 'Seçim Yapılamaz',
                        message: `Yan koltukta ${neighbor.gender === 'male' ? 'BAY' : 'BAYAN'} yolcu bulunmaktadır. ${selectedGender === 'male' ? 'BAY' : 'BAYAN'} yolcu yanına bilet alamazsınız.`,
                        type: 'error'
                    });
                    return;
                }
            }
        }

        // If validation passes
        setSelectedSeat(seat.number);
    };

    const handleContinue = () => {
        if (!selectedSeat) {
            showAlert({ title: 'Koltuk Seçmediniz', message: 'Lütfen bir koltuk seçin.', type: 'warning' });
            return;
        }

        router.push({
            pathname: '/passenger-info',
            params: {
                ...params,
                selectedSeat,
                passengerGender: selectedGender
            }
        });
    };

    const renderSeat = (seat: Seat) => {
        const isSelected = selectedSeat === seat.number;

        let backgroundColor = '#fff';
        let borderColor = '#ddd';
        let iconColor = '#ccc';

        if (seat.isOccupied) {
            backgroundColor = seat.gender === 'male' ? '#E3F2FD' : '#FCE4EC'; // Blue-ish for male, Pink-ish for female
            borderColor = seat.gender === 'male' ? '#90CAF9' : '#F48FB1';
            iconColor = seat.gender === 'male' ? '#2196F3' : '#E91E63';
        } else if (isSelected) {
            backgroundColor = '#4CAF50';
            borderColor = '#4CAF50';
            iconColor = '#fff';
        }

        // Specific style for single seats (Left side) vs Double seats (Right side)
        const rem = seat.number % 3;
        const isSingle = rem === 1;

        return (
            <TouchableOpacity
                key={seat.id}
                style={[
                    styles.seat,
                    { backgroundColor, borderColor },
                    isSingle && { marginRight: 40 } // Aisle Gap
                ]}
                onPress={() => handleSeatPress(seat)}
                activeOpacity={seat.isOccupied ? 1 : 0.6}
            >
                <Ionicons name="person" size={20} color={iconColor} />
                <Text style={[styles.seatNumber, isSelected && { color: '#fff' }]}>{seat.number}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerTitle: 'Koltuk Seçimi', headerBackTitle: 'Geri' }} />
            <StatusBar style="dark" />

            {/* Gender Selector */}
            <View style={styles.genderSelector}>
                <Text style={styles.label}>Yolcu Cinsiyeti:</Text>
                <View style={styles.genderButtons}>
                    <TouchableOpacity
                        style={[styles.genderButton, selectedGender === 'male' && styles.genderButtonActiveMale]}
                        onPress={() => setSelectedGender('male')}
                    >
                        <Ionicons name="male" size={20} color={selectedGender === 'male' ? '#fff' : '#666'} />
                        <Text style={[styles.genderText, selectedGender === 'male' && { color: '#fff' }]}>Erkek</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.genderButton, selectedGender === 'female' && styles.genderButtonActiveFemale]}
                        onPress={() => setSelectedGender('female')}
                    >
                        <Ionicons name="female" size={20} color={selectedGender === 'female' ? '#fff' : '#666'} />
                        <Text style={[styles.genderText, selectedGender === 'female' && { color: '#fff' }]}>Kadın</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bus Layout */}
            <ScrollView contentContainerStyle={styles.busContainer}>
                <View style={styles.busFrame}>
                    <View style={styles.driverSection}>
                        <Ionicons name="radio-button-on" size={24} color="#ccc" style={{ alignSelf: 'flex-start', marginLeft: 20 }} />
                        <Text style={styles.busLabel}>Ön</Text>
                    </View>

                    <View style={styles.seatsGrid}>
                        {seats.map((seat) => renderSeat(seat))}
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#fff', borderColor: '#ddd' }]} />
                        <Text style={styles.legendText}>Boş</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }]} />
                        <Text style={styles.legendText}>Seçili</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#E3F2FD', borderColor: '#90CAF9' }]} />
                        <Text style={styles.legendText}>Dolu (E)</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#FCE4EC', borderColor: '#F48FB1' }]} />
                        <Text style={styles.legendText}>Dolu (K)</Text>
                    </View>
                </View>
                <Button
                    title="Devam Et"
                    onPress={handleContinue}
                    variant="primary"
                    disabled={!selectedSeat}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    genderSelector: {
        backgroundColor: '#fff',
        padding: 16,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    genderButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    genderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    genderButtonActiveMale: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    genderButtonActiveFemale: {
        backgroundColor: '#E91E63',
        borderColor: '#E91E63',
    },
    genderText: {
        fontWeight: '600',
        marginLeft: 4,
        color: '#666',
    },
    busContainer: {
        padding: 20,
        alignItems: 'center',
    },
    busFrame: {
        width: width * 0.85,
        backgroundColor: '#fff',
        borderRadius: 40,
        padding: 20,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        minHeight: 500,
    },
    driverSection: {
        borderBottomWidth: 2,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    busLabel: {
        color: '#ccc',
        marginTop: 4,
        fontSize: 12,
    },
    seatsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
    },
    seat: {
        width: 45,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    seatNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 2,
        color: '#555',
    },
    footer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: 30, // Safe area
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        marginRight: 6,
    },
    legendText: {
        fontSize: 10,
        color: '#666',
    },
});
