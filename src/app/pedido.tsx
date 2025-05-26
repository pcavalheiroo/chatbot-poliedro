// Pedidos.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import tw from "twrnc";
import AppHeader from "../components/AppHeader";
import { useUser } from "../contexts/UserContext"; // Importar useUser
import axios from 'axios';
import { Ionicons } from "@expo/vector-icons"; // Para ícones

// URL base da sua API Flask
// Lembre-se de ajustar este IP para o IP da sua máquina onde o backend está rodando
const API_BASE_URL = "http://192.168.1.113:5000";

// --- Interfaces ---
interface PedidoItem {
    _id: string; // ID do item dentro do pedido (se aplicável, ou apenas para garantir unicidade)
    nome: string;
    preco: number;
    quantidade: number;
}

interface Pedido {
    _id: string; // ID do pedido
    usuario_id: string;
    data_pedido: string; // String ISO de data
    total: number;
    status: 'pendente' | 'em preparo' | 'pronto' | 'finalizado' | 'cancelado'; // Exemplo de status
    itens: PedidoItem[];
}

// --- Componente Individual de Pedido (Para reutilização) ---
const PedidoCard: React.FC<{ pedido: Pedido }> = ({ pedido }) => {
    const formattedDate = new Date(pedido.data_pedido).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Função para obter a cor e o ícone do status
    const getStatusDisplay = (status: string) => {
        let color = tw`text-gray-600`;
        let iconName: keyof typeof Ionicons.glyphMap = 'information-circle-outline'; // Default icon

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
            {/* ... */}
            
            <Text style={tw`text-lg font-bold text-gray-700 mb-2`}>Itens:</Text>
            {pedido.itens.map((item, index) => (
                <View key={item._id || index} style={tw`flex-row justify-between items-center mb-1 pl-2`}>
                    <Text style={tw`text-base text-gray-700`}>{item.quantidade}x {item.nome}</Text>
                    {/* Adiciona verificação antes de chamar toFixed */}
                    <Text style={tw`text-base font-semibold text-gray-800`}>
                        R$ {((item.preco || 0) * (item.quantidade || 0)).toFixed(2)}
                    </Text>
                </View>
            ))}
            
            <View style={tw`border-t border-gray-300 mt-4 pt-3 flex-row justify-between items-center`}>
                <Text style={tw`text-xl font-bold text-[#e65100]`}>Total:</Text>
                {/* Adiciona verificação antes de chamar toFixed */}
                <Text style={tw`text-2xl font-extrabold text-[#e65100]`}>
                    R$ {(pedido.total || 0).toFixed(2)}
                </Text>
            </View>
        </View>
    );
};

// --- Tela de Pedidos Principal ---
export default function Pedidos() {
    const { user } = useUser(); // Acessa o usuário logado
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            if (!user?.id) {
                setLoading(false);
                setError("Faça login para ver seus pedidos.");
                return;
            }

            try {
                // ...
                const response = await axios.get<Pedido[]>(`${API_BASE_URL}/pedidos/historico?usuario_id=${user.id}`);

                console.log("Pedidos recebidos do backend (RAW):", JSON.stringify(response.data, null, 2)); // Adicione esta linha para ver o JSON completo formatado

                // Verifica se o backend retornou um aviso de "Cardápio vazio" ou similar
                if (response.data && (response.data as any).aviso) {
                    setPedidos([]); // Define como array vazio
                    setError((response.data as any).aviso); // Exibe o aviso como erro
                } else {
                    setPedidos(response.data);
                }

            } catch (err) {
                console.error("Erro ao buscar pedidos (frontend):", err);
                if (axios.isAxiosError(err)) {
                    if (err.response) {
                        // O servidor respondeu com um status de erro (4xx, 5xx)
                        console.error("Dados do erro de resposta:", err.response.data);
                        setError(`Erro do servidor (${err.response.status}): ${err.response.data.erro || 'Desconhecido'}`);
                    } else if (err.request) {
                        // A requisição foi feita, mas não houve resposta (servidor offline, IP errado, timeout)
                        console.error("Nenhuma resposta do servidor. Verifique o IP e se o backend está rodando.");
                        setError("Não foi possível conectar ao servidor. Verifique sua conexão e o IP.");
                    } else {
                        // Algo aconteceu ao configurar a requisição que disparou um erro
                        console.error("Erro na configuração da requisição:", err.message);
                        setError(`Erro na requisição: ${err.message}`);
                    }
                } else {
                    // Outro tipo de erro
                    setError("Ocorreu um erro inesperado ao carregar seus pedidos.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPedidos();
    }, [user?.id]); // Refetch quando o ID do usuário mudar

    return (
        <View style={tw`flex-1 bg-[#f7f7f7]`}>
            <AppHeader title="Meus Pedidos" />

            <View style={tw`flex-1 pt-4 px-4`}>
                {loading ? (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <ActivityIndicator size="large" color="#005B7F" />
                        <Text style={tw`mt-4 text-lg text-gray-700`}>Carregando pedidos...</Text>
                    </View>
                ) : error ? (
                    <View style={tw`flex-1 justify-center items-center p-4 bg-red-100 rounded-lg`}>
                        <Text style={tw`text-red-700 text-base text-center`}>{error}</Text>
                    </View>
                ) : pedidos.length === 0 ? (
                    <View style={tw`flex-1 justify-center items-center p-4 bg-yellow-100 rounded-lg`}>
                        <Text style={tw`text-yellow-700 text-base text-center`}>Você ainda não fez nenhum pedido. 😔</Text>
                    </View>
                ) : (
                    <FlatList
                        data={pedidos}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <PedidoCard pedido={item} />}
                        contentContainerStyle={tw`pb-4`} // Adiciona padding no final da lista
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
}

// Estilos adicionais se necessário, mas twrnc já faz a maior parte
const styles = StyleSheet.create({
    // Pode adicionar estilos globais aqui se twrnc não cobrir algo
});