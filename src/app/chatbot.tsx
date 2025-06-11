import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    View,
    ActivityIndicator,
    Text,
    TouchableOpacity
} from "react-native";
import axios from "axios";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
import ChatMessage from "../components/ChatMessage";
import BotCardapioMessage from "../components/BotCardapioMessage";
import MessageInput from "../components/MessageInput";
import { useUser } from "../contexts/UserContext";
import * as Animatable from "react-native-animatable";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

const INITIAL_BOT_MESSAGE: Message = {
    id: "1",
    text: "Olá! Sou o PoliChat. Posso te ajudar com:\n\n• Cardápio do dia \n• Fazer pedidos\n• Histórico de pedidos",
    sender: "bot",
    timestamp: new Date(),
};

const MESSAGE_INPUT_HEIGHT_IOS = 80;
const MESSAGE_INPUT_HEIGHT_ANDROID = 68;

export default function Chatbot() {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList<Message>>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    useEffect(() => {
        const loadHistory = async () => {
            if (!user?.id) return;
            try {
                const response = await axios.get<any[]>(`${API_BASE_URL}/chat/historico?usuario_id=${user.id}`);
                const formattedHistory: Message[] = response.data.map((msg) => ({
                    id: msg._id,
                    text: msg.mensagem,
                    sender: msg.origem === "usuario" ? "user" : "bot",
                    timestamp: new Date(msg.data),
                }));
                setMessages((prev) => [INITIAL_BOT_MESSAGE, ...formattedHistory]);
            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
            }
        };
        loadHistory();
    }, [user?.id]);

    const sendMessage = useCallback(async () => {
        if (input.trim() === "" || isLoading || !user) return;

        const userMessage: Message = {
            id: "user_" + Date.now().toString(),
            text: input,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/chat`, {
                usuario_id: user.id,
                mensagem: userMessage.text,
            });

            const botMessage: Message = {
                id: "bot_" + Date.now().toString(),
                text: res.data.resposta,
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            const errorMessage: Message = {
                id: "error_" + Date.now().toString(),
                text: "⚠️ Ocorreu um erro ao processar sua mensagem.",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, user]);

    const clearHistory = useCallback(() => {
        if (!user?.id) return;

        Alert.alert(
            "Limpar Histórico",
            "Tem certeza que deseja apagar todo o histórico de conversas?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Limpar",
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_BASE_URL}/chat/limpar_historico?usuario_id=${user.id}`);
                            setMessages([INITIAL_BOT_MESSAGE]);
                            Alert.alert("Sucesso", "Histórico limpo com sucesso!");
                        } catch (error) {
                            console.error("Erro ao limpar histórico:", error);
                            Alert.alert("Erro", "Falha ao limpar histórico.");
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    }, [user?.id]);

    const renderMessageItem = useCallback(({ item }: { item: Message }) => {
        if (item.sender === "bot" && item.text.includes("📋")) {
            return <Animatable.View animation="fadeIn" duration={300}><BotCardapioMessage text={item.text} /></Animatable.View>;
        }
        return <Animatable.View animation="fadeIn" duration={300}><ChatMessage {...item} /></Animatable.View>;
    }, []);

    const flatListPaddingBottom = Platform.OS === 'ios' ? MESSAGE_INPUT_HEIGHT_IOS : MESSAGE_INPUT_HEIGHT_ANDROID;

    return (
        <KeyboardAvoidingView
            style={tw`flex-1 bg-[#f7f7f7]`}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <View style={tw`flex-1`}>
                <Animatable.View animation="fadeInDown" duration={800} delay={100}>
                    <AppHeader title="Assistente da Cantina">
                        <TouchableOpacity
                            onPress={clearHistory}
                            style={tw`absolute top-12 right-6 p-2.5 rounded-full bg-transparent`}
                        >
                            <Animatable.View animation="bounceIn" duration={800} delay={500}>
                                <Ionicons name="trash-outline" size={25} color="white" />
                            </Animatable.View>
                        </TouchableOpacity>
                    </AppHeader>
                </Animatable.View>

                <Animatable.View animation="fadeIn" duration={800} delay={300} style={tw`flex-1`}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMessageItem}
                        contentContainerStyle={{ paddingBottom: flatListPaddingBottom, paddingTop: 16 }}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => {
                            if (Platform.OS === 'ios') {
                                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
                            } else {
                                flatListRef.current?.scrollToEnd({ animated: true });
                            }
                        }}
                        onLayout={() => {
                             if (Platform.OS === 'ios') {
                                 setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
                             } else {
                                 flatListRef.current?.scrollToEnd({ animated: true });
                             }
                        }}
                    />

                    {isLoading && (
                        <Animatable.View animation="fadeIn" duration={300} style={tw`bg-gray-100 rounded-bl-none border border-gray-200 self-start p-3 mx-4 my-2 max-w-3/4`}>
                            <View style={tw`flex-row items-center`}>
                                <ActivityIndicator size="small" color="#005B7F" style={tw`mr-2`} />
                                <Text style={tw`text-gray-500 italic`}>Digitando...</Text>
                            </View>
                        </Animatable.View>
                    )}
                </Animatable.View>

                <Animatable.View animation="fadeInUp" duration={800} delay={200}>
                    <MessageInput
                        input={input}
                        setInput={setInput}
                        sendMessage={sendMessage}
                        isLoading={isLoading}
                    />
                </Animatable.View>
            </View>
        </KeyboardAvoidingView>
    );
}