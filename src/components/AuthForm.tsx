// components/AuthForm.tsx
import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";

export interface AuthFormProps {
    isCadastro?: boolean;
    onSubmit: (credentials: { email: string; senha: string }) => void;
    buttonText: string;
    emailLabel?: string;       // Adicione estas linhas
    senhaLabel?: string;       // como propriedades opcionais
    confirmarSenhaLabel?: string;
}

export default function AuthForm({
    onSubmit,
    buttonText,
    isCadastro = false,
}: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [isFocusedEmail, setIsFocusedEmail] = useState(false);
    const [isFocusedSenha, setIsFocusedSenha] = useState(false);

    return (
        <View style={tw`w-full`}>
            {/* Campo Email */}
            <View style={tw`mb-4`}>
                <TextInput
                    style={tw`border ${isFocusedEmail ? 'border-[#2a52be]' : 'border-gray-300'} p-3 rounded-lg`}
                    autoCorrect={true}
                    autoComplete="off"
                    spellCheck={true}
                    placeholder="Email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setIsFocusedEmail(true)}
                    onBlur={() => setIsFocusedEmail(false)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            {/* Campo Senha */}
            <View style={tw`mb-6`}>
                <TextInput
                    style={tw`border ${isFocusedSenha ? 'border-[#2a52be]' : 'border-gray-300'} p-3 rounded-lg`}
                    placeholder="Senha"
                    placeholderTextColor="#9ca3af"
                    value={senha}
                    onChangeText={setSenha}
                    onFocus={() => setIsFocusedSenha(true)}
                    onBlur={() => setIsFocusedSenha(false)}
                    secureTextEntry
                />
            </View>

            {/* Botão de ação */}
            <TouchableOpacity
                onPress={() => onSubmit({ email, senha })}
                style={tw`w-full bg-[#2a52be] py-3 rounded-lg`}
            >
                <Text style={tw`text-white text-center font-medium`}>{buttonText}</Text>
            </TouchableOpacity>

            {/* Texto adicional apenas para cadastro */}
            {isCadastro && (
                <Text style={tw`text-gray-500 text-xs mt-4 text-center`}>
                    Ao se cadastrar, você concorda com nossos Termos de Serviço
                </Text>
            )}
        </View>
    );
}