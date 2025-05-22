import { View, ScrollView,Image } from "react-native";
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
    <View className="flex-1 bg-slate-200">
      <ScrollView style = {{marginTop: '10%'}}>
        <Header />
        <Login />
        <Background/>
      </ScrollView>
    </View>
  );
}




