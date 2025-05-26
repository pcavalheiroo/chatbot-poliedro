// Cardapio.tsx
import React, { useEffect, useState } from 'react'; // Importe useEffect e useState
import { ScrollView, Text, View, ActivityIndicator } from 'react-native'; // Importe ActivityIndicator para o loading
import BackgroundPoliedros from "../components/BackgroundPoliedros"; 
import AppHeader from "../components/AppHeader"; 
import tw from "twrnc";
import axios from 'axios'; // Importe axios

// Define a interface para os itens do cardápio, baseada nos campos do seu banco
interface MenuItem {
    _id: string; // MongoDB _id
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    disponibilidade: boolean; // Embora você filtre por true no backend, é bom ter
}

// Define a interface para o cardápio agrupado por categoria
interface CategorizedMenu {
    [category: string]: MenuItem[];
}

// URL base da sua API Flask
// Lembre-se de ajustar este IP para o IP da sua máquina onde o backend está rodando
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL; 

export default function Cardapio() {
    const [cardapio, setCardapio] = useState<CategorizedMenu>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCardapio = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get<MenuItem[]>(`${API_BASE_URL}/cardapio`);
                
                // Agrupar itens por categoria
                const categorizedData: CategorizedMenu = {};
                response.data.forEach(item => {
                    const category = item.categoria || 'Outros'; // Default para 'Outros' se não tiver categoria
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
        };

        fetchCardapio();
    }, []); // O array vazio garante que o useEffect rode apenas uma vez ao montar o componente

    return (
        <View style={tw`flex-1 bg-[#f7f7f7]`}>
            <BackgroundPoliedros />
            
            <AppHeader title="Cardápio da Cantina" />
            
            <ScrollView style={tw`flex-1 pt-4 px-4`}> 
                {loading ? (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <ActivityIndicator size="large" color="#005B7F" />
                        <Text style={tw`mt-4 text-lg text-gray-700`}>Carregando cardápio...</Text>
                    </View>
                ) : error ? (
                    <View style={tw`flex-1 justify-center items-center p-4 bg-red-100 rounded-lg`}>
                        <Text style={tw`text-red-700 text-base text-center`}>{error}</Text>
                    </View>
                ) : Object.keys(cardapio).length === 0 ? (
                    <View style={tw`flex-1 justify-center items-center p-4 bg-yellow-100 rounded-lg`}>
                        <Text style={tw`text-yellow-700 text-base text-center`}>O cardápio está vazio no momento. 😔</Text>
                    </View>
                ) : (
                    // Renderiza cada categoria
                    Object.keys(cardapio).sort().map(categoria => ( // Ordena as categorias alfabeticamente
                        <View key={categoria} style={tw`w-full bg-white rounded-2xl p-6 shadow-md mb-4`}>
                            <Text style={tw`text-2xl font-bold text-[#005B7F] mb-4 text-center`}>
                                {categoria}
                            </Text>
                            {/* Renderiza os itens dentro de cada categoria */}
                            {cardapio[categoria].map((item, index) => (
                                <View 
                                    key={item._id} 
                                    style={tw`pb-4 ${index < cardapio[categoria].length - 1 ? 'mb-4 border-b border-gray-200' : ''}`}
                                >
                                    <Text style={tw`text-xl font-bold text-[#e65100] mb-1`}>{item.nome}</Text>
                                    <Text style={tw`text-sm text-gray-600 mb-2`}>{item.descricao}</Text>
                                    <Text style={tw`text-lg font-bold text-[#26c6da]`}>R$ {item.preco.toFixed(2)}</Text>
                                </View>
                            ))}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}