// contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Defina tipos mais precisos
type UserRole = 'admin' | 'user';

interface User {
  id: string;
  email: string;
  role: UserRole; // Tornado obrigatório
  token?: string; // Adicionado para armazenar token JWT se necessário
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoadingUser: boolean;
  logout: () => Promise<void>; // Adicionado método explícito para logout
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const USER_STORAGE_KEY = '@PoliChatUser';

  // Função para validar o usuário recuperado do storage
  const isValidUser = (userData: any): userData is User => {
    return (
      userData &&
      typeof userData.id === 'string' &&
      typeof userData.email === 'string' &&
      (userData.role === 'admin' || userData.role === 'user')
    );
  };

  const saveUser = async (userData: User | null) => {
    try {
      if (userData) {
        if (!isValidUser(userData)) {
          throw new Error('Invalid user data format');
        }
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
      setUserState(userData);
    } catch (e) {
      console.error('AsyncStorage error:', e);
      // Não lançar erro para não quebrar o app, apenas logar
    }
  };

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (isValidUser(parsedUser)) {
          setUserState(parsedUser);
        } else {
          console.warn('Invalid user data in storage, clearing...');
          await AsyncStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Failed to load user:', e);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const logout = useCallback(async () => {
    await saveUser(null);
  }, []);

  const setUser = useCallback((userData: User | null) => {
    saveUser(userData);
  }, []);

  useEffect(() => {
    loadUser();
  }, []);

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