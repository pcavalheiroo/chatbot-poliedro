// components/PedidoCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import PedidoItemCard from './PedidoItemCard'; // Importa o novo componente

// --- Interfaces (repetidas aqui para autocontenção, ou pode importá-las de um arquivo de tipos global) ---
interface PedidoItem {
    _id: string;
    nome: string;
    preco: number;
    quantidade: number;
}

interface Pedido {
    _id: string;
    usuario_id: string;
    data_pedido: string;
    total: number;
    status: 'pendente' | 'em preparo' | 'pronto' | 'finalizado' | 'cancelado';
    itens: PedidoItem[];
}
// --- Fim das Interfaces ---

interface PedidoCardProps {
    pedido: Pedido;
}

export default function PedidoCard({ pedido }: PedidoCardProps) {
    const formattedDate = new Date(pedido.data_pedido).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const getStatusDisplay = (status: string) => {
        let color = tw`text-gray-600`;
        let iconName: keyof typeof Ionicons.glyphMap = 'information-circle-outline';

        switch (status.toLowerCase()) {
            case 'pendente':
                color = tw`text-yellow-600`;
                iconName = 'time-outline';
                break;
            case 'em preparo':
                color = tw`text-blue-600`;
                iconName = 'construct-outline';
                break;
            case 'pronto':
                color = tw`text-green-600`;
                iconName = 'checkmark-circle-outline';
                break;
            case 'finalizado':
                color = tw`text-green-800`;
                iconName = 'archive-outline';
                break;
            case 'cancelado':
                color = tw`text-red-600`;
                iconName = 'close-circle-outline';
                break;
            default:
                color = tw`text-gray-600`;
                iconName = 'help-circle-outline';
        }
        return { color, iconName };
    };

    const { color, iconName } = getStatusDisplay(pedido.status);

    return (
        <View style={tw`bg-white rounded-2xl p-6 shadow-md mb-4`}>
            {/* Cabeçalho do Pedido: ID e Data */}
            <View style={tw`flex-row justify-between items-center mb-3`}>
                <Text style={tw`text-sm text-gray-500`}>Pedido #{pedido._id.slice(-6).toUpperCase()}</Text>
                <Text style={tw`text-sm text-gray-500`}>{formattedDate}</Text>
            </View>

            {/* Status do Pedido */}
            <View style={tw`flex-row items-center mb-4`}>
                <Ionicons name={iconName} size={20} style={[color, tw`mr-2`]} />
                <Text style={[tw`text-base font-semibold`, color]}>
                    Status: {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
                </Text>
            </View>

            {/* Itens do Pedido */}
            <Text style={tw`text-lg font-bold text-gray-700 mb-2`}>Itens:</Text>
            {pedido.itens.map((item) => (
                <PedidoItemCard key={item._id} item={item} />
            ))}

            {/* Total do Pedido */}
            <View style={tw`border-t border-gray-300 mt-4 pt-3 flex-row justify-between items-center`}>
                <Text style={tw`text-xl font-bold text-[#e65100]`}>Total:</Text>
                <Text style={tw`text-2xl font-extrabold text-[#e65100]`}>
                    R$ {(pedido.total || 0).toFixed(2)}
                </Text>
            </View>
        </View>
    );
}

// Estilos adicionais para o PedidoCard, se necessário.
// Remover StyleSheet.create se todos os estilos forem twrnc.
// const styles = StyleSheet.create({});