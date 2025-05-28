// components/PedidoAdminCard.tsx
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'moment/locale/pt-br'; // Importe o locale português

moment.locale('pt-br'); // Define o locale padrão para português

interface PedidoItem {
    _id: string;
    nome: string;
    preco: number;
    quantidade: number;
}

interface PedidoAdmin {
    _id: string;
    usuario_id: string;
    usuario_info: { nome: string; id: string }; // Adicionado info do usuário
    data_pedido: string; // String ISO de data
    total: number;
    status: 'pendente' | 'em preparo' | 'pronto' | 'finalizado' | 'cancelado';
    itens: PedidoItem[];
}

interface PedidoAdminCardProps {
    pedido: PedidoAdmin;
    onUpdateStatus: (pedidoId: string, newStatus: string) => void;
    onDeletePedido: (pedidoId: string, clienteNome: string) => void;
}

export default function PedidoAdminCard({ pedido, onUpdateStatus, onDeletePedido }: PedidoAdminCardProps) {
    // Helper para obter cor e ícone do status
    const getStatusDisplay = useCallback((status: string) => {
        let color = tw`text-gray-600`;
        let iconName: keyof typeof Ionicons.glyphMap = 'information-circle-outline';

        switch (status.toLowerCase()) {
            case 'em preparo':
                color = tw`text-[#FAA41F]`;
                iconName = 'construct-outline';
                break;
            case 'pronto':
                color = tw`text-[#32973D]`;
                iconName = 'checkmark-circle-outline';
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
    }, []);

    const { color, iconName } = getStatusDisplay(pedido.status);

    // Formatação da data usando Moment.js para melhor controle de locale
    const formattedDateTime = moment(pedido.data_pedido).format('DD/MM HH:mm');

    // Lista de status para botões de atualização
    const statusOptions = ['em preparo', 'pronto', 'cancelado'];

    return (
        <View style={tw`bg-white p-6 m-2 rounded-lg shadow-md`}>
            {/* Cabeçalho do Pedido: ID e Data/Hora */}
            <View style={tw`flex-row justify-between items-center mb-3 border-b pb-2 border-gray-200`}>
                <Text style={tw`text-base font-semibold text-gray-800`}>Pedido # {pedido._id.slice(-6).toUpperCase()}</Text>
                <Text style={tw`text-sm text-gray-500`}>{formattedDateTime}</Text>
            </View>

            {/* Informações do Cliente */}
            <View style={tw`flex-row items-center mb-2`}>
                <Ionicons name="person-circle-outline" size={20} color={tw.color('gray-600')!} style={tw`mr-1`} />
                <Text style={tw`text-base text-gray-700`}>
                    Cliente: <Text style={tw`font-bold`}>{pedido.usuario_info.nome || pedido.usuario_info.id.slice(-8)}</Text>
                </Text>
            </View>

            {/* Status Atual do Pedido */}
            <View style={tw`flex-row items-center mb-3`}>
                <Ionicons name={iconName} size={20} style={[color, tw`mr-1`]} />
                <Text style={[tw`text-base font-semibold`, color]}>
                    Status: {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
                </Text>
            </View>

            {/* Itens do Pedido */}
            <Text style={tw`text-base font-bold text-gray-700 mb-2`}>Itens:</Text>
            {pedido.itens.length > 0 ? (
                pedido.itens.map((item, index) => (
                    <View key={item._id || index} style={tw`flex-row justify-between items-center mb-1 pl-2`}>
                        <Text style={tw`text-sm text-gray-700`}>{item.quantidade}x {item.nome}</Text>
                        <Text style={tw`text-sm font-semibold text-gray-800`}>
                            R$ {((item.preco || 0) * (item.quantidade || 0)).toFixed(2)}
                        </Text>
                    </View>
                ))
            ) : (
                <Text style={tw`text-sm text-gray-500 pl-2`}>Nenhum item listado.</Text>
            )}

            {/* Total do Pedido */}
            <View style={tw`border-t border-gray-200 mt-4 pt-3 flex-row justify-between items-center`}>
                <Text style={tw`text-lg font-bold text-[#e65100]`}>Total:</Text>
                <Text style={tw`text-xl font-extrabold text-[#e65100]`}>
                    R$ {(pedido.total || 0).toFixed(2)}
                </Text>
            </View>

            {/* Botões de Ação para Admin */}
            <View style={tw`flex-row flex-wrap justify-center mt-4 pt-3 border-t border-gray-200`}>
                {statusOptions.map(status => (
                    <TouchableOpacity
                        key={status}
                        onPress={() => onUpdateStatus(pedido._id, status)}
                        // CORREÇÃO: Remova 'flex-1' e adicione 'min-w-20' ou 'min-w-24' para largura mínima
                        // Ajuste 'mx-1' e 'my-1' para o espaçamento entre eles.
                        style={[
                            tw`py-2 px-3 rounded-lg mx-1 my-1 items-center justify-center w-34 h-15`, // <-- REMOVIDO 'flex-1', ADICIONADO 'min-w-20'
                            status === 'em preparo' && tw`bg-[#FAA41F]`,
                            status === 'pronto' && tw`bg-[#32973D]`,
                            status === 'cancelado' && tw`bg-red-600`,
                            (status !== 'em preparo' && status !== 'pronto' && status !== 'cancelado' && status !== 'pendente') && tw`bg-gray-500`,
                            pedido.status === status && tw`opacity-50`
                        ]}
                        disabled={pedido.status === status}
                    >
                        <Text style={tw`text-white text-md font-semibold text-center`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
                    </TouchableOpacity>
                ))}

                {/* Botão de Excluir Pedido */}
                <TouchableOpacity
                    onPress={() => onDeletePedido(pedido._id, pedido.usuario_info.nome || pedido.usuario_info.id.slice(-8))}
                    style={tw`bg-gray-400 py-2 px-3 rounded-lg mx-1 my-1 items-center justify-center w-34 h-15`} // <-- REMOVIDO 'flex-1', ADICIONADO 'min-w-20'
                >
                    <Text style={tw`text-white text-md font-semibold text-center`}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}