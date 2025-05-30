// components/PedidoCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import PedidoItemCard from './PedidoItemCard';
import moment from 'moment';
import 'moment/locale/pt-br'; 

moment.locale('pt-br'); 

// Interfaces
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
    status: 'em preparo' | 'pronto' | 'cancelado';
    itens: PedidoItem[];
}

interface PedidoCardProps {
    pedido: Pedido;
}

export default function PedidoCard({ pedido }: PedidoCardProps) {
    const formattedDateTime = moment(pedido.data_pedido).format('DD/MM/YYYY HH:mm');

    const getStatusDisplay = (status: string) => {
        let color = '#4B5563'; // text-gray-600
        let iconName: keyof typeof Ionicons.glyphMap = 'information-circle-outline';

        switch (status.toLowerCase()) {
            case 'em preparo':
                color = '#FAA41F'; // text-blue-600
                iconName = 'construct-outline';
                break;
            case 'pronto':
                color = '#32973D'; // text-green-600
                iconName = 'checkmark-circle-outline';
                break;
            case 'cancelado':
                color = '#DC2626'; // text-red-600
                iconName = 'close-circle-outline';
                break;
            default:
                color = '#4B5563';
                iconName = 'help-circle-outline';
        }

        return { color, iconName };
    };

    const { color, iconName } = getStatusDisplay(pedido.status);

    return (
        <View style={tw`bg-white rounded-2xl p-6 shadow-md mb-4`}>
            {/* Cabeçalho do Pedido */}
            <View style={tw`flex-row justify-between items-center mb-3`}>
                <Text style={tw`text-sm text-gray-500`}>
                    Pedido #{pedido._id.slice(-6).toUpperCase()}
                </Text>
                <Text style={tw`text-sm text-gray-500`}>{formattedDateTime}</Text>
            </View>

            {/* Status do Pedido */}
            <View style={tw`flex-row items-center mb-4`}>
                <Ionicons name={iconName} size={20} color={color} style={tw`mr-2`} />
                <Text style={[tw`text-base font-semibold`, { color }]}>
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
''