import { View, Alert, TouchableOpacity } from "react-native";
import React, { useCallback } from 'react'; 
import { useRouter } from "expo-router";
import BackButton from "../components/BackButton";
import Header from "../components/Header";
import BackgroundPoliedros from "../components/BackgroundPoliedros";
import HomeOptionsGrid from "../components/HomeOptionsGrid";
import { useUser } from "../contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

export default function Index() {
  const router = useRouter();
  const { user, setUser } = useUser(); // Acessa setUser para logout

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          onPress: () => {
            setUser(null); // Limpa o usuário do contexto e do AsyncStorage
            router.replace("/"); // Volta para a tela de login (raiz)
          },
        },
      ]
    );
  }, [setUser, router]);

  return (
    <View style={{ flex: 1 }} className="bg-[#f7f7f7] px-12 relative">

      <BackgroundPoliedros />

      <BackButton onPress={() => router.replace("/")} />

      <TouchableOpacity
        onPress={handleLogout}
        style={tw`absolute top-12 right-6 p-2.5 rounded-full bg-transparent`}
      >
        <Ionicons name="log-out-outline" size={25} color="#2a52be" />
      </TouchableOpacity>

      <Header />

      <HomeOptionsGrid />

    </View>
  );
}