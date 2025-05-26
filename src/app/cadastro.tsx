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
            const response = await axios.post(process.env.EXPO_PUBLIC_API_URL + "/usuarios/cadastro", { // Verifique o IP
                email,
                senha
            });

            if (response.status === 201) {
                alert("Cadastro realizado com sucesso!");
                router.replace("/");
            }
        } catch (err: any) {
            let errorMessage = "Erro desconhecido ao cadastrar.";
            console.error("Erro completo no cadastro:", err); // Log o erro completo para depuração

            if (axios.isAxiosError(err)) {
                if (err.response) {
                    // O servidor respondeu com um status de erro (4xx, 5xx)
                    console.error("Dados do erro do servidor:", err.response.data);
                    console.error("Status do erro do servidor:", err.response.status);
                    errorMessage = err.response.data.erro || err.response.data.message || `Erro do servidor: ${err.response.status}`;
                } else if (err.request) {
                    // A requisição foi feita, mas não houve resposta (ex: servidor offline)
                    errorMessage = "Não foi possível conectar ao servidor. Verifique se o backend está rodando e o IP está correto.";
                } else {
                    // Algo aconteceu na configuração da requisição que disparou um erro
                    errorMessage = `Erro na configuração da requisição: ${err.message}`;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            alert(errorMessage);
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