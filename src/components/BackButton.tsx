import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import tw from "twrnc";

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  style?: any;
}

export default function BackButton({ onPress, color = "#000000", style }: BackButtonProps) {
  const router = useRouter();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={[tw`absolute top-13 left-6 z-10`, style]}
    >
      <Ionicons name="arrow-back" size={28} color={color} />
    </TouchableOpacity>
  );
}