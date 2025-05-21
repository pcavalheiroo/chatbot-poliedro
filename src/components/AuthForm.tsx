import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

interface AuthFormProps {
    isCadastro?: boolean;
    onSubmit: (data: { nome?: string; email: string; matricula?: string; senha: string }) => void;
    buttonText: string;
    bottomLinkText: string;
    onBottomLinkPress: () => void;
}

export default function AuthForm({
    isCadastro = false,
    onSubmit,
    buttonText,
    bottomLinkText,
    onBottomLinkPress
}: AuthFormProps) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [matricula, setMatricula] = useState("");

    const gerarSenha = () => {
        const primeiroNome = nome.trim().split(" ")[0].toLowerCase();
        return `${primeiroNome}${matricula}`;
    };

    const handleSubmit = () => {
        if (isCadastro) {
            if (!nome || !email || !matricula) {
                Alert.alert("Erro", "Preencha todos os campos.");
                return;
            }
            const senha = gerarSenha();
            onSubmit({ nome, email, matricula, senha });
        } else {
            if (!email || !matricula) {
                Alert.alert("Erro", "Preencha todos os campos.");
                return;
            }
            const senha = gerarSenha(); // mesma lógica para login
            onSubmit({ email, senha });
        }
    };

    return (
        <KeyboardAvoidingView
            style={tw`flex-1 bg-[#f7f7f7] justify-center`}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={tw`bg-white p-6 rounded-xl shadow-lg`}>
                <Text style={tw`text-xl font-bold text-center mb-4`}>
                    {isCadastro ? "Cadastro" : "Login"}
                </Text>

                {isCadastro && (
                    <>
                        <TextInput
                            placeholder="Nome completo"
                            value={nome}
                            onChangeText={setNome}
                            style={tw`border border-gray-300 rounded-lg px-4 py-2 mb-4`}
                        />
                    </>
                )}

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={tw`border border-gray-300 rounded-lg px-4 py-2 mb-4`}
                />

                <TextInput
                    placeholder="Matrícula"
                    value={matricula}
                    onChangeText={setMatricula}
                    style={tw`border border-gray-300 rounded-lg px-4 py-2 mb-6`}
                />

                <TouchableOpacity
                    style={tw`bg-blue-600 p-3 rounded-lg flex-row justify-center items-center`}
                    onPress={handleSubmit}
                >
                    <Ionicons name={isCadastro ? "person-add-outline" : "log-in-outline"} size={20} color="#fff" style={tw`mr-2`} />
                    <Text style={tw`text-white font-bold`}>{buttonText}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onBottomLinkPress} style={tw`mt-4`}>
                    <Text style={tw`text-center text-blue-600`}>{bottomLinkText}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
