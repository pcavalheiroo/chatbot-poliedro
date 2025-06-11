import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Text, View, ActivityIndicator, Alert } from 'react-native';
import tw from "twrnc";
import AppHeader from "../components/AppHeader";
import PedidoCard from "../components/PedidoCard";
import { useUser } from "../contexts/UserContext";
import PageContainer from '../components/PageContainer';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import BackgroundPoliedros from "../components/BackgroundPoliedros";

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

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Pedidos() {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const handleLogout = useCallback(() => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sair",
                    onPress: () => {
                        setUser(null);
                        router.replace("/");
                    },
                },
            ]
        );
    }, [setUser, router]);

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

            if ('aviso' in response.data && response.data.aviso) {
                setPedidos([]);
                setError(response.data.aviso);
            } else if (Array.isArray(response.data)) {
                setPedidos(response.data as Pedido[]);
            } else {
                setError("Formato de resposta inesperado do servidor.");
            }

        } catch (err) {
            console.error("Erro ao buscar pedidos:", err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.erro || "Erro ao carregar pedidos");
            } else {
                setError("Ocorreu um erro inesperado.");
            }
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchPedidos();
    }, [fetchPedidos]);

    const renderContent = () => {
        if (loading) {
            return (
                <Animatable.View
                    animation="fadeIn"
                    duration={1000}
                    style={tw`flex-1 justify-center items-center`}
                >
                    <Animatable.View
                        animation="pulse"
                        iterationCount="infinite"
                        duration={1500}
                    >
                        <ActivityIndicator size="large" color="#005B7F" />
                    </Animatable.View>
                    <Animatable.Text
                        animation="fadeInUp"
                        duration={800}
                        delay={300}
                        style={tw`mt-4 text-lg text-gray-700`}
                    >
                        Carregando pedidos...
                    </Animatable.Text>
                </Animatable.View>
            );
        }

        if (error) {
            return (
                <Animatable.View
                    animation="shake"
                    duration={800}
                    style={tw`flex-1 justify-center items-center p-4 bg-red-100 rounded-lg`}
                >
                    <Text style={tw`text-red-700 text-base text-center`}>{error}</Text>
                </Animatable.View>
            );
        }

        if (pedidos.length === 0) {
            return (
                <Animatable.View
                    animation="bounceIn"
                    duration={1200}
                    style={tw`flex-1 justify-center items-center p-4 bg-yellow-100 rounded-lg`}
                >
                    <Animatable.Text
                        animation="pulse"
                        iterationCount="infinite"
                        duration={2000}
                        style={tw`text-yellow-700 text-base text-center`}
                    >
                        Você ainda não fez nenhum pedido. 😔
                    </Animatable.Text>
                </Animatable.View>
            );
        }

        return (
            <Animatable.View
                animation="fadeInUp"
                duration={800}
                style={tw`flex-1`}
            >
                <FlatList
                    data={pedidos}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => (
                        <Animatable.View
                            animation="fadeInRight"
                            duration={600}
                            delay={index * 150}
                        >
                            <PedidoCard pedido={item} />
                        </Animatable.View>
                    )}
                    contentContainerStyle={tw`pb-4`}
                    showsVerticalScrollIndicator={false}
                />
            </Animatable.View>
        );
    };

    return (
        <View style={tw`flex-1 bg-[#f7f7f7] relative`}>
            <BackgroundPoliedros />

            <PageContainer>
                <Animatable.View
                    animation="fadeInDown"
                    duration={800}
                >
                    <AppHeader title="Meus Pedidos" />
                </Animatable.View>

                <View style={tw`flex-1 pt-4 px-4`}>
                    {renderContent()}
                </View>
            </PageContainer>
        </View>
    );
}