// components/ChatMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tw from 'twrnc';

interface MessageProps {
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatMessage({ text, sender, timestamp }: MessageProps) {
    const isUser = sender === 'user';
    const messageStyle = isUser
        ? tw`bg-[#005B7F] rounded-br-none self-end`
        : tw`bg-gray-100 rounded-bl-none border border-gray-200 self-start`;
    const textColor = isUser ? tw`text-white` : tw`text-gray-800`;
    const timeColor = isUser ? tw`text-blue-200` : tw`text-gray-500`;

    return (
        <View
            style={[
                tw`my-2 mx-4 p-3 rounded-lg max-w-3/4`,
                messageStyle,
                styles.messageShadow,
            ]}
        >
            <Text style={textColor}>{text}</Text>
            <Text style={[tw`text-xs mt-1`, timeColor]}>
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
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
});