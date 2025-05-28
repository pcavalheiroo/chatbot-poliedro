// app/_layout.tsx
import { UserProvider, useUser } from '../contexts/UserContext';
import { Slot } from "expo-router";
import '../styles/global.css'
import { ActivityIndicator, View, Text } from 'react-native'; // Importe para tela de carregamento

// Componente Wrapper para a lógica de carregamento
function RootLayoutContent() {
  const { isLoadingUser } = useUser();

  if (isLoadingUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7' }}>
        <ActivityIndicator size="large" color="#005B7F" />
        <Text style={{ marginTop: 10, color: '#005B7F' }}>Carregando dados do usuário...</Text>
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <UserProvider>
      <RootLayoutContent />
    </UserProvider>
  );
}