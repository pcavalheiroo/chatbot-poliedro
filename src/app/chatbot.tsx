import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
    Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import tw from "twrnc";
import BackButton from "../components/BackButton";
import { useUser } from "../contexts/UserContext";
import AppHeader from "../components/AppHeader";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

export default function Chatbot() {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Olá! Sou o PoliChat. Posso te ajudar com:\n\n• Cardápio do dia\n• Informações sobre pratos\n• Fazer pedidos\n• Histórico de pedidos",
            sender: "bot",
            timestamp: new Date()
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList<Message>>(null);

    const sendMessage = async () => {
        if (input.trim() === "" || isLoading || !user) return;

        const userMessage: Message = {
            id: "user_" + Date.now().toString(),
            text: input,
            sender: "user",
            timestamp: new Date()
        };

        // Adiciona a mensagem do usuário no final
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await axios.post("http://10.2.0.202:5000/chat", { // 10.2.0.202 | 192.168.1.101
                usuario_id: user.id,
                mensagem: input
            });

            const botMessage: Message = {
                id: "bot_" + Date.now().toString(),
                text: res.data.resposta,
                sender: "bot",
                timestamp: new Date()
            };

            // Adiciona a resposta no final
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Erro:", error);
            const errorMessage: Message = {
                id: "error_" + Date.now().toString(),
                text: "⚠️ Ocorreu um erro",
                sender: "bot",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const limparHistorico = async () => {
        if (!user?.id) return;

        Alert.alert(
            "Limpar Histórico",
            "Tem certeza que deseja apagar todo o histórico de conversas?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Limpar",
                    onPress: async () => {
                        try {
                            await axios.delete(
                                `http://10.2.0.202:5000/chat/limpar_historico?usuario_id=${user.id}`
                            );

                            // Mantém apenas a mensagem inicial
                            setMessages([
                                {
                                    id: "1",
                                    text: "Olá! Sou o PoliChat. Posso te ajudar com:\n\n• Cardápio do dia\n• Informações sobre pratos\n• Fazer pedidos\n• Histórico de pedidos",
                                    sender: "bot",
                                    timestamp: new Date()
                                }
                            ]);

                            Alert.alert("Sucesso", "Histórico limpo com sucesso!");
                        } catch (error) {
                            console.error("Erro ao limpar histórico:", error);
                            Alert.alert("Erro", "Falha ao limpar histórico");
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    };

    const renderItem = ({ item }: { item: Message }) => {
        // Renderização especial para cardápio
        if (item.sender === "bot" && item.text.includes("📋")) {
            return (
                <View style={tw`bg-gray-100 rounded-lg p-4 my-2 mx-4 border border-gray-200 self-start`}>
                    {item.text.split('\n').map((line, index) => {
                        if (line.includes("📋")) {
                            return (
                                <Text key={index} style={tw`font-bold text-lg text-center mb-2`}>
                                    {line.replace(/\*/g, '')}
                                </Text>
                            );
                        } else if (line.includes("🍽️")) {
                            return (
                                <Text key={index} style={tw`font-bold mt-3 text-[#005B7F]`}>
                                    {line}
                                </Text>
                            );
                        } else if (line.startsWith("→")) {
                            const [nomePreco, ...descricao] = line.split("   ");
                            return (
                                <View key={index} style={tw`my-1`}>
                                    <Text style={tw`font-medium`}>{nomePreco}</Text>
                                    {descricao.length > 0 && (
                                        <Text style={tw`text-gray-600 text-sm`}>{descricao.join(' ')}</Text>
                                    )}
                                </View>
                            );
                        }
                        return null;
                    })}
                </View>
            );
        }

        // Renderização padrão para outras mensagens
        return (
            <View
                style={[
                    tw`my-2 mx-4 p-3 rounded-lg max-w-3/4`,
                    item.sender === "user"
                        ? tw`bg-[#005B7F] rounded-br-none self-end`
                        : tw`bg-gray-100 rounded-bl-none border border-gray-200 self-start`,
                    styles.messageShadow
                ]}
            >
                <Text style={item.sender === "user" ? tw`text-white` : tw`text-gray-800`}>
                    {item.text}
                </Text>
                <Text
                    style={[
                        tw`text-xs mt-1`,
                        item.sender === "user" ? tw`text-blue-200` : tw`text-gray-500`
                    ]}
                >
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    useEffect(() => {
        const carregarHistorico = async () => {
            if (user?.id) {
                try {
                    const response = await axios.get(
                        `http://10.2.0.202:5000/chat/historico?usuario_id=${user.id}`
                    );

                    // Mantém a ordem original (já vem ordenado do backend)
                    const historicoFormatado = response.data.map((msg: any) => ({
                        id: msg._id,
                        text: msg.mensagem,
                        sender: msg.origem === "usuario" ? "user" : "bot",
                        timestamp: new Date(msg.data)
                    }));

                    // Adiciona no final do array mantendo a ordem cronológica
                    setMessages(prev => [
                        ...prev.filter(m => m.id === "1"),  // Mantém mensagem inicial
                        ...historicoFormatado
                    ]);

                } catch (error) {
                    console.error("Erro ao carregar histórico:", error);
                }
            }
        };

        carregarHistorico();
    }, [user?.id]);

    return (
        <KeyboardAvoidingView
            style={tw`flex-1 bg-[#f7f7f7]`}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <View style={tw`flex-1`}>
                {/* Header */}
                <AppHeader title="Assistente da Cantina">
                    {/* Adicionamos o botão de limpar histórico como children */}
                    <TouchableOpacity
                        onPress={limparHistorico}
                        // Posicionamento absoluto dentro do AppHeader
                        style={tw`absolute top-12 right-6 p-2.5 rounded-full bg-transparent`}
                    >
                        <Ionicons name="trash-outline" size={25} color="white" />
                    </TouchableOpacity>
                </AppHeader>

                {/* Mensagens */}
                <View style={tw`flex-1`}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={tw`pb-28 pt-4`}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />

                    {/* Indicador de digitação */}
                    {isLoading && (
                        <View style={tw`bg-gray-100 rounded-bl-none border border-gray-200 self-start p-3 mx-4 my-2 max-w-3/4`}>
                            <View style={tw`flex-row items-center`}>
                                <ActivityIndicator size="small" color="#005B7F" style={tw`mr-2`} />
                                <Text style={tw`text-gray-500 italic`}>Digitando...</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Input */}
                <View style={tw`absolute bottom-0 left-0 right-0 bg-white px-3 pt-3 pb-9 border-t border-gray-200`}>
                    <View style={tw`flex-row items-center bg-gray-100 rounded-full px-6`}>
                        <TextInput
                            style={tw`flex-1 h-12 text-base text-gray-800`}
                            placeholder="Digite sua mensagem..."
                            placeholderTextColor="#9CA3AF"
                            value={input}
                            onChangeText={setInput}
                            onSubmitEditing={sendMessage}
                            editable={!isLoading}
                            returnKeyType="send"
                        />
                        <TouchableOpacity
                            onPress={sendMessage}
                            disabled={input.trim() === "" || isLoading}
                            style={tw`ml-2`}
                        >
                            <Ionicons
                                name="send"
                                size={24}
                                color={input.trim() === "" || isLoading ? "#9CA3AF" : "#005B7F"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    messageShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    botaoLimpar: {
        backgroundColor: '#ef4444',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5
    }
});