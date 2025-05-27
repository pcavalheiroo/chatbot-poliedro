// components/MenuItemCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

interface MenuItemProps {
    nome: string;
    descricao: string;
    preco: number;
    isLastItem: boolean; // Para controlar a borda inferior
}

export default function MenuItemCard({ nome, descricao, preco, isLastItem }: MenuItemProps) {
    return (
        <View
            style={tw`pb-4 ${!isLastItem ? 'mb-4 border-b border-gray-200' : ''}`}
        >
            <Text style={tw`text-xl font-bold text-[#e65100] mb-1`}>{nome}</Text>
            <Text style={tw`text-sm text-gray-600 mb-2`}>{descricao}</Text>
            <Text style={tw`text-lg font-bold text-[#26c6da]`}>R$ {preco.toFixed(2)}</Text>
        </View>
    );
}