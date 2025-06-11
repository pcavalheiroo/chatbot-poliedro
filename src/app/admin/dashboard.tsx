import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";
import AppHeader from "../../components/AppHeader";
import BackgroundPoliedros from "../../components/BackgroundPoliedros";
import { useUser } from "../../contexts/UserContext";
import DashboardOptionsGrid from "../../components/DashboardOptionsGrid";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

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

      {/* Cabeçalho */}
      <Animatable.View animation="slideInDown" duration={700}>
        <AppHeader title="Painel de Controle">
          <Animatable.View animation="fadeInRight" duration={700} delay={200}>
            <TouchableOpacity
              onPress={handleLogout}
              style={tw`absolute top-12 right-6 p-2.5 rounded-full bg-transparent`}
            >
              <Ionicons name="log-out-outline" size={25} color="white" />
            </TouchableOpacity>
          </Animatable.View>
        </AppHeader>
      </Animatable.View>

      {/* Logo */}
      <Animatable.Image
        animation="zoomIn"
        duration={800}
        delay={300}
        source={require("../../assets/logos/logo.jpg")}
        style={tw`w-48 h-48 mt-6 self-center rounded-full border-4 border-white shadow-lg`}
        resizeMode="contain"
      />

      {/* Textos e grid */}
      <Animatable.View
        animation="fadeInUp"
        duration={700}
        delay={500}
        style={tw`flex-1 items-center justify-start px-8 pt-6`}
      >
        <Text style={tw`text-3xl font-bold`}>Olá, Admin!</Text>
        <Text style={tw`text-lg text-center mt-3 mb-7`}>
          Selecione uma opção para gerenciar o sistema.
        </Text>

        <Animatable.View animation="bounceInUp" delay={600}>
          <DashboardOptionsGrid />
        </Animatable.View>
      </Animatable.View>
    </View>
  );
}
