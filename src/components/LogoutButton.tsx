// components/LogoutButton.tsx
import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import * as Animatable from "react-native-animatable";

interface LogoutButtonProps {
    onPress: () => void;
}

export default function LogoutButton({ onPress }: LogoutButtonProps) {
    return (
        <Animatable.View animation="fadeInRight" duration={600} style={tw`absolute top-12 right-3 z-50`}>
            <TouchableOpacity onPress={onPress} style={tw`p-2.5 rounded-full bg-transparent`}>
                <Ionicons name="log-out-outline" size={25} color="#2a52be" />
            </TouchableOpacity>
        </Animatable.View>
    );
}
