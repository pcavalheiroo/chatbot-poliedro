// contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe AsyncStorage

interface User {
  id: string;
  email: string;
  role?: string; // Mantido para admins, pode ser 'user' para usuários comuns
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoadingUser: boolean; // Novo estado para indicar se o usuário está sendo carregado
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Inicialmente verdadeiro

  // Chave para armazenar o usuário no AsyncStorage
  const USER_STORAGE_KEY = '@PoliChatUser';

  // Função para salvar o usuário no AsyncStorage
  const saveUser = async (userData: User | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        console.log('User saved to AsyncStorage:', userData.email);
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
        console.log('User removed from AsyncStorage.');
      }
      setUserState(userData); // Atualiza o estado do React
    } catch (e) {
      console.error('Failed to save/remove user from AsyncStorage:', e);
    }
  };

  // Função para carregar o usuário do AsyncStorage ao iniciar o app
  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const userData: User = JSON.parse(storedUser);
        setUserState(userData); // Atualiza o estado do React
        console.log('User loaded from AsyncStorage:', userData.email);
      } else {
        console.log('No user found in AsyncStorage.');
      }
    } catch (e) {
      console.error('Failed to load user from AsyncStorage:', e);
    } finally {
      setIsLoadingUser(false); // Marca como carregado, independentemente do resultado
    }
  };

  // Carrega o usuário uma vez ao montar o UserProvider
  useEffect(() => {
    loadUser();
  }, []); // Array de dependências vazio para rodar apenas na montagem

  // Expondo setUser como saveUser para sempre persistir
  const setUser = useCallback((userData: User | null) => {
    saveUser(userData);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoadingUser }}>
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