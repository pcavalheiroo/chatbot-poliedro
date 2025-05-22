import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View className="flex justify-center items-center">
      <View className="w-4/5" style={{marginTop: '30%'}}>
        {/* Usuário */}
        <Text className="text-black font-semibold italic mb-1 ml-1" style = {{fontSize: 15}}>Usuário:</Text>
        <TextInput
          className="bg-white rounded-md p-5 mb-4 text-black"
          placeholder="Digite o usuário"
          placeholderTextColor="#999"
          value={usuario}
          onChangeText={setUsuario}
        />

        {/* Senha */}
        <Text className="text-black font-semibold italic mb-1 ml-1" style = {{fontSize: 15}}>Senha:</Text>
        <TextInput
          className="bg-white rounded-md p-5 mb-10 text-black"
          placeholder="Digite a senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {/* Botão */}
        <TouchableOpacity className="bg-cyan-600 p-5 rounded-md items-center">
          <Text className="text-white font-bold italic" style = {{fontSize: 18}}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


