// app/admin/login.tsx
import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import tw from 'twrnc';

import AuthForm from '../../components/AuthForm'; // Ajuste o caminho se necessário
import BackgroundPoliedros from '../../components/BackgroundPoliedros'; // Ajuste o caminho
import AuthHeader from '../../components/AuthHeader'; // Ajuste o caminho
import BackButton from '../../components/BackButton'; // Ajuste o caminho
import { useUser } from '../../contexts/UserContext'; // Usaremos o mesmo contexto para o admin

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AdminLogin() {
  const router = useRouter();
  const { setUser } = useUser(); // Reutiliza o contexto de usuário, mas você pode criar um AdminContext se precisar

  const handleAdminLogin = useCallback(async ({ email, senha }: { email: string; senha: string }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admins/login`, // Rota de login do administrador
        { email, senha },
        {
          timeout: 5000,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data._id) {
        // Armazena as credenciais do admin no contexto de usuário
        // Você pode querer diferenciar entre usuário normal e admin aqui,
        // talvez adicionando um campo 'role: "admin"' ao objeto do usuário
        setUser({ id: response.data._id, email: response.data.email, role: "admin" });
        Alert.alert("Sucesso", `Bem-vindo, ${response.data.nome || 'Administrador'}!`);
        router.replace("/admin/dashboard"); // Redireciona para o dashboard do admin
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
    router.back(); // Volta para a tela anterior (login normal)
  }, [router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 bg-[#f7f7f7]`}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView contentContainerStyle={tw`flex-grow`} keyboardShouldPersistTaps="handled">
        <View style={tw`flex-1 bg-[#f7f7f7] relative`}>
          <BackgroundPoliedros />
          <BackButton
            onPress={handleGoBack}
            color="#e65100"
            style={tw`top-12`} // ou remova se quiser usar o padrão do componente
          />

          <View style={tw`flex-1 items-center justify-center px-8 py-12`}>
            <AuthHeader
              title="Acesso do Restaurante"
              subtitle="Faça login como administrador para gerenciar"
            />

            <View style={tw`w-full bg-white rounded-2xl p-6 shadow-md mb-4`}>
              <AuthForm
                isCadastro={false} // Não é para cadastro de admin aqui
                onSubmit={handleAdminLogin}
                buttonText="Entrar como Admin"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 