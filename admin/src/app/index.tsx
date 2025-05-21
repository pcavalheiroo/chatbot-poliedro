import { View, ScrollView } from "react-native";
import { useState } from "react";
import { Header } from "../components/header";
import { Login } from "../components/login";
import { Background } from "../components/background";
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View className="flex-1 bg-slate-200 relative">
      <Background />

      {/* Conteúdo principal */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: statusBarHeight + 16, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <Login />
      </ScrollView>
    </View>
  );
}




