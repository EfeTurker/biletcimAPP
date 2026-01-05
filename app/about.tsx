import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function AboutScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar style="light" />

            {/* Custom Header */}
            <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hakkımızda</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="business" size={48} color={theme.primary} />
                    </View>
                    <Text style={styles.text}>
                        2004 yılında Tokat'ta yerel bir işletmeyken şu an tüm dünyada kullanılıyoruz.
                    </Text>
                    <Text style={styles.subText}>
                        BİLETCİM, seyahat planlamanızı en kolay ve hızlı şekilde yapmanız için yanınızda.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.version}>Versiyon 1.0.0</Text>
                    <Text style={styles.copyright}>© 2024 BİLETCİM</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        padding: 24,
        flexGrow: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 32,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
        marginBottom: 16,
        lineHeight: 26,
    },
    subText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#777',
        lineHeight: 20,
    },
    footer: {
        alignItems: 'center',
    },
    version: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    copyright: {
        fontSize: 12,
        color: '#999',
    }
});
