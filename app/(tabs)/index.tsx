import { TR_CITIES } from '@/constants/cities';
import { Colors } from '@/constants/theme';
import { useAlert } from '@/context/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router'; // Import useRouter
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, FlatList, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

const { width, height } = Dimensions.get('window');

type TransportMode = 'bus' | 'plane' | 'hotel' | 'car' | 'ferry';

export default function HomeScreen() {
  const router = useRouter(); // Initialize router
  const { showAlert } = useAlert();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light']; // theme.primary is our main Blue
  const [activeMode, setActiveMode] = useState<TransportMode>('bus');
  const [fromLocation, setFromLocation] = useState('İstanbul');
  const [toLocation, setToLocation] = useState('Ankara');

  // Date State
  const [date, setDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1))); // For Hotel Check-out
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'single' | 'checkin' | 'checkout'>('single');
  const [guests, setGuests] = useState(1);

  // City Selection Logic
  const [modalVisible, setModalVisible] = useState(false);
  const [selectionTarget, setSelectionTarget] = useState<'from' | 'to'>('from');
  const [filterText, setFilterText] = useState('');

  const openCitySelector = (target: 'from' | 'to') => {
    setSelectionTarget(target);
    setFilterText('');
    setModalVisible(true);
  };

  const handleCitySelect = (city: string) => {
    if (selectionTarget === 'from') {
      setFromLocation(city);
    } else {
      setToLocation(city);
    }
    setModalVisible(false);
  };

  const filteredCities = TR_CITIES.filter(city =>
    city.toLocaleLowerCase('tr').includes(filterText.toLocaleLowerCase('tr'))
  );

  const openDatePicker = (mode: 'single' | 'checkin' | 'checkout') => {
    setDatePickerMode(mode);
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    // On Android, the picker dismisses itself, so we need to set show to false
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'dismissed') {
      return;
    }

    if (selectedDate) {
      if (datePickerMode === 'single' || datePickerMode === 'checkin') {
        setDate(selectedDate);
        // Ensure checkout is after checkin
        if (datePickerMode === 'checkin' && selectedDate >= returnDate) {
          const newReturn = new Date(selectedDate);
          newReturn.setDate(selectedDate.getDate() + 1);
          setReturnDate(newReturn);
        }
      } else {
        setReturnDate(selectedDate);
      }
    }
  };


  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  const swapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  const renderModePill = (mode: TransportMode, icon: keyof typeof Ionicons.glyphMap, label: string) => {
    const isActive = activeMode === mode;
    return (
      <TouchableOpacity
        style={[
          styles.modePill,
          isActive && { backgroundColor: theme.primary, borderColor: theme.primary }
        ]}
        onPress={() => setActiveMode(mode)}
        activeOpacity={0.7}
      >
        <Ionicons name={icon} size={20} color={isActive ? '#fff' : '#666'} style={{ marginRight: 6 }} />
        <Text style={[styles.modeLabel, isActive ? { color: '#fff', fontWeight: 'bold' } : { color: '#666' }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Background decoration */}
      <View style={[styles.bgCircle, { backgroundColor: theme.primary + '15' }]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header / Hero */}
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: '#2E7D32', fontSize: 32 }]}>Hızlı ve Güvenli</Text>
          <Text style={[styles.welcomeText, { color: '#2E7D32', marginTop: -5 }]}>
            Ulaşım <Text style={{ color: theme.primary }}>BİLETCİM</Text>
          </Text>
        </View>

        {/* Transport Modes - Quick Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.modeContainer}
        >
          {renderModePill('bus', 'bus', 'Otobüs')}
          {renderModePill('plane', 'airplane', 'Uçak')}
          {renderModePill('hotel', 'bed', 'Otel')}

        </ScrollView>

        {/* Main Search Card */}
        <View style={styles.searchCard}>

          {/* Input Group */}
          <View style={styles.inputGroup}>
            {activeMode === 'hotel' ? (
              // Hotel Input: Single "Where" field
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>NEREDE KONAKLAYACAKSINIZ?</Text>
                <TouchableOpacity style={styles.inputField} onPress={() => openCitySelector('to')}>
                  <Ionicons name="search" size={20} color={theme.primary} />
                  <Text style={styles.inputValue}>{toLocation}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Standard Input: From / To with Swap
              <>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>NEREDEN</Text>
                  <TouchableOpacity style={styles.inputField} onPress={() => openCitySelector('from')}>
                    <Ionicons name="location-outline" size={20} color={theme.primary} />
                    <Text style={styles.inputValue}>{fromLocation}</Text>
                  </TouchableOpacity>
                </View>

                {/* Swap Button */}
                <TouchableOpacity onPress={swapLocations} style={[styles.swapButton, { borderColor: '#f0f0f0' }]}>
                  <Ionicons name="swap-vertical" size={20} color={theme.primary} />
                </TouchableOpacity>

                <View style={[styles.inputWrapper, { paddingTop: 20 }]}>
                  <Text style={styles.inputLabel}>NEREYE</Text>
                  <TouchableOpacity style={styles.inputField} onPress={() => openCitySelector('to')}>
                    <Ionicons name="location" size={20} color={theme.primary} />
                    <Text style={styles.inputValue}>{toLocation}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Date Selection */}
          <View style={styles.dateSection}>
            {activeMode === 'hotel' ? (
              // Hotel Date: Check-in / Check-out
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                <TouchableOpacity
                  style={styles.dateInfo}
                  onPress={() => openDatePicker('checkin')}
                >
                  <Text style={styles.inputLabel}>GİRİŞ TARİHİ</Text>
                  <View style={styles.dateValueRow}>
                    <Ionicons name="calendar-outline" size={20} color={theme.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.dateValue}>{formatDate(date)}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dateInfo, { paddingLeft: 20, borderLeftWidth: 1, borderLeftColor: '#f0f0f0' }]}
                  onPress={() => openDatePicker('checkout')}
                >
                  <Text style={styles.inputLabel}>ÇIKIŞ TARİHİ</Text>
                  <View style={styles.dateValueRow}>
                    <Ionicons name="calendar-outline" size={20} color={theme.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.dateValue}>{formatDate(returnDate)}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              // Standard Date: Single Date
              <>
                <TouchableOpacity
                  style={styles.dateInfo}
                  onPress={() => openDatePicker('single')}
                >
                  <Text style={styles.inputLabel}>TARİH</Text>
                  <View style={styles.dateValueRow}>
                    <Ionicons name="calendar" size={20} color={theme.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.dateValue}>{formatDate(date)}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.todayButton, { backgroundColor: theme.primary + '20' }]}
                  onPress={() => setDate(new Date())}
                >
                  <Text style={[styles.todayButtonText, { color: theme.primary }]}>Bugün</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Guest Count Selection (Hotel Only) */}
          {activeMode === 'hotel' && (
            <>
              <View style={styles.divider} />
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>MİSAFİR SAYISI</Text>
                <View style={styles.guestCounterContainer}>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => {
                      if (guests > 1) setGuests(guests - 1);
                    }}
                  >
                    <Ionicons name="remove" size={24} color={theme.primary} />
                  </TouchableOpacity>

                  <Text style={styles.guestCountText}>{guests} Kişi</Text>

                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setGuests(guests + 1)}
                  >
                    <Ionicons name="add" size={24} color={theme.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* Search Button */}
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
            activeOpacity={0.8}
            onPress={() => {
              if (activeMode === 'hotel') {
                router.push({
                  pathname: '/hotels',
                  params: {
                    city: toLocation,
                    checkIn: date.toISOString(),
                    checkOut: returnDate.toISOString(),
                    guests: guests.toString(),
                  }
                });
                return;
              }

              // Navigate to Ticket List
              router.push({
                pathname: '/tickets',
                params: {
                  from: fromLocation,
                  to: toLocation,
                  date: date.toISOString(),
                  mode: activeMode
                }
              });
            }}
          >
            <Text style={styles.searchButtonText}>
              {activeMode === 'hotel' ? 'Rezervasyon Oluştur' : 'Bilet Ara'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

        </View>

        {/* Promo / Recent */}
        <Text style={[styles.sectionTitle, { color: '#FF3B30' }]}>Size Özel Fırsatlar</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
          <View style={[styles.promoCard, { backgroundColor: '#42A5F5' }]}>
            <Text style={styles.promoTitle}>%20 İndirim</Text>
            <Text style={styles.promoDesc}>İlk uçak biletinizde</Text>
            <Ionicons name="airplane" size={60} color="rgba(255,255,255,0.3)" style={styles.promoIcon} />
          </View>

          <View style={[styles.promoCard, { backgroundColor: '#FFA726' }]}>
            <Text style={styles.promoTitle}>Otel Fırsatı</Text>
            <Text style={styles.promoDesc}>3 Gece Kal 2 Öde</Text>
            <Ionicons name="bed" size={60} color="rgba(255,255,255,0.3)" style={styles.promoIcon} />
          </View>
        </ScrollView>

      </ScrollView>

      {/* City Selection Modal */}
      <Modal
        animationType="slide"
        // transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Şehir Seçin</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Şehir Ara..."
              value={filterText}
              onChangeText={setFilterText}
              autoFocus
            />
          </View>

          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.cityItem} onPress={() => handleCitySelect(item)}>
                <Text style={styles.cityItemText}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ padding: 20 }}
          />
        </SafeAreaView>
      </Modal>

      {/* Date Picker */}
      {/* Date Picker Logic */}
      {/* Date Picker Logic */}
      {Platform.OS === 'ios' ? (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.iosDatePickerModal}>
            <View style={styles.iosDatePickerContent}>
              <View style={styles.iosDatePickerHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.iosDatePickerButton}>Vazgeç</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={[styles.iosDatePickerButton, { fontWeight: 'bold' }]}>Tamam</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={datePickerMode === 'checkout' ? returnDate : date}
                mode="date"
                display="inline"
                onChange={onDateChange}
                minimumDate={(() => {
                  const d = datePickerMode === 'checkout' ? new Date(date) : new Date();
                  d.setHours(0, 0, 0, 0);
                  return d;
                })()}
                locale="tr-TR"
              />
            </View>
          </View>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={datePickerMode === 'checkout' ? returnDate : date}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={(() => {
              const d = datePickerMode === 'checkout' ? new Date(date) : new Date();
              d.setHours(0, 0, 0, 0);
              return d;
            })()}
          />
        )
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  bgCircle: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
    top: -width * 0.9,
    left: -width * 0.25,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    opacity: 0.7,
  },
  modeContainer: {
    paddingBottom: 20,
    gap: 12,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 10,
  },
  modeLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  inputGroup: {
    position: 'relative',
  },
  inputWrapper: {
    paddingVertical: 10,
  },
  inputLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 10,
  },
  swapButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -20, // adjust based on height
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dateInfo: {
    flex: 1,
  },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#212121',
  },
  todayButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  todayButtonText: {
    fontWeight: '600',
    fontSize: 13,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  promoCard: {
    width: 280,
    height: 140,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  promoTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promoDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
  },
  promoIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 20,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 10,
  },
  modalSearchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    height: '100%',
  },
  cityItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cityItemText: {
    fontSize: 16,
    color: '#333',
  },
  iosDatePickerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  iosDatePickerContent: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  iosDatePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#FAFAFA',
  },
  iosDatePickerButton: {
    fontSize: 16,
    color: '#007AFF', // iOS Blue
  },
  guestCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  counterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  guestCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
