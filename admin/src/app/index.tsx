import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useState } from "react";

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View className="flex-1 bg-gray-200 justify-center items-center px-6">
      {/* Logo + Título */}
      <View className="absolute top-14 w-full items-center">
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-36 h-16 mb-2"
          resizeMode="contain"
        />
        <Text className="text-xl font-bold text-black">Admin</Text>
      </View>

      {/* Formulário */}
      <View className="w-full mt-24">
        <Text className="text-black font-semibold italic mb-1 ml-1">Usuário:</Text>
        <TextInput
          className="bg-white rounded-md p-3 mb-4 text-black"
          placeholder="Digite o usuário"
          placeholderTextColor="#999"
          value={usuario}
          onChangeText={setUsuario}
        />

        <Text className="text-black font-semibold italic mb-1 ml-1">Senha:</Text>
        <TextInput
          className="bg-white rounded-md p-3 mb-6 text-black"
          placeholder="Digite a senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity className="bg-cyan-600 p-3 rounded-md items-center">
          <Text className="text-white font-bold italic">Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


