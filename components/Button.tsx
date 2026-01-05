import { Colors } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, useColorScheme, ViewStyle } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({ onPress, title, variant = 'primary', isLoading, disabled, style, textStyle }: ButtonProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const backgroundColor =
        variant === 'primary' ? theme.primary :
            variant === 'secondary' ? theme.secondary :
                'transparent';

    const textColor =
        variant === 'outline' ? theme.primary :
            '#fff';

    const borderColor = variant === 'outline' ? theme.primary : 'transparent';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isLoading || disabled}
            style={{
                ...styles.container,
                backgroundColor,
                borderColor,
                borderWidth: variant === 'outline' ? 1 : 0,
                opacity: disabled ? 0.5 : 1,
                ...(style as object),
            }}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
