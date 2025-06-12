import React, { useCallback, useEffect, useRef } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    Alert,
    Text,
    TouchableOpacity,
    Keyboard,
    Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import tw from "twrnc";

import AuthForm from "../components/AuthForm";
import BackgroundPoliedros from "../components/BackgroundPoliedros";
import AuthHeader from "../components/AuthHeader";
import AuthLink from "../components/AuthLink";
import { useUser } from "../contexts/UserContext";
import * as Animatable from 'react-native-animatable';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const { width } = Dimensions.get('window');

export default function Login() {
    const router = useRouter();
    const { setUser } = useUser();
    const scrollViewRef = useRef<ScrollView>(null);

    const AUTH_FORM_HEIGHT = 250;
    const KEYBOARD_VERTICAL_OFFSET = Platform.OS === "ios" ? -AUTH_FORM_HEIGHT / 2 : 0;

    const handleLogin = useCallback(async ({ email, senha }: { email: string; senha: string }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/usuarios/login`,
                { email, senha },
                { timeout: 5000, headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data._id) {
                setUser({ id: response.data._id, email: response.data.email, role: "user" });
                router.push("/home");
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

    const handleGoToAdminLogin = useCallback(() => {
        router.push("/admin/login");
    }, [router]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollToEnd({ animated: true });
                }
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
            }
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
            style={tw`flex-1 bg-[#f7f7f7]`}
            keyboardVerticalOffset={Platform.OS === "ios" ? KEYBOARD_VERTICAL_OFFSET : 0}
        >
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={tw`flex-grow`}
                keyboardShouldPersistTaps="handled"
            >
                <View style={tw`flex-1 bg-[#f7f7f7] relative`}>
                    <Animatable.View animation="fadeIn" duration={1200} style={tw`absolute inset-0`}>
                        <BackgroundPoliedros />
                    </Animatable.View>

                    <View style={tw`flex-1 items-center justify-center ${isWeb ? 'px-40' : 'px-8'} py-12`}>
                        <Animatable.View animation="fadeInDown" duration={800} style={tw`${isWeb ? 'w-3/4 max-w-md' : 'w-full'}`}>
                            <AuthHeader
                                title="Bem-vindo ao PoliChat"
                                subtitle="Faça login para acessar o restaurante"
                            />
                        </Animatable.View>

                        <View style={tw`w-full mb-4 ${isWeb ? 'max-w-md' : ''}`}>
                            <Animatable.View
                                animation="fadeInUpBig"
                                duration={800}
                                delay={200}
                                style={tw`bg-white rounded-2xl p-6 shadow-md`}
                            >
                                <AuthForm
                                    isCadastro={false}
                                    onSubmit={handleLogin}
                                    buttonText="Entrar"
                                />
                            </Animatable.View>
                        </View>

                        <Animatable.View animation="fadeInLeft" duration={600} delay={700}>
                            <AuthLink
                                question="É novo por aqui?"
                                linkText="Crie sua conta"
                                onPress={handleGoToCadastro}
                            />
                        </Animatable.View>

                        <Animatable.View animation="fadeInRight" duration={600} delay={800}>
                            <View style={tw`flex-row mb-8`}>
                                <Text style={tw`text-gray-600`}>Restaurante?</Text>
                                <TouchableOpacity onPress={handleGoToAdminLogin} activeOpacity={0.7}>
                                    <Text style={tw`text-[#e65100] font-bold ml-2`}>
                                        Entrar como Administrador
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Animatable.View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}