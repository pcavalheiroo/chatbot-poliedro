import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AuthForm from "../components/AuthForm";
import tw from "twrnc";
import BackgroundPoliedros from "../components/BackgroundPoliedros";
import BackButton from "../components/BackButton";

export default function Cadastro() {
    const router = useRouter();

    const handleGoBack = () => {
        router.replace("/");
    };

    const handleCadastro = async ({ email, senha }: { email: string; senha: string }) => {
        try {
            const response = await axios.post("http://192.168.1.101:5000/usuarios/cadastro", {
                email,
                senha
            });

            if (response.status === 201) {
                alert("Cadastro realizado com sucesso!");
                router.replace("/");
            }
        } catch (err: any) {
            console.error("Erro no cadastro:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Erro ao cadastrar. Tente novamente.");
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
                        {/* Logo e cabeçalho */}
                        <View style={tw`items-center mb-8`}>
                            <Image
                                source={require("../assets/logos/logo.jpg")}
                                style={tw`w-48 h-48 rounded-full border-4 border-white shadow-lg`}
                                resizeMode="contain"
                            />
                            <Text style={tw`text-3xl font-bold mt-9`}>
                                Crie sua conta
                            </Text>
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
                                emailLabel="Email"
                                senhaLabel="Senha"
                                confirmarSenhaLabel="Confirmar Senha"
                            />
                        </View>

                        {/* Link rápido para login */}
                        <View style={tw`flex-row mt-4 mb-8`}>
                            <Text style={tw`text-gray-600`}>Já tem uma conta?</Text>
                            <TouchableOpacity
                                onPress={() => router.replace("/")}
                                activeOpacity={0.7}
                            >
                                <Text style={tw`text-[#2a52be] font-bold ml-2`}>
                                    Faça login
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}