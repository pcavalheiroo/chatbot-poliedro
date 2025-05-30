// Cardapio.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import BackgroundPoliedros from "../components/BackgroundPoliedros";
import AppHeader from "../components/AppHeader";
import MenuCategorySection from '../components/MenuCategorySection';
import PageContainer from '../components/PageContainer';
import tw from "twrnc";
import axios from 'axios';

// Define a interface para os itens do cardápio
interface MenuItem {
    _id: string; // MongoDB _id
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    disponibilidade: boolean;
}

// Define a interface para o cardápio agrupado por categoria
interface CategorizedMenu {
    [category: string]: MenuItem[];
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Cardapio() {
    const [cardapio, setCardapio] = useState<CategorizedMenu>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Lógica para buscar e agrupar o cardápio
    const fetchAndCategorizeCardapio = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get<MenuItem[]>(`${API_BASE_URL}/cardapio`);

            const categorizedData: CategorizedMenu = {};
            response.data.forEach(item => {
                const category = item.categoria || 'Outros';
                if (!categorizedData[category]) {
                    categorizedData[category] = [];
                }
                categorizedData[category].push(item);
            });
            setCardapio(categorizedData);

        } catch (err) {
            console.error("Erro ao buscar cardápio:", err);
            setError("Não foi possível carregar o cardápio. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    }, []); // Não há dependências externas, executa uma vez

    // Chama a função de fetch ao montar o componente
    useEffect(() => {
        fetchAndCategorizeCardapio();
    }, [fetchAndCategorizeCardapio]);

    // Função auxiliar para renderizar o estado de carregamento/erro/vazio
    const renderContent = () => {
        if (loading) {
            return (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#005B7F" />
                    <Text style={tw`mt-4 text-lg text-gray-700`}>Carregando cardápio...</Text>
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

        if (Object.keys(cardapio).length === 0) {
            return (
                <View style={tw`flex-1 justify-center items-center p-4 bg-yellow-100 rounded-lg`}>
                    <Text style={tw`text-yellow-700 text-base text-center`}>O cardápio está vazio no momento. 😔</Text>
                </View>
            );
        }

        return (
            // Renderiza cada categoria de forma ordenada
            Object.keys(cardapio).sort().map(categoria => (
                <MenuCategorySection
                    key={categoria}
                    categoryName={categoria}
                    items={cardapio[categoria]}
                />
            ))
        );
    };

    return (
        <View style={tw`flex-1 bg-[#f7f7f7]`}>
            <PageContainer>
                <AppHeader title="Cardápio da Cantina" />
                <ScrollView style={tw`flex-1 pt-4 px-4`}>
                    {renderContent()}
                </ScrollView>
            </PageContainer>
        </View>
    );
}