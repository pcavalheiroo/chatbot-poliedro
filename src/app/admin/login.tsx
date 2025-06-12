import React, { useCallback, useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Alert,
  Keyboard,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import tw from 'twrnc';
import * as Animatable from 'react-native-animatable';

import AuthForm from '../../components/AuthForm';
import BackgroundPoliedros from '../../components/BackgroundPoliedros';
import AuthHeader from '../../components/AuthHeader';
import BackButton from '../../components/BackButton';
import { useUser } from '../../contexts/UserContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const { width } = Dimensions.get('window');

const AUTH_FORM_HEIGHT_ADMIN_LOGIN = 250;
const KEYBOARD_VERTICAL_OFFSET_ADMIN = Platform.OS === "ios" ? -AUTH_FORM_HEIGHT_ADMIN_LOGIN / 2 : 0;

export default function AdminLogin() {
  const router = useRouter();
  const { setUser } = useUser();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleAdminLogin = useCallback(async ({ email, senha }: { email: string; senha: string }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admins/login`,
        { email, senha },
        { timeout: 5000, headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data._id) {
        setUser({ id: response.data._id, email: response.data.email, role: "admin" });
        Alert.alert("Sucesso", `Bem-vindo, ${response.data.nome || 'Administrador'}!`);
        router.replace("/admin/dashboard");
      } else {
        throw new Error("Resposta inválida do servidor.");
      }
    } catch (error) {
      let errorMessage = "Falha ao fazer login como administrador.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.erro || error.response?.statusText || "Erro de rede ou servidor.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert("Erro de Login", errorMessage);
      console.error("Erro no login do admin:", error);
    }
  }, [setUser, router]);

  const handleGoBack = useCallback(() => {
    router.back();
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
      keyboardVerticalOffset={Platform.OS === "ios" ? KEYBOARD_VERTICAL_OFFSET_ADMIN : 0}
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
          <Animatable.View animation="fadeInLeft" duration={800} delay={200}>
            <BackButton
              onPress={handleGoBack}
              color="#e65100"
              style={tw`top-12 ${isWeb ? 'left-8' : 'left-6'}`}
            />
          </Animatable.View>

          <View style={tw`flex-1 items-center justify-center ${isWeb ? 'px-40' : 'px-8'} py-12`}>
            <Animatable.View animation="fadeInDown" duration={800} delay={400} style={tw`${isWeb ? 'w-3/4 max-w-md' : 'w-full'}`}>
              <AuthHeader
                title="Acesso do Restaurante"
                subtitle="Faça login como administrador para gerenciar"
              />
            </Animatable.View>

            <Animatable.View animation="zoomIn" duration={800} delay={600} style={tw`w-full bg-white rounded-2xl p-6 shadow-md mb-4 ${isWeb ? 'max-w-md' : ''}`}>
              <AuthForm
                isCadastro={false}
                onSubmit={handleAdminLogin}
                buttonText="Entrar como Admin"
              />
            </Animatable.View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}