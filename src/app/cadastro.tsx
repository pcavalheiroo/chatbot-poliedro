import React, { useCallback, useRef, useEffect } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    Alert,
    Dimensions,
    Keyboard
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import tw from "twrnc";
import * as Animatable from 'react-native-animatable';

import AuthForm from "../components/AuthForm";
import BackgroundPoliedros from "../components/BackgroundPoliedros";
import BackButton from "../components/BackButton";
import AuthHeader from "../components/AuthHeader";
import AuthLink from "../components/AuthLink";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const { width } = Dimensions.get('window');

export default function Cadastro() {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);

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

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollToEnd({ animated: true });
                }
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => { }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const isWeb = width > 768;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            style={tw`flex-1 bg-[#f0f4ff]`}
        >
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={tw`flex-grow`}
                keyboardShouldPersistTaps="handled"
                style={tw`overflow-visible`}
            >
                <View style={tw`flex-1 bg-[#f7f7f7] relative`}>
                    <Animatable.View animation="fadeIn" duration={1200} style={tw`absolute inset-0`}>
                        <BackgroundPoliedros />
                    </Animatable.View>

                    <Animatable.View animation="fadeInLeft" duration={800} delay={200}>
                        <BackButton
                            onPress={handleGoBack}
                            color="#2a52be"
                            style={tw`top-12 ${isWeb ? 'left-8' : 'left-6'}`}
                        />
                    </Animatable.View>

                    <View style={tw`flex-1 items-center justify-center ${isWeb ? 'px-40' : 'px-8'} py-12`}>
                        <Animatable.View animation="fadeInDown" duration={800} delay={400} style={tw`${isWeb ? 'w-3/4 max-w-md' : 'w-full'}`}>
                            <AuthHeader
                                title="Crie sua conta"
                                subtitle="Cadastre-se para acessar o restaurante"
                            />
                        </Animatable.View>

                        <Animatable.View animation="zoomIn" duration={800} delay={600} style={tw`w-full bg-white rounded-2xl p-6 shadow-md mb-4 ${isWeb ? 'max-w-md' : ''}`}>
                            <AuthForm
                                isCadastro={true}
                                onSubmit={handleCadastro}
                                buttonText="Cadastrar"
                            />
                        </Animatable.View>

                        <Animatable.View animation="fadeInUp" duration={800} delay={800}>
                            <AuthLink
                                question="Já tem uma conta?"
                                linkText="Faça login"
                                onPress={() => router.replace("/")}
                            />
                        </Animatable.View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}