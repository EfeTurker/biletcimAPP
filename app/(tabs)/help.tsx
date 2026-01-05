import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function HelpScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [searchQuery, setSearchQuery] = useState('');

    const renderHelpItem = (title: string, icon: keyof typeof Ionicons.glyphMap, subtitle?: string) => (
        <TouchableOpacity style={styles.itemContainer} activeOpacity={0.7}>
            <View style={[styles.iconBox, { backgroundColor: theme.primary + '10' }]}>
                <Ionicons name={icon} size={24} color={theme.primary} />
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{title}</Text>
                {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header with Search */}
            <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <Text style={styles.headerTitle}>Yardım</Text>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Nasıl Yardımcı Olabilirim?"
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <Text style={styles.sectionTitle}>Konu Seçiniz</Text>

                <View style={styles.card}>
                    {renderHelpItem('Otobüs Bileti', 'bus', 'İptal, iade ve değişiklik işlemleri')}
                    <View style={styles.divider} />
                    {renderHelpItem('Uçak Bileti', 'airplane', 'Check-in, bagaj ve uçuş bilgileri')}
                    <View style={styles.divider} />
                    {renderHelpItem('Otel', 'bed', 'Rezervasyon sorgulama ve değişiklik')}
                </View>

                <View style={styles.supportCard}>
                    <Text style={styles.supportTitle}>Canlı Destek</Text>
                    <Text style={styles.supportDesc}>Hala sorunuza cevap bulamadınız mı?</Text>
                    <TouchableOpacity style={[styles.supportButton, { backgroundColor: theme.primary }]}>
                        <Text style={styles.supportButtonText}>Canlı Desteğe Bağlan</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    itemSubtitle: {
        fontSize: 12,
        color: '#888',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 72,
    },
    supportCard: {
        backgroundColor: '#fff',
        marginTop: 24,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    supportTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    supportDesc: {
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    supportButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    supportButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
