import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { ScrollView, View, Text, FlatList, ActivityIndicator, Alert, TextInput, useWindowDimensions, Platform, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import axios from 'axios';
import AppHeader from '../../components/AppHeader';
import PedidoAdminCard from '../../components/PedidoAdminCard';
import { useUser } from '../../contexts/UserContext';
import * as Animatable from 'react-native-animatable';

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

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const screenWidth = Dimensions.get('window').width;
const isDesktop = screenWidth >= 1024;

export default function PedidosGerenciar() {
    const { user } = useUser();
    const [pedidos, setPedidos] = useState<PedidoAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { width } = useWindowDimensions();

    const numColumns = Platform.OS === 'web' && width >= 1024 ? 2 : 1;
    const cardMargin = 8;
    const cardWidth = (width - (numColumns + 1) * cardMargin * 2) / numColumns;

    const fetchPedidos = useCallback(async () => {
        if (!user || user.role !== 'admin') {
            setError("Apenas administradores podem gerenciar pedidos.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get<PedidoAdmin[]>(`${API_BASE_URL}/admin/pedidos/todos`);
            setPedidos(response.data);
        } catch (err) {
            console.error("Erro ao buscar pedidos:", err);
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
            fetchPedidos();
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
                            fetchPedidos();
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

    const filteredPedidos = useMemo(() => {
        if (!searchTerm) return pedidos;
        const lower = searchTerm.toLowerCase();
        return pedidos.filter(p =>
            p.usuario_info?.nome?.toLowerCase().includes(lower) ||
            p.usuario_info?.id?.toLowerCase().includes(lower.slice(-8)) ||
            p.status.toLowerCase().includes(lower) ||
            p._id.toLowerCase().includes(lower.slice(-8)) ||
            p.itens.some(item => item.nome.toLowerCase().includes(lower))
        );
    }, [pedidos, searchTerm]);

    return (
        <View style={tw`flex-1 bg-[#f7f7f7]`}>
            <Animatable.View animation="fadeInDown" duration={800} delay={100}>
                <AppHeader title="Gerenciar Pedidos" />
            </Animatable.View>

            <Animatable.View animation="fadeInLeft" duration={800} delay={300} style={tw`flex-row items-center border border-gray-300 rounded-lg mx-6 mt-4 mb-4 bg-white px-3`}>
                <Ionicons name="search" size={20} color={tw.color('gray-500')!} style={tw`mr-1`} />
                <TextInput
                    style={tw`flex-1 p-2 text-gray-800`}
                    autoCorrect
                    autoComplete="off"
                    spellCheck
                    placeholder="Buscar por cliente, status, item ou ID do pedido..."
                    placeholderTextColor={tw.color('gray-500')!}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </Animatable.View>

            <Animatable.View animation="fadeIn" duration={1000} delay={500} style={tw`flex-1 px-4`}>
                {loading ? (
                    <Animatable.View animation="pulse" iterationCount="infinite" duration={1500} style={tw`flex-1 justify-center items-center`}>
                        <ActivityIndicator size="large" color="#005B7F" />
                        <Text style={tw`mt-4 text-lg text-gray-700`}>Carregando pedidos...</Text>
                    </Animatable.View>
                ) : error ? (
                    <Animatable.View animation="shake" duration={800} style={tw`flex-1 justify-center items-center p-4 bg-red-100 rounded-lg`}>
                        <Text style={tw`text-red-700 text-base text-center`}>{error}</Text>
                    </Animatable.View>
                ) : filteredPedidos.length === 0 ? (
                    <Animatable.View animation="bounceIn" duration={1000} style={tw`flex-1 justify-center items-center p-4 bg-yellow-100 rounded-lg`}>
                        <Text style={tw`text-yellow-700 text-base text-center`}>{searchTerm ? "Nenhum pedido encontrado para esta busca. 🔎" : "Nenhum pedido ativo. 😔"}</Text>
                    </Animatable.View>
                ) : (
                    <ScrollView contentContainerStyle={tw`pb-4`} showsVerticalScrollIndicator={false}>
                        <View style={[tw`flex-row flex-wrap justify-start`, { gap: 12 }]}>
                            {filteredPedidos.map((item, index) => (
                                <Animatable.View
                                    key={item._id}
                                    animation="fadeInRight"
                                    duration={600}
                                    delay={index * 100}
                                    style={isDesktop ? { width: '32%' } : { width: '100%' }}
                                >
                                    <PedidoAdminCard
                                        pedido={item}
                                        onUpdateStatus={handleUpdateStatus}
                                        onDeletePedido={handleDeletePedido}
                                    />
                                </Animatable.View>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </Animatable.View>
        </View>
    );
}
