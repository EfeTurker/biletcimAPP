import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, useColorScheme, View } from 'react-native';

interface InputProps extends TextInputProps {
    icon?: keyof typeof Ionicons.glyphMap;
}

export function Input({ icon, style, ...props }: InputProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <View style={{ ...styles.container, backgroundColor: theme.background, borderColor: theme.border }}>
            {icon && (
                <Ionicons
                    name={icon}
                    size={20}
                    color={theme.icon}
                    style={styles.icon}
                />
            )}
            <TextInput
                placeholderTextColor={theme.icon}
                style={{
                    ...styles.input,
                    color: theme.text,
                    ...(style as object)
                }}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 16,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
});
