// components/MessageInput.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface MessageInputProps {
    input: string;
    setInput: (text: string) => void;
    sendMessage: () => void;
    isLoading: boolean;
}

export default function MessageInput({ input, setInput, sendMessage, isLoading }: MessageInputProps) {
    return (
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
    );
}