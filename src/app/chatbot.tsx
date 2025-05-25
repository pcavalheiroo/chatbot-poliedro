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
    ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import tw from "twrnc";
import BackButton from "../components/BackButton";
import { useUser } from "../contexts/UserContext";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

interface ChatbotProps {
    // Adicione props aqui quando necessário
}

export default function Chatbot({ }: ChatbotProps) {
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

    // Carregar histórico ao iniciar
    useEffect(() => {
        const loadHistory = async () => {
            if (user?.id) {
                try {
                    const response = await axios.get(
                        `http://192.168.1.101:5000/chat/historico?usuario_id=${user.id}`
                    );

                    // Mantém a ordem original (já vem ordenada do banco)
                    const historico = response.data.map((msg: any) => ({
                        id: msg._id,
                        text: msg.mensagem,
                        sender: msg.origem === "usuario" ? "user" : "bot",
                        timestamp: new Date(msg.data)
                    }));

                    // Adiciona no final do array mantendo a ordem cronológica
                    setMessages(prev => [
                        ...prev.filter(m => m.id === "1"),  // Mantém a mensagem inicial
                        ...historico
                    ]);

                } catch (error) {
                    console.error("Erro ao carregar histórico:", error);
                }
            }
        };
        loadHistory();
    }, [user?.id]);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const sendMessage = async () => {
        if (input.trim() === "" || isLoading || !user) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await axios.post<{ resposta: string }>("http://192.168.1.101:5000/chat", {
                usuario_id: user.id,
                mensagem: input
            }, {
                timeout: 10000
            });

            let resposta = res.data.resposta;

            // Formatação condicional com tipagem explícita
            if (resposta.includes("- R$")) {
                resposta = "📋 Cardápio disponível:\n\n" + resposta.split("\n")
                    .map((item: string) => `• ${item.trim()}`)
                    .filter((item: string) => item !== "•")
                    .join("\n");
            } else if (resposta.includes("Pedido registrado")) {
                resposta = "✅ " + resposta;
            } else if (resposta.includes("não encontrado")) {
                resposta = "❌ " + resposta;
            }

            const botMessage: Message = {
                id: Date.now().toString() + "_bot",
                text: resposta,
                sender: "bot",
                timestamp: new Date()
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error: unknown) {
            console.error("Erro na comunicação com o bot:", error);

            let errorMessage = "Erro ao conectar com o serviço";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.erro || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            const errMsg: Message = {
                id: Date.now().toString() + "_err",
                text: `⚠️ ${errorMessage}`,
                sender: "bot",
                timestamp: new Date()
            };

            setMessages((prev) => [...prev, errMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Message }) => (
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

    return (
        <KeyboardAvoidingView
            style={tw`flex-1 bg-[#f7f7f7]`}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <View style={tw`flex-1`}>
                <View style={tw`bg-[#005B7F] p-5 pt-14 pb-4`}>
                    <BackButton color="#fff" />
                    <Text style={tw`text-white text-xl font-bold text-center`}>
                        Assistente da Cantina
                    </Text>
                </View>

                <View style={tw`flex-1`}>
                    <FlatList<Message>
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={tw`pb-28 pt-4`}
                        showsVerticalScrollIndicator={false}
                    />

                    {isLoading && (
                        <View style={tw`bg-gray-100 rounded-bl-none border border-gray-200 self-start p-3 mx-4 my-2 max-w-3/4`}>
                            <View style={tw`flex-row items-center`}>
                                <ActivityIndicator size="small" color="#005B7F" style={tw`mr-2`} />
                                <Text style={tw`text-gray-500 italic`}>Digitando...</Text>
                            </View>
                        </View>
                    )}

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
    }
});