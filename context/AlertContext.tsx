import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertOptions {
    title: string;
    message: string;
    type?: AlertType;
    onClose?: () => void;
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState<AlertOptions>({ title: '', message: '' });

    const showAlert = useCallback((options: AlertOptions) => {
        setAlertConfig({ ...options, type: options.type || 'info' });
        setVisible(true);
    }, []);

    const hideAlert = useCallback(() => {
        setVisible(false);
        if (alertConfig.onClose) {
            alertConfig.onClose();
        }
    }, [alertConfig]);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <CustomAlert visible={visible} config={alertConfig} onHide={hideAlert} />
        </AlertContext.Provider>
    );
};

const CustomAlert = ({
    visible,
    config,
    onHide,
}: {
    visible: boolean;
    config: AlertOptions;
    onHide: () => void;
}) => {
    if (!visible) return null;

    const getIcon = () => {
        switch (config.type) {
            case 'success':
                return { name: 'checkmark-circle', color: '#4CAF50' };
            case 'error':
                return { name: 'alert-circle', color: '#F44336' };
            case 'warning':
                return { name: 'warning', color: '#FF9800' };
            default:
                return { name: 'information-circle', color: '#2196F3' };
        }
    };

    const iconInfo = getIcon();

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onHide}>
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <View style={[styles.iconContainer, { backgroundColor: iconInfo.color + '20' }]}>
                        <Ionicons name={iconInfo.name as any} size={32} color={iconInfo.color} />
                    </View>
                    <Text style={styles.title}>{config.title}</Text>
                    <Text style={styles.message}>{config.message}</Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: iconInfo.color }]}
                        onPress={onHide}
                    >
                        <Text style={styles.buttonText}>Tamam</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 30,
        minWidth: 120,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
