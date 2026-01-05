import { Button } from '@/components/Button';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

export default function TicketResultScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
                </View>

                <Text style={styles.title}>Bilet Doğrulandı</Text>
                <Text style={styles.subtitle}>İyi Yolculuklar Dileriz</Text>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Yolcu Adı</Text>
                        <Text style={styles.value}>Hakan Yılmaz</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Sefer</Text>
                        <Text style={styles.value}>İstanbul - Ankara</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Tarih</Text>
                        <Text style={styles.value}>10.05.2024 - 14:30</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Koltuk No</Text>
                        <Text style={styles.value}>12</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>PNR</Text>
                        <Text style={styles.value}>PNR12345</Text>
                    </View>
                </View>

                <Button
                    title="Yeni Sorgu Yap"
                    onPress={() => router.replace('/(tabs)/qr')}
                    variant="outline"
                    style={{ marginTop: 40, borderColor: theme.primary }}
                    textStyle={{ color: theme.primary }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
    },
    card: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    label: {
        fontSize: 14,
        color: '#888',
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 4,
    }
});
