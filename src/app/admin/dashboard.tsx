import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import AppHeader from '../../components/AppHeader';
import BackgroundPoliedros from '../../components/BackgroundPoliedros';
import { useUser } from '../../contexts/UserContext';
import DashboardOptionsGrid from "../../components/DashboardOptionsGrid";
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboard() {
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogout = useCallback(() => {
    Alert.alert("Sair", "Deseja sair do modo administrador?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: () => {
          setUser(null);
          router.replace("/");
        },
      },
    ]);
  }, [setUser, router]);

  return (
    <View style={tw`flex-1 bg-[#f7f7f7]`}>
      <BackgroundPoliedros />

      <AppHeader title="Painel de Controle">
        <TouchableOpacity
          onPress={handleLogout}
          style={tw`absolute top-12 right-6 p-2.5 rounded-full bg-transparent`}
        >
          <Ionicons name="log-out-outline" size={25} color="white" />
        </TouchableOpacity>
      </AppHeader>

      <View style={tw`flex-1 items-center justify-start px-8 pt-12`}>
        <Text style={tw`text-4xl font-bold mb-4 text-[#005B7F]`}>Olá, Admin!</Text>
        <Text style={tw`text-lg text-gray-700 text-center mb-8`}>
          Selecione uma opção para gerenciar o sistema.
        </Text>

        <DashboardOptionsGrid />
      </View>
    </View>
  );
}
