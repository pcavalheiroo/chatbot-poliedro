import { Stack, Redirect, useSegments } from 'expo-router';
import { useUser } from '../../contexts/UserContext';

export default function AdminLayout() {
  const { user } = useUser();
  const segments = useSegments();
  
  const isLoginPage = segments[segments.length - 1] === 'login';
  const isAuthenticatedAdmin = user && user.role === "admin";

  if (!isAuthenticatedAdmin && !isLoginPage) {
    return <Redirect href="/admin/login" />;
  }
  if (isAuthenticatedAdmin && isLoginPage) {
    return <Redirect href="/admin/dashboard" />;
  }
  
  return (
    <Stack screenOptions={{ headerShown: false, headerTransparent: true, contentStyle: { backgroundColor: '#f7f7f7' } }}>
      <Stack.Screen name="login" options={{ title: 'Login Admin' }} /> 
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard Admin' }} />
      <Stack.Screen name="cardapio_gerenciar" options={{ title: 'Gerenciar Cardápio' }} />
      <Stack.Screen name="pedidos_gerenciar" options={{ title: 'Gerenciar Pedidos' }} />
      <Stack.Screen name="usuarios_gerenciar" options={{ title: 'Gerenciar Usuários' }} />
    </Stack>
  );
}