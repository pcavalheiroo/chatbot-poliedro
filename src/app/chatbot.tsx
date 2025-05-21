import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import tw from "twrnc";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
}

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", text: "Olá! Como posso te ajudar hoje?", sender: "bot" },
    ]);
    const [input, setInput] = useState("");
    const flatListRef = useRef<FlatList<Message>>(null);

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: "user"
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const res = await axios.post("http://192.168.1.107:5000/chat", {
                usuario_id: "teste", // Troque por ID real futuramente
                mensagem: input
            });

            const botMessage: Message = {
                id: Date.now().toString() + "_bot",
                text: res.data.resposta, // Correto: 'resposta' (não 'reply')
                sender: "bot"
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errMsg: Message = {
                id: Date.now().toString() + "_err",
                text: "Erro ao conectar com o bot.",
                sender: "bot"
            };
            setMessages((prev) => [...prev, errMsg]);
        }
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const renderItem = ({ item }: { item: Message }) => (
        <View
            style={[
                tw`my-2 px-4 py-2 rounded-lg max-w-3/4`,
                item.sender === "user" ? tw`bg-blue-500 self-end` : tw`bg-gray-200 self-start`,
            ]}
        >
            <Text style={item.sender === "user" ? tw`text-white` : tw`text-black`}>{item.text}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={tw`flex-1 bg-[#f7f7f7] px-4 pt-10`}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={tw`pb-20`}
                showsVerticalScrollIndicator={false}
            />

            <View style={tw`flex-row items-center p-2 bg-white rounded-xl shadow-md absolute bottom-4 left-4 right-4`}>
                <TextInput
                    style={tw`flex-1 text-base p-3`}
                    placeholder="Digite sua mensagem..."
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity onPress={sendMessage} style={tw`ml-2 p-2`}>
                    <Ionicons name="send" size={24} color="#005B7F" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
