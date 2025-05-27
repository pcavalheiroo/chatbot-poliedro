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
import BackButton from "../components/BackButton";
import AuthHeader from "../components/AuthHeader";
import AuthLink from "../components/AuthLink";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Cadastro() {
    const router = useRouter();

    const handleGoBack = useCallback(() => {
        router.back();
    }, [router]);

    const handleCadastro = useCallback(async ({ email, senha }: { email: string; senha: string }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/usuarios/cadastro`, { email, senha });
            if (response.status === 201) {
                Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
                router.replace("/");
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
    }, [router]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            style={tw`flex-1 bg-[#f0f4ff]`}
        >
            <ScrollView
                contentContainerStyle={tw`flex-grow`}
                keyboardShouldPersistTaps="handled"
                style={tw`overflow-visible`}
            >
                <View style={tw`flex-1 bg-[#f7f7f7] relative`}>
                    <BackgroundPoliedros />

                    <BackButton
                        onPress={handleGoBack}
                        color="#2a52be"
                        style={tw`top-12`}
                    />

                    <View style={tw`flex-1 items-center justify-center px-8 py-12`}>
                        <AuthHeader
                            title="Crie sua conta"
                            subtitle="Cadastre-se para acessar o restaurante"
                        />

                        <View style={tw`w-full bg-white rounded-2xl p-6 shadow-md mb-4`}>
                            <AuthForm
                                isCadastro={true}
                                onSubmit={handleCadastro}
                                buttonText="Cadastrar"
                            />
                        </View>

                        <AuthLink
                            question="Já tem uma conta?"
                            linkText="Faça login"
                            onPress={() => router.replace("/")}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
