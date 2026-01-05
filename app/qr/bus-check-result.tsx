import { Button } from '@/components/Button';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

export default function BusCheckResultScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                    <Ionicons name="bus" size={80} color="#4CAF50" />
                    <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={24} color="#fff" />
                    </View>
                </View>

                <Text style={styles.title}>Doğru Otobüs!</Text>
                <Text style={styles.subtitle}>Biniş yapabilirsiniz.</Text>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Plaka</Text>
                        <Text style={styles.value}>34 AB 123</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Firma</Text>
                        <Text style={styles.value}>Tokat Seyahat</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Kaptan</Text>
                        <Text style={styles.value}>Ahmet Yılmaz</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Güzergah</Text>
                        <Text style={styles.value}>İstanbul - Tokat</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Durum</Text>
                        <Text style={[styles.value, { color: '#4CAF50' }]}>Temiz & Hazır</Text>
                    </View>
                </View>

                <Button
                    title="Yeni Kontrol"
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
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    checkBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
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
