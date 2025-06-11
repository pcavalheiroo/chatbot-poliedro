import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'admin' | 'user';

interface User {
  id: string;
  email: string;
  role: UserRole;
  token?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoadingUser: boolean;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const USER_STORAGE_KEY = '@PoliChatUser';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const isValidUser = (data: any): data is User =>
    data &&
    typeof data.id === 'string' &&
    typeof data.email === 'string' &&
    (data.role === 'admin' || data.role === 'user');

  const saveUser = useCallback(async (userData: User | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
      setUserState(userData);
    } catch (e) {
      console.error('Erro ao salvar usuário:', e);
    }
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (isValidUser(parsedUser)) {
          setUserState(parsedUser);
        } else {
          console.warn('Usuário inválido no AsyncStorage. Limpando...');
          await AsyncStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Erro ao carregar usuário:', e);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await saveUser(null);
  }, [saveUser]);

  const setUser = useCallback((userData: User | null) => {
    saveUser(userData);
  }, [saveUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoadingUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
