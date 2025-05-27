// components/BotCardapioMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tw from 'twrnc';

interface BotCardapioMessageProps {
    text: string;
}

export default function BotCardapioMessage({ text }: BotCardapioMessageProps) {
    return (
        <View style={tw`bg-gray-100 rounded-lg p-4 my-2 mx-4 border border-gray-200 self-start`}>
            {text.split('\n').map((line, index) => {
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
                    const [nomePreco, ...descricao] = line.split("   "); // Atenção ao espaçamento
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