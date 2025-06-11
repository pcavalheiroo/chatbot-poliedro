// components/BackButton.tsx
import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import tw from "twrnc";
import * as Animatable from "react-native-animatable";

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export default function BackButton({ onPress, color = "#2a52be", style }: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      try {
        if (router.canGoBack?.()) {
          router.back();
        } else {
          router.replace("/");
        }
      } catch (err) {
        console.error("Erro ao navegar com router.back()", err);
        router.replace("/");
      }
    }
  };

  return (
    <Animatable.View animation="fadeInLeft" duration={600} style={[tw`absolute top-14 left-6 z-50`, style]}>
      <TouchableOpacity
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
      >
        <Ionicons name="arrow-back" size={24} color={color} />
      </TouchableOpacity>
    </Animatable.View>
  );
}
