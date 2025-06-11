import { UserProvider, useUser } from '../contexts/UserContext';
import { Stack } from "expo-router";
import '../styles/global.css'
import { ActivityIndicator, View, Text } from 'react-native';

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

  return (
    <Stack screenOptions={{ headerShown: false, headerTransparent: true, contentStyle: { backgroundColor: '#f7f7f7' } }}>
      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen name="cardapio" options={{ title: 'Cardápio' }} />
      <Stack.Screen name="chatbot" options={{ title: 'Chatbot' }} />
      <Stack.Screen name="pedidos" options={{ title: 'Pedidos' }} />
      <Stack.Screen name="informaes" options={{ title: 'Info' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <RootLayoutContent />
    </UserProvider>
  );
}