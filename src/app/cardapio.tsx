import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, Text, View, ActivityIndicator, Alert } from 'react-native';
import BackgroundPoliedros from "../components/BackgroundPoliedros";
import AppHeader from "../components/AppHeader";
import MenuCategorySection from '../components/MenuCategorySection';
import PageContainer from '../components/PageContainer';
import tw from "twrnc";
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';

interface MenuItem {
    _id: string;
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    disponibilidade: boolean;
}

interface CategorizedMenu {
    [category: string]: MenuItem[];
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Cardapio() {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [cardapio, setCardapio] = useState<CategorizedMenu>({});
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
    }, []);

    useEffect(() => {
        fetchAndCategorizeCardapio();
    }, [fetchAndCategorizeCardapio]);

    const renderContent = () => {
        if (loading) {
            return (
                <Animatable.View
                    animation="fadeIn"
                    duration={1000}
                    style={tw`flex-1 justify-center items-center`}
                >
                    <Animatable.View
                        animation="rotate"
                        iterationCount="infinite"
                        duration={2000}
                        style={tw`mb-4`}
                    >
                        <ActivityIndicator size="large" color="#005B7F" />
                    </Animatable.View>
                    <Animatable.Text
                        animation="fadeInUp"
                        duration={800}
                        delay={300}
                        style={tw`text-lg text-gray-700`}
                    >
                        Preparando o cardápio...
                    </Animatable.Text>
                    <Animatable.Text
                        animation="pulse"
                        iterationCount="infinite"
                        duration={1500}
                        delay={500}
                        style={tw`text-sm text-gray-500 mt-2`}
                    >
                        Isso pode levar alguns instantes
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
                    <Animatable.View
                        animation="bounceIn"
                        duration={1000}
                        delay={500}
                    >
                        <Text
                            style={tw`text-blue-500 mt-4`}
                            onPress={fetchAndCategorizeCardapio}
                        >
                            Tentar novamente
                        </Text>
                    </Animatable.View>
                </Animatable.View>
            );
        }

        if (Object.keys(cardapio).length === 0) {
            return (
                <Animatable.View
                    animation="fadeIn"
                    duration={1000}
                    style={tw`flex-1 justify-center items-center p-4 bg-yellow-100 rounded-lg`}
                >
                    <Animatable.Text
                        animation="pulse"
                        iterationCount="infinite"
                        duration={2000}
                        style={tw`text-yellow-700 text-base text-center`}
                    >
                        O cardápio está vazio no momento. 😔
                    </Animatable.Text>
                    <Animatable.View
                        animation="bounceIn"
                        duration={1000}
                        delay={500}
                    >
                        <Text
                            style={tw`text-blue-500 mt-4`}
                            onPress={fetchAndCategorizeCardapio}
                        >
                            Recarregar
                        </Text>
                    </Animatable.View>
                </Animatable.View>
            );
        }

        return (
            <Animatable.View
                animation="fadeInUp"
                duration={800}
                style={tw`flex-1`}
            >
                <ScrollView style={tw`flex-1`}>
                    {Object.keys(cardapio).sort().map((categoria, index) => (
                        <Animatable.View
                            key={categoria}
                            animation="fadeInRight"
                            duration={600}
                            delay={index * 200}
                        >
                            <MenuCategorySection
                                categoryName={categoria}
                                items={cardapio[categoria]}
                            />
                        </Animatable.View>
                    ))}
                </ScrollView>
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
                    <AppHeader title="Cardápio da Cantina" />
                </Animatable.View>

                <View style={tw`flex-1 pt-4 px-4`}>
                    {renderContent()}
                </View>
            </PageContainer>
        </View>
    );
}