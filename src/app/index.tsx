import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AuthForm from "../components/AuthForm";
import tw from "twrnc";

import BackgroundPoliedros from "../components/BackgroundPoliedros";

export default function Login() {
    const router = useRouter();

    const handleLogin = async ({ email, senha }: { email: string; senha: string }) => {
        try {
            const response = await axios.post("http://192.168.1.101:5000/usuarios/login", { email, senha }); // ipconfig no cmd
            console.log("Usuário logado:", response.data);
            router.replace("/home");
        } catch (err) {
            console.error(err);
            alert("Falha ao fazer login.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={tw`flex-1 bg-[#f7f7f7]`}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <ScrollView 
                contentContainerStyle={tw`flex-grow`}
                keyboardShouldPersistTaps="handled"
            >
                <View style={tw`flex-1 bg-[#f7f7f7] relative`}>
                    <BackgroundPoliedros />

                    <View style={tw`flex-1 items-center justify-center px-8 py-12`}>
                        {/* Logo e cabeçalho */}
                        <View style={tw`items-center mb-8`}>
                            <Image
                                source={require("../assets/logos/logo.jpg")}
                                style={tw`w-48 h-48 rounded-full border-4 border-white shadow-lg`}
                                resizeMode="contain"
                            />
                            <Text style={tw`text-3xl font-bold mt-9`}>Bem-vindo ao</Text>
                            <Text style={tw`text-3xl font-bold mb-2`}>PoliChat</Text>
                            <Text style={tw`text-lg text-center mt-3 mb-4`}>
                                Faça login para acessar o restaurante
                            </Text>
                        </View>

                        {/* Formulário */}
                        <View style={tw`w-full bg-white rounded-2xl p-6 shadow-md mb-4`}>
                            <AuthForm
                                isCadastro={false}
                                onSubmit={handleLogin}
                                buttonText="Entrar"
                            />
                        </View>

                        {/* Link rápido para cadastro */}
                        <View style={tw`flex-row mt-4 mb-8`}>
                            <Text style={tw`text-gray-600`}>É novo por aqui?</Text>
                            <TouchableOpacity onPress={() => router.replace("/cadastro")}>
                                <Text style={tw`text-[#2a52be] font-bold ml-2`}>Crie sua conta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}