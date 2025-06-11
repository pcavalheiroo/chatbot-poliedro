// components/MessageInput.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface MessageInputProps {
    input: string;
    setInput: (text: string) => void;
    sendMessage: () => void;
    isLoading: boolean;
}

export default function MessageInput({ input, setInput, sendMessage, isLoading }: MessageInputProps) {
    // Para iOS, adicionamos um padding extra na parte inferior para a "safe area" do teclado.
    // Isso evita que o conteúdo do TextInput fique escondido atrás da borda inferior do teclado.
    const safeAreaBottomPadding = Platform.OS === 'ios' ? tw`pb-6` : tw`pb-2`; // 20px para iOS, 8px para Android (ajuste conforme o seu design)

    return (
        <View style={[
            tw`bg-white px-3 pt-3`,
            safeAreaBottomPadding
        ]}>
            <View style={tw`flex-row items-center bg-gray-100 rounded-full px-6`}>
                <TextInput
                    style={tw`flex-1 h-12 text-base text-gray-800`}
                    autoCorrect={true}
                    autoComplete="off"
                    spellCheck={true}
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
    );
}