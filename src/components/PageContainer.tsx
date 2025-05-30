// components/PageContainer.tsx
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native'; // Importe ViewStyle para tipagem
import tw from 'twrnc';
import BackgroundPoliedros from './BackgroundPoliedros'; // Ajuste o caminho conforme necessário

interface PageContainerProps {
    children: React.ReactNode; // O conteúdo da página (AppHeader, ScrollView, etc.)
    style?: StyleProp<ViewStyle>; // Para estilos adicionais no container principal
}

export default function PageContainer({ children, style }: PageContainerProps) {
    return (
        <View style={[tw`flex-1 bg-[#f7f7f7]`, style]}>
            {/* BackgroundPoliedros é posicionado ABSOLUTAMENTE ATRÁS de todo o conteúdo */}
            <View style={tw`absolute inset-0 z-0`}>
                <BackgroundPoliedros />
            </View>

            {/* O conteúdo da página (incluindo AppHeader) é renderizado POR CIMA */}
            {/* O z-index padrão de elementos que não são absolute/fixed é maior que o z-0 do background */}
            {children}
        </View>
    );
}