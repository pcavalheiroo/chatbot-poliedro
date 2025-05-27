// components/PedidoItemCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

interface PedidoItem {
    _id: string;
    nome: string;
    preco: number;
    quantidade: number;
}

interface PedidoItemCardProps {
    item: PedidoItem;
}

export default function PedidoItemCard({ item }: PedidoItemCardProps) {
    return (
        <View key={item._id} style={tw`flex-row justify-between items-center mb-1 pl-2`}>
            <Text style={tw`text-base text-gray-700`}>{item.quantidade}x {item.nome}</Text>
            <Text style={tw`text-base font-semibold text-gray-800`}>
                R$ {((item.preco || 0) * (item.quantidade || 0)).toFixed(2)}
            </Text>
        </View>
    );
}