import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Currency = 'TRY' | 'USD' | 'EUR';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => Promise<void>;
    getCurrencySymbol: (currency: Currency) => string;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CURRENCIES: { code: Currency; symbol: string; name: string }[] = [
    { code: 'TRY', symbol: '₺', name: 'Türk Lirası' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
];

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>('TRY');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCurrency();
    }, []);

    const loadCurrency = async () => {
        try {
            const savedCurrency = await AsyncStorage.getItem('app_currency');
            if (savedCurrency) {
                setCurrencyState(savedCurrency as Currency);
            }
        } catch (error) {
            console.error('Failed to load currency', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setCurrency = async (curr: Currency) => {
        try {
            await AsyncStorage.setItem('app_currency', curr);
            setCurrencyState(curr);
        } catch (error) {
            console.error('Failed to save currency', error);
        }
    };

    const getCurrencySymbol = (curr: Currency) => {
        return CURRENCIES.find(c => c.code === curr)?.symbol || '₺';
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, getCurrencySymbol, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
