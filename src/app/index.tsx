// app/index.tsx (Login)
import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AuthForm from "../components/AuthForm";
import tw from "twrnc";

import Header from "../components/Header";
import BackgroundPoliedros from "../components/BackgroundPoliedros";
import HomeOptionsGrid from "../components/HomeOptionsGrid";

export default function Login() {
    const router = useRouter();

    const handleLogin = async ({ email, senha }: { email: string; senha: string }) => {
        try {
            await axios.post("http://192.168.1.107:5000/login", { email, senha });
            router.replace("/home");
        } catch (err) {
            alert("Falha ao fazer login.");
        }
    };

    return (
        <View style={tw`flex-1 items-center bg-[#f7f7f7] px-12 relative`}>

            <BackgroundPoliedros />

            <Image source={require("../assets/logos/logo.jpg")} className="w-full h-36 mt-20 self-center" />
            <View className="h-px w-full mt-5 bg-gray-300" />
            <Text className="text-4xl pt-8 font-bold">Bem-vindo ao PoliChat!</Text>
            <Text className="text-xl py-3">Faça seu login para acessar o restaurante.</Text>
            <View className="h-px w-full mt-7 bg-gray-300" />

            <AuthForm
                isCadastro={false}
                onSubmit={handleLogin}
                buttonText="Entrar"
                bottomLinkText="Não tem conta? Cadastre-se"
                onBottomLinkPress={() => router.replace("/cadastro")}
            />

        </View>
    );
}