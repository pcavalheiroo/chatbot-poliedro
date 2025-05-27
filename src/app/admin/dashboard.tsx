// app/(admin)/dashboard.tsx
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import AppHeader from '../../components/AppHeader'; // Ajuste o caminho
import { useUser } from '../../contexts/UserContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair do modo administrador?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          onPress: () => {
            setUser(null); // Limpa o usuário do contexto
            router.replace("./login"); // Volta para a tela de login normal
          },
        },
      ]
    );
  }, [setUser, router]);

  return (
    <View style={tw`flex-1 bg-[#f7f7f7]`}>
      <AppHeader title="Dashboard Admin">
        <TouchableOpacity
          onPress={handleLogout}
          style={tw`absolute top-12 right-6 p-2.5 rounded-full bg-red-600`}
        >
          <Text style={tw`text-white text-xs`}>Sair</Text>
        </TouchableOpacity>
      </AppHeader>

      <View style={tw`flex-1 items-center justify-center p-4`}>
        <Text style={tw`text-3xl font-bold mb-8 text-[#005B7F]`}>Painel de Controle</Text>

        <TouchableOpacity
          style={tw`w-full bg-[#FAA41F] py-4 rounded-lg mb-4 items-center`}
          onPress={() => router.push('./admin/cardapio-gerenciar')}
        >
          <Text style={tw`text-white text-lg font-semibold`}>Gerenciar Cardápio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`w-full bg-[#EA5E3F] py-4 rounded-lg mb-4 items-center`}
          onPress={() => router.push('./admin/pedidos-gerenciar')}
        >
          <Text style={tw`text-white text-lg font-semibold`}>Gerenciar Pedidos</Text>
        </TouchableOpacity>

        {/* Adicione mais opções aqui, se desejar */}
      </View>
    </View>
  );
}