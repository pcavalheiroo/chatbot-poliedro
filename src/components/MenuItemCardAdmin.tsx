// components/MenuItemCardAdmin.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface MenuItemAdminProps {
    item: {
        _id: string;
        nome: string;
        preco: number;
        categoria: string;
        descricao: string;
        disponibilidade: boolean;
    };
    onEdit: (item: any) => void; // Callback para editar
    onDelete: (itemId: string, itemName: string) => void; // Callback para excluir
    onToggleAvailability: (itemId: string, currentAvailability: boolean) => void; // Callback para alternar disponibilidade
}

export default function MenuItemCardAdmin({ item, onEdit, onDelete, onToggleAvailability }: MenuItemAdminProps) {
    const handleDelete = () => {
        onDelete(item._id, item.nome);
    };

    const handleToggle = () => {
        onToggleAvailability(item._id, item.disponibilidade);
    };

    return (
        <View style={tw`bg-white p-4 m-2 rounded-lg shadow-md`}>
            {/* Cabeçalho do Item e ID */}
            <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-lg font-bold text-[#005B7F]`}>{item.nome}</Text>
                <Text style={tw`text-xs text-gray-400`}>ID: {item._id.slice(-6).toUpperCase()}</Text>
            </View>

            {/* Descrição e Preço */}
            <Text style={tw`text-sm text-gray-600 mb-2`}>{item.descricao}</Text>
            <Text style={tw`text-base font-semibold text-[#E65100]`}>R$ {item.preco.toFixed(2)}</Text>
            <Text style={tw`text-xs text-gray-500 mt-1`}>Categoria: {item.categoria}</Text>

            {/* Controles: Disponibilidade, Editar, Excluir */}
            <View style={tw`flex-row justify-between items-center mt-4 pt-3 border-t border-gray-200`}>
                {/* Toggle de Disponibilidade */}
                <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-sm text-gray-700 mr-2`}>Disponível:</Text>
                    <Switch
                        trackColor={{ false: "#ccc", true: "#81b0ff" }}
                        thumbColor={item.disponibilidade ? "#005B7F" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={handleToggle}
                        value={item.disponibilidade}
                    />
                </View>

                {/* Botões de Ação */}
                <View style={tw`flex-row`}>
                    <TouchableOpacity onPress={() => onEdit(item)} style={tw`p-2`}>
                        <Ionicons name="pencil-outline" size={24} color={tw.color('blue-500')!} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} style={tw`p-2 ml-2`}>
                        <Ionicons name="trash-outline" size={24} color={tw.color('red-500')!} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}