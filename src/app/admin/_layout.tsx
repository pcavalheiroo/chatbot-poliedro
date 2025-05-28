// app/admin/_layout.tsx (Versão FINAL e Recomendada)
import { Stack, Redirect, useSegments } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import { View, Text, ActivityIndicator } from 'react-native'; // Importe View, Text, ActivityIndicator

export default function AdminLayout() {
  const { user } = useUser();
  const segments = useSegments();
  
  const isLoginPage = segments[segments.length - 1] === 'login';
  const isAuthenticatedAdmin = user && user.role === "admin";

  console.log("AdminLayout: Renderizando. User:", user, "Role:", user?.role, "isAuthenticatedAdmin:", isAuthenticatedAdmin, "isLoginPage:", isLoginPage);

  // Lógica de proteção de rota:
  // Se não é um admin autenticado E a rota atual NÃO é a tela de login do admin
  if (!isAuthenticatedAdmin && !isLoginPage) {
    console.log("AdminLayout: Redirecionando para login do admin (não autenticado e não na página de login).");
    return <Redirect href="/admin/login" />;
  }

  // Se o usuário está na página de login do admin E está autenticado como admin
  if (isAuthenticatedAdmin && isLoginPage) {
    console.log("AdminLayout: Admin já autenticado na página de login. Redirecionando para dashboard.");
    return <Redirect href="/admin/dashboard" />;
  }
  
  // Se você está aqui, significa que:
  // 1. É um admin autenticado (e não está na página de login).
  // 2. Ou é a página de login do admin (onde a autenticação deve ocorrer).

  return (
    <Stack screenOptions={{ 
        headerShown: false, 
        headerTransparent: true,
        contentStyle: { backgroundColor: '#f7f7f7' } 
    }}>
      {/* LISTE TODAS AS TELAS QUE ESTÃO DIRETAMENTE NA PASTA 'admin/' AQUI */}
      {/* A ORDEM DAS TELAS IMPORTA PARA QUEM É A ROTA PADRÃO (se nenhuma for definida no app.json) */}
      <Stack.Screen name="login" options={{ title: 'Login Admin' }} /> 
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard Admin' }} />
      <Stack.Screen name="cardapio-gerenciar" options={{ title: 'Gerenciar Cardápio' }} />
      <Stack.Screen name="pedidos-gerenciar" options={{ title: 'Gerenciar Pedidos' }} />
      {/* Adicione outras telas de gerenciamento aqui quando criá-las */}
    </Stack>
  );
}