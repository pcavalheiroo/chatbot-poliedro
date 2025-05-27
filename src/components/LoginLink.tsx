// components/LoginLink.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Importe useRouter aqui
import tw from 'twrnc';

interface LoginLinkProps {
  onNavigate: () => void; // Função para navegar para o cadastro
}

export default function LoginLink({ onNavigate }: LoginLinkProps) {
  return (
    <View style={tw`flex-row mt-4 mb-8`}>
      <Text style={tw`text-gray-600`}>É novo por aqui?</Text>
      <TouchableOpacity onPress={onNavigate}>
        <Text style={tw`text-[#2a52be] font-bold ml-2`}>Crie sua conta</Text>
      </TouchableOpacity>
    </View>
  );
}