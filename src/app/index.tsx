// app/login.tsx
import React, { useCallback } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    Alert,
    Text, // Adicionei Text aqui para a mensagem "ou"
    TouchableOpacity // Adicionei TouchableOpacity para o novo botão
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import tw from "twrnc";

import AuthForm from "../components/AuthForm";
import BackgroundPoliedros from "../components/BackgroundPoliedros";
import AuthHeader from "../components/AuthHeader";
import AuthLink from "../components/AuthLink";
import { useUser } from "../contexts/UserContext";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
    const router = useRouter();
    const { setUser } = useUser();

    const handleLogin = useCallback(async ({ email, senha }: { email: string; senha: string }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/usuarios/login`,
                { email, senha },
                {
                    timeout: 5000,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.data._id) {
                setUser({ id: response.data._id, email: response.data.email });
                router.replace("/home");
            } else {
                throw new Error("Resposta inválida do servidor.");
            }
        } catch (error) {
            let errorMessage = "Falha ao fazer login.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.erro || error.response?.statusText || "Erro de rede ou servidor.";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            Alert.alert("Erro de Login", errorMessage);
            console.error("Erro no login:", error);
        }
    }, [setUser, router]);

    const handleGoToCadastro = useCallback(() => {
        router.push("/cadastro");
    }, [router]);

    // NOVA FUNÇÃO: Navegar para a tela de login do administrador
    const handleGoToAdminLogin = useCallback(() => {
        router.push("/admin/login"); // Esta rota ainda não existe, criaremos
    }, [router]);

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
                        <AuthHeader
                            title="Bem-vindo ao PoliChat"
                            subtitle="Faça login para acessar o restaurante"
                        />

                        <View style={tw`w-full bg-white rounded-2xl p-6 shadow-md mb-4`}>
                            <AuthForm
                                isCadastro={false}
                                onSubmit={handleLogin}
                                buttonText="Entrar"
                            />
                        </View>

                        <AuthLink
                            question="É novo por aqui?"
                            linkText="Crie sua conta"
                            onPress={handleGoToCadastro}
                        />

                        {/* NOVO BOTÃO/LINK PARA LOGIN DO RESTAURANTE */}
                        <View style={tw`flex-row mb-8`}>
                            <Text style={tw`text-gray-600`}>Restaurante?</Text>
                            <TouchableOpacity onPress={handleGoToAdminLogin} activeOpacity={0.7}>
                                <Text style={tw`text-[#e65100] font-bold ml-2`}>
                                    Entrar como Administrador
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}