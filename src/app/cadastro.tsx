// Cadastro.tsx (agora mais compacto)
import React, { useCallback } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    Alert
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import tw from "twrnc";

import AuthForm from "../components/AuthForm";
import BackgroundPoliedros from "../components/BackgroundPoliedros";
import BackButton from "../components/BackButton"; // Já existe
import AuthHeader from "../components/AuthHeader"; // Importa o novo componente
import AuthLink from "../components/AuthLink";     // Importa o novo componente

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Cadastro() {
    const router = useRouter();

    // Usar router.back() para tirar proveito do swipe back
    const handleGoBack = useCallback(() => {
        router.back(); // Volta para a tela anterior na pilha (geralmente Login)
    }, [router]);

    const handleCadastro = useCallback(async ({ email, senha }: { email: string; senha: string }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/usuarios/cadastro`,
                { email, senha }
            );

            if (response.status === 201) {
                Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
                router.replace("/"); // Redireciona para a tela de Login (raiz)
            }
        } catch (err: any) {
            let errorMessage = "Erro desconhecido ao cadastrar.";
            console.error("Erro completo no cadastro:", err);

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.erro || err.response?.data?.message || `Erro do servidor: ${err.response?.status || 'Desconhecido'}`;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            Alert.alert("Erro de Cadastro", errorMessage);
        }
    }, [router]); // Dependências do useCallback

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={tw`flex-1 bg-[#f0f4ff]`} // Você tinha f0f4ff aqui, mantive
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <ScrollView
                contentContainerStyle={tw`flex-grow`}
                keyboardShouldPersistTaps="handled"
                style={tw`overflow-visible`}
            >
                <View style={tw`flex-1 bg-[#f7f7f7] relative`}> {/* Alterado para f7f7f7 para consistência com Login */}
                    <BackgroundPoliedros />

                    <BackButton
                        onPress={handleGoBack}
                        color="#2a52be"
                        style={tw`top-12`}
                    />

                    <View style={tw`flex-1 items-center justify-center px-8 py-12`}>
                        {/* Logo e cabeçalho */}
                        <AuthHeader
                            title="Crie sua conta"
                            subtitle="Cadastre-se para acessar o restaurante"
                        />

                        {/* Formulário */}
                        <View style={tw`w-full bg-white rounded-2xl p-6 shadow-md mb-4`}>
                            <AuthForm
                                isCadastro={true}
                                onSubmit={handleCadastro}
                                buttonText="Cadastrar"
                            // Labels são passados dentro do AuthForm, então não precisam estar aqui.
                            // emailLabel="Email"
                            // senhaLabel="Senha"
                            // confirmarSenhaLabel="Confirmar Senha"
                            />
                        </View>

                        {/* Link rápido para login */}
                        <AuthLink
                            question="Já tem uma conta?"
                            linkText="Faça login"
                            onPress={() => router.replace("/")} // Ao fazer login, substitui a tela de cadastro
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}