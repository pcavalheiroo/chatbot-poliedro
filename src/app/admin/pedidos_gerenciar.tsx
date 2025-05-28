// app/(admin)/pedidos-gerenciar.tsx
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from "@expo/vector-icons"; // Certifique-se de importar Ionicons
import tw from 'twrnc';
import axios from 'axios';
import AppHeader from '../../components/AppHeader';
import PedidoAdminCard from '../../components/PedidoAdminCard'; // Importa o novo componente
import { useUser } from '../../contexts/UserContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces (Devem ser as mesmas do PedidoAdminCard para consistência) ---
interface PedidoItem {
    _id: string;
    nome: string;
    preco: number;
    quantidade: number;
}

interface PedidoAdmin {
    _id: string;
    usuario_id: string;
    usuario_info: { nome: string; id: string };
    data_pedido: string;
    total: number;
    status: 'pendente' | 'em preparo' | 'pronto' | 'finalizado' | 'cancelado';
    itens: PedidoItem[];
}
// --- Fim das Interfaces ---

export default function PedidosGerenciar() {
    const { user } = useUser();
    const [pedidos, setPedidos] = useState<PedidoAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca

    // --- Funções de Fetch e Gerenciamento ---

    const fetchPedidos = useCallback(async () => {
        if (!user || user.role !== 'admin') {
            setError("Acesso negado. Apenas administradores podem gerenciar pedidos.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get<PedidoAdmin[]>(`${API_BASE_URL}/admin/pedidos/todos`);
            setPedidos(response.data);
        } catch (err) {
            console.error("Erro ao buscar todos os pedidos:", err);
            setError("Não foi possível carregar os pedidos.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPedidos();
    }, [fetchPedidos]);

    const handleUpdateStatus = useCallback(async (pedidoId: string, newStatus: string) => {
        try {
            await axios.put(`${API_BASE_URL}/admin/pedidos/${pedidoId}/status`, { status: newStatus });
            Alert.alert("Sucesso", `Status do pedido ${pedidoId.slice(-6).toUpperCase()} atualizado para ${newStatus.toUpperCase()}!`);
            fetchPedidos(); // Recarrega a lista
        } catch (err: any) {
            console.error("Erro ao atualizar status:", err);
            const msg = axios.isAxiosError(err) && err.response?.data?.erro || "Falha ao atualizar status.";
            Alert.alert("Erro", msg);
        }
    }, [fetchPedidos]);

    const handleDeletePedido = useCallback(async (pedidoId: string, clienteNome: string) => {
        Alert.alert(
            "Excluir Pedido",
            `Tem certeza que deseja excluir o pedido de ${clienteNome}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_BASE_URL}/admin/pedidos/${pedidoId}`);
                            Alert.alert("Sucesso", "Pedido excluído!");
                            fetchPedidos(); // Recarrega a lista
                        } catch (err: any) {
                            console.error("Erro ao excluir pedido:", err);
                            const msg = axios.isAxiosError(err) && err.response?.data?.erro || "Falha ao excluir pedido.";
                            Alert.alert("Erro", msg);
                        }
                    },
                },
            ]
        );
    }, [fetchPedidos]);

    // Lógica de filtro para os pedidos
    const filteredPedidos = useMemo(() => {
        if (!searchTerm) {
            return pedidos;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return pedidos.filter(pedidoItem =>
            (pedidoItem.usuario_info?.nome?.toLowerCase().includes(lowerCaseSearchTerm)) || // Busca por nome do cliente
            (pedidoItem.usuario_info?.id?.toLowerCase().includes(lowerCaseSearchTerm.slice(-8))) || // Busca por ID do cliente
            (pedidoItem.status.toLowerCase().includes(lowerCaseSearchTerm)) || // Busca por status
            (pedidoItem._id.toLowerCase().includes(lowerCaseSearchTerm.slice(-8))) || // Busca por ID do pedido
            pedidoItem.itens.some(item => item.nome.toLowerCase().includes(lowerCaseSearchTerm)) // Busca por nome do item no pedido
        );
    }, [pedidos, searchTerm]);

    // --- Renderização Principal ---
    return (
        <View style={tw`flex-1 bg-[#f7f7f7]`}>
            <AppHeader title="Gerenciar Pedidos" />

            {/* Campo de busca */}
            <View style={tw`flex-row items-center border border-gray-300 rounded-lg mx-6 mt-4 mb-4 bg-white px-3`}>
                <Ionicons name="search" size={20} color={tw.color('gray-500')!} style={tw`mr-1`} />
                <TextInput
                    style={tw`flex-1 p-2 text-gray-800`}
                    placeholder="Buscar por cliente, status, item ou ID do pedido..."
                    placeholderTextColor={tw.color('gray-500')!}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            <View style={tw`flex-1 px-4`}>
                {loading ? (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <ActivityIndicator size="large" color="#005B7F" />
                        <Text style={tw`mt-4 text-lg text-gray-700`}>Carregando pedidos...</Text>
                    </View>
                ) : error ? (
                    <View style={tw`flex-1 justify-center items-center p-4 bg-red-100 rounded-lg`}>
                        <Text style={tw`text-red-700 text-base text-center`}>{error}</Text>
                    </View>
                ) : filteredPedidos.length === 0 ? ( // Usa filteredPedidos
                    <View style={tw`flex-1 justify-center items-center p-4 bg-yellow-100 rounded-lg`}>
                        <Text style={tw`text-yellow-700 text-base text-center`}>{searchTerm ? "Nenhum pedido encontrado para esta busca. 🔎" : "Nenhum pedido ativo. 😔"}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredPedidos} // Usa filteredPedidos
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <PedidoAdminCard
                                pedido={item}
                                onUpdateStatus={handleUpdateStatus}
                                onDeletePedido={handleDeletePedido}
                            />
                        )}
                        contentContainerStyle={tw`pb-4`}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
}