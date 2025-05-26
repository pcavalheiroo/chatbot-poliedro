// components/AppHeader.tsx
import { Text, View } from 'react-native';
import tw from "twrnc";
import BackButton from "./BackButton";
import React from 'react'; // Importar React para o tipo React.ReactNode

interface AppHeaderProps {
    title: string;
    children?: React.ReactNode; // Adicionamos a prop children
}

export default function AppHeader({ title, children }: AppHeaderProps) {
    return (
        // O header principal deve ser a View que engloba tudo
        <View style={tw`bg-[#005B7F] p-5 pt-14 pb-4 items-center relative`}>
            {/* O BackButton é posicionado absolutamente */}
            <View style={tw`absolute top-0 left-0 z-20`}>
                <BackButton color="#fff" />
            </View>

            <Text style={tw`text-white text-xl font-bold text-center`}>
                {title}
            </Text>

            {/* Renderiza os children passados para o componente.
                Isso permite que o Chatbot.tsx adicione o botão de lixeira aqui. */}
            {children}
        </View>
    );
}