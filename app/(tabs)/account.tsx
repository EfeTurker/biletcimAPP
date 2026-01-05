
import { Colors } from '@/constants/theme';
import { CURRENCIES, useCurrency } from '@/context/CurrencyContext';
import { LANGUAGES, useLanguage } from '@/context/LanguageContext';
import { AuthService, User } from '@/services/auth';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function AccountScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [user, setUser] = useState<User | null>(null);

    // Contexts
    const { language, setLanguage, getLanguageName } = useLanguage();
    const { currency, setCurrency, getCurrencySymbol } = useCurrency();

    // Modals
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const checkUser = async () => {
                const currentUser = await AuthService.getCurrentUser();
                setUser(currentUser);
            };
            checkUser();
        }, [])
    );

    const handleLogout = async () => {
        await AuthService.logout();
        setUser(null);
        router.replace('/login');
    };

    const renderMenuItem = (title: string, icon: keyof typeof Ionicons.glyphMap, onPress?: () => void, value?: string) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuIconContainer}>
                <Ionicons name={icon} size={22} color={theme.text} />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
            </View>
            {value && <Text style={styles.menuValue}>{value}</Text>}
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header / Login Area */}
            <View style={[styles.header, { backgroundColor: theme.primary }]}>
                {user ? (
                    <View style={styles.loginCard}>
                        <View style={styles.avatarCircle}>
                            <Ionicons name="person" size={40} color={theme.primary} />
                        </View>
                        <View style={styles.loginTextContainer}>
                            <Text style={styles.loginTitle}>{user.name} {user.surname}</Text>
                            <Text style={styles.loginSubtitle}>{user.phone}</Text>
                        </View>
                        <TouchableOpacity onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.loginCard}
                        onPress={() => router.push('/login')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.avatarCircle}>
                            <Ionicons name="person" size={40} color={theme.primary} />
                        </View>
                        <View style={styles.loginTextContainer}>
                            <Text style={styles.loginTitle}>Üye Girişi Yapın</Text>
                            <Text style={styles.loginSubtitle}>Tıklayın ve giriş ekranına gidin</Text>
                        </View>
                        <Ionicons name="chevron-forward-circle" size={32} color={theme.primary} />
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <Text style={styles.sectionHeader}>Ayarlar</Text>

                <View style={styles.menuCard}>
                    {renderMenuItem('Dil Seçin', 'language', () => setLanguageModalVisible(true), getLanguageName(language))}
                    <View style={styles.divider} />
                    {renderMenuItem('Para Birimi', 'cash-outline', () => setCurrencyModalVisible(true), `${currency} (${getCurrencySymbol(currency)})`)}
                </View>

                <Text style={styles.sectionHeader}>Diğer</Text>

                <View style={styles.menuCard}>
                    {renderMenuItem('Kampanyalar', 'gift-outline', () => router.push('/(tabs)/campaigns'))}
                    <View style={styles.divider} />
                    {renderMenuItem('Hakkımızda', 'information-circle-outline', () => router.push('/about'))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Language Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={languageModalVisible}
                onRequestClose={() => setLanguageModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setLanguageModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Dil Seçin</Text>
                            <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.optionItem,
                                        language === item.code && styles.selectedOptionItem
                                    ]}
                                    onPress={() => {
                                        setLanguage(item.code);
                                        setLanguageModalVisible(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        language === item.code && styles.selectedOptionText
                                    ]}>
                                        {item.name}
                                    </Text>
                                    {language === item.code && (
                                        <Ionicons name="checkmark" size={20} color={theme.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>

            {/* Currency Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={currencyModalVisible}
                onRequestClose={() => setCurrencyModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setCurrencyModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Para Birimi Seçin</Text>
                            <TouchableOpacity onPress={() => setCurrencyModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={CURRENCIES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.optionItem,
                                        currency === item.code && styles.selectedOptionItem
                                    ]}
                                    onPress={() => {
                                        setCurrency(item.code);
                                        setCurrencyModalVisible(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        currency === item.code && styles.selectedOptionText
                                    ]}>
                                        {item.name} ({item.symbol})
                                    </Text>
                                    {currency === item.code && (
                                        <Ionicons name="checkmark" size={20} color={theme.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        paddingTop: 80,
        paddingBottom: 40,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    loginCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    loginTextContainer: {
        flex: 1,
    },
    loginTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    loginSubtitle: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    scrollContent: {
        padding: 20,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: '#888',
        marginBottom: 12,
        marginLeft: 4,
        marginTop: 12,
        textTransform: 'uppercase',
    },
    menuCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    menuIconContainer: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        color: '#333',
    },
    menuValue: {
        fontSize: 14,
        color: '#999',
        marginRight: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 60,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '100%',
        maxWidth: 340,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    selectedOptionItem: {
        backgroundColor: '#F0F9FF',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    selectedOptionText: {
        color: '#007AFF',
        fontWeight: 'bold',
    }
});
