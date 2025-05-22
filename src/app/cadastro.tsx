// app/cadastro.tsx
import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AuthForm from "../components/AuthForm";
import tw from "twrnc";
import BackgroundPoliedros from "../components/BackgroundPoliedros";

export default function Cadastro() {
    const router = useRouter();

    const handleGoBack = () => {
        router.replace("/"); // Vai para a tela de login
    };

    const handleCadastro = async ({ email, senha }: { email: string; senha: string }) => {
        try {
            await axios.post("http://192.168.1.107:5000/usuarios/cadastro", { email, senha });
            alert("Cadastro realizado com sucesso!");
            router.replace("/");
        } catch (err) {
            console.log(err);
            alert("Erro ao cadastrar. Tente novamente.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={tw`flex-1 bg-[#f0f4ff]`}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <ScrollView
                contentContainerStyle={tw`flex-grow`}
                keyboardShouldPersistTaps="handled"
            >
                <View style={tw`flex-1 bg-[#f7f7f7] relative`}>
                    <BackgroundPoliedros />

                    {/* Botão de voltar */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={tw`absolute top-12 left-6 z-10`}
                    >
                        <Ionicons name="arrow-back" size={24} color="#2a52be" />
                    </TouchableOpacity>

                    <View style={tw`flex-1 items-center justify-center px-8 py-12`}>
                        {/* Logo e cabeçalho */}
                        <View style={tw`items-center mb-8`}>
                            <Image
                                source={require("../assets/logos/logo.jpg")}
                                style={tw`w-48 h-48 rounded-full border-4 border-white shadow-lg`}
                                resizeMode="contain"
                            />
                            <Text style={tw`text-3xl font-bold mt-9`}>Crie sua conta</Text>
                            <Text style={tw`text-lg text-center mt-3 mb-4`}>
                                Cadastre-se para acessar o restaurante
                            </Text>
                        </View>

                        {/* Formulário */}
                        <View style={tw`w-full bg-white rounded-2xl p-6 shadow-md mb-4`}>
                            <AuthForm
                                isCadastro={true}
                                onSubmit={handleCadastro}
                                buttonText="Cadastrar"
                            />
                        </View>

                        {/* Link rápido para login */}
                        <View style={tw`flex-row mt-4 mb-8`}>
                            <Text style={tw`text-gray-600`}>Já tem uma conta?</Text>
                            <TouchableOpacity onPress={() => router.replace("/")}>
                                <Text style={tw`text-[#2a52be] font-bold ml-2`}>Faça login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}