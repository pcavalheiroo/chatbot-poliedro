import { View, Alert } from "react-native";
import React, { useCallback } from "react";
import { useRouter } from "expo-router";
import BackButton from "../components/BackButton";
import Header from "../components/Header";
import BackgroundPoliedros from "../components/BackgroundPoliedros";
import HomeOptionsGrid from "../components/HomeOptionsGrid";
import { useUser } from "../contexts/UserContext";
import LogoutButton from "../components/LogoutButton";
import tw from "twrnc";
import * as Animatable from "react-native-animatable";

export default function Index() {
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          onPress: () => {
            setUser(null);
            router.replace("/");
          },
        },
      ]
    );
  }, [setUser, router]);

  return (
    <View style={tw`flex-1 bg-[#f7f7f7] relative`}>
      <BackgroundPoliedros />
      <BackButton onPress={() => router.replace("/")} />
      <LogoutButton onPress={handleLogout} />

      <View style={tw`flex-1 px-12`}>
        <Animatable.View animation="fadeInDown" duration={800} delay={300}>
          <Header />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={500}>
          <HomeOptionsGrid />
        </Animatable.View>
      </View>
    </View>
  );
}
