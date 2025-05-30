// Pedidos.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import tw from "twrnc";
import AppHeader from "../components/AppHeader";
import PedidoCard from "../components/PedidoCard"; // Importa o componente refatorado
import { useUser } from "../contexts/UserContext";
import PageContainer from '../components/PageContainer';
import axios from 'axios';

// --- Interfaces (repetidas aqui ou pode importá-las de um arquivo de tipos global) ---
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
// --- Fim das Interfaces ---

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Pedidos() {
    const { user } = useUser();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPedidos = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            setError("Faça login para ver seus pedidos.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get<Pedido[] | { aviso: string }>(`${API_BASE_URL}/pedidos/historico?usuario_id=${user.id}`);

            // Garante que o tipo da resposta seja tratado corretamente
            if ('aviso' in response.data && response.data.aviso) {
                setPedidos([]);
                setError(response.data.aviso);
            } else if (Array.isArray(response.data)) {
                setPedidos(response.data as Pedido[]);
            } else {
                // Caso o backend retorne um erro formatado como { erro: "..." }
                // Esta parte já é tratada pelo catch do axios, mas é um fallback
                setError("Formato de resposta inesperado do servidor.");
            }

        } catch (err) {
            console.error("Erro ao buscar pedidos (frontend):", err);
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    console.error("Dados do erro de resposta:", err.response.data);
                    setError(`Erro do servidor (${err.response.status}): ${err.response.data.erro || 'Desconhecido'}`);
                } else if (err.request) {
                    console.error("Nenhuma resposta do servidor. Verifique o IP e se o backend está rodando.");
                    setError("Não foi possível conectar ao servidor. Verifique sua conexão e o IP.");
                } else {
                    console.error("Erro na configuração da requisição:", err.message);
                    setError(`Erro na requisição: ${err.message}`);
                }
            } else {
                setError("Ocorreu um erro inesperado ao carregar seus pedidos.");
            }
        } finally {
            setLoading(false);
        }
    }, [user?.id]); // Refetch quando o ID do usuário mudar

    useEffect(() => {
        fetchPedidos();
    }, [fetchPedidos]); // Chama fetchPedidos ao montar e quando a função muda

    // Função auxiliar para renderizar o conteúdo da lista
    const renderContent = () => {
        if (loading) {
            return (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#005B7F" />
                    <Text style={tw`mt-4 text-lg text-gray-700`}>Carregando pedidos...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={tw`flex-1 justify-center items-center p-4 bg-red-100 rounded-lg`}>
                    <Text style={tw`text-red-700 text-base text-center`}>{error}</Text>
                </View>
            );
        }

        if (pedidos.length === 0) {
            return (
                <View style={tw`flex-1 justify-center items-center p-4 bg-yellow-100 rounded-lg`}>
                    <Text style={tw`text-yellow-700 text-base text-center`}>Você ainda não fez nenhum pedido. 😔</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={pedidos}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <PedidoCard pedido={item} />}
                contentContainerStyle={tw`pb-4`}
                showsVerticalScrollIndicator={false}
            />
        );
    };

    return (
        <View style={tw`flex-1 bg-[#f7f7f7]`}>
            <PageContainer>
                <AppHeader title="Meus Pedidos" />

                <View style={tw`flex-1 pt-4 px-4`}>
                    {renderContent()}
                </View>
            </PageContainer>
        </View>
    );
}