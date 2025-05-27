// components/MenuCategorySection.tsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import MenuItemCard from './MenuItemCard'; // Importe o componente de item

interface MenuItem {
    _id: string;
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    disponibilidade: boolean;
}

interface MenuCategorySectionProps {
    categoryName: string;
    items: MenuItem[];
}

export default function MenuCategorySection({ categoryName, items }: MenuCategorySectionProps) {
    return (
        <View key={categoryName} style={tw`w-full bg-white rounded-2xl p-6 shadow-md mb-4`}>
            <Text style={tw`text-2xl font-bold text-[#005B7F] mb-4 text-center`}>
                {categoryName}
            </Text>
            {items.map((item, index) => (
                <MenuItemCard
                    key={item._id}
                    nome={item.nome}
                    descricao={item.descricao}
                    preco={item.preco}
                    isLastItem={index === items.length - 1}
                />
            ))}
        </View>
    );
}