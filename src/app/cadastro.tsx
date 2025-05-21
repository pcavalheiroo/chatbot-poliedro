import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useRouter } from "expo-router";

export default function Cadastro() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const router = useRouter();

    const cadastrar = async () => {
        try {
            const res = await axios.post("http://192.168.1.107:5000/cadastrar", {
                email,
                senha,
                tipo: "usuario",
            });
            Alert.alert("Sucesso", "Conta criada com sucesso!");
            router.replace("./index");
        } catch (err) {
            Alert.alert("Erro", "Não foi possível cadastrar.");
        }
    };

    return (
        <KeyboardAvoidingView style={tw`flex-1 bg-[#f7f7f7] px-4 justify-center`} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={tw`bg-white p-6 rounded-xl shadow-lg`}>
                <Text style={tw`text-xl font-bold text-center mb-4`}>Cadastro</Text>

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={tw`border border-gray-300 rounded-lg px-4 py-2 mb-4`}
                />
                <TextInput
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    style={tw`border border-gray-300 rounded-lg px-4 py-2 mb-6`}
                />

                <TouchableOpacity style={tw`bg-green-600 p-3 rounded-lg flex-row justify-center items-center`} onPress={cadastrar}>
                    <Ionicons name="person-add-outline" size={20} color="#fff" style={tw`mr-2`} />
                    <Text style={tw`text-white font-bold`}>Cadastrar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace("./index")} style={tw`mt-4`}>
                    <Text style={tw`text-center text-blue-600`}>Já tem uma conta? Entrar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
