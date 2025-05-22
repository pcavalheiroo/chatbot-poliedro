import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import tw from "twrnc";

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  style?: any;
}

// components/BackButton.tsx
export default function BackButton({ 
  onPress, 
  color = "#2a52be", 
  style 
}: BackButtonProps) {
  const router = useRouter();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Padrão seguro: volta se possível, senão vai para raiz
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={[tw`absolute top-12 left-6 z-50`, style]}
    >
      <Ionicons name="arrow-back" size={24} color={color} />
    </TouchableOpacity>
  );
}