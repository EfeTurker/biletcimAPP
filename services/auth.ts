import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
    name: string;
    surname: string;
    gender: 'male' | 'female';
    tcNumber: string;
    phone: string;
    email: string;
    password: string;
}

const USERS_KEY = 'USERS_DATA';
const CURRENT_USER_KEY = 'CURRENT_USER';

export const AuthService = {
    // Register a new user
    register: async (user: User): Promise<{ success: boolean; message: string }> => {
        try {
            const existingUsersJson = await AsyncStorage.getItem(USERS_KEY);
            const existingUsers: User[] = existingUsersJson ? JSON.parse(existingUsersJson) : [];

            // Check for duplicates
            const duplicate = existingUsers.find(
                (u) => u.email === user.email || u.tcNumber === user.tcNumber || u.phone === user.phone
            );

            if (duplicate) {
                return { success: false, message: 'Aynı bilgilere ait kullanıcı var' };
            }

            const newUsers = [...existingUsers, user];
            await AsyncStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
            return { success: true, message: 'Kayıt Başarılı!' };
        } catch (error) {
            return { success: false, message: 'Kayıt sırasında bir hata oluştu.' };
        }
    },

    // Login user
    login: async (identifier: string, password: string): Promise<{ success: boolean; user?: User; message: string }> => {
        try {
            const existingUsersJson = await AsyncStorage.getItem(USERS_KEY);
            const existingUsers: User[] = existingUsersJson ? JSON.parse(existingUsersJson) : [];

            // Check credentials (identifier can be email or phone)
            const user = existingUsers.find(
                (u) => (u.email === identifier || u.phone === identifier) && u.password === password
            );

            if (user) {
                await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
                return { success: true, user, message: 'Giriş Başarılı' };
            }

            return { success: false, message: 'Hatalı kullanıcı bilgileri veya şifre' };
        } catch (error) {
            return { success: false, message: 'Giriş sırasında bir hata oluştu.' };
        }
    },

    // Get current logged in user
    getCurrentUser: async (): Promise<User | null> => {
        try {
            const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
            return userJson ? JSON.parse(userJson) : null;
        } catch {
            return null;
        }
    },

    // Logout
    logout: async () => {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
    }
};
