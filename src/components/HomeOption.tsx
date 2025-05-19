import { TouchableOpacity, Text, View, Platform } from "react-native";
import { ReactNode } from "react";

interface Props {
    title: string;
    onPress: () => void;
    Icon: ReactNode;
    bgColor: string;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export default function HomeOption({
    title,
    onPress,
    Icon,
    bgColor,
    position,
}: Props) {
    const positionStyle = {
        "top-left": "rounded-tl-full",
        "top-right": "rounded-tr-full",
        "bottom-left": "rounded-bl-full",
        "bottom-right": "rounded-br-full",
    }[position];

    const isTopOption = position === "top-left" || position === "top-right";

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            className={`w-[48%] h-[48%] mb-3 ${positionStyle}`}
            style={{
                backgroundColor: bgColor,
                borderRadius: 999,
                padding: 10,
                // // 🔽 sombra para iOS
                // shadowColor: "#000",
                // shadowOffset: { width: 0, height: 6 },
                // shadowOpacity: 0.25,
                // shadowRadius: 6,
                // // 🔽 sombra para Android
                // elevation: 8,
            }}
        >
            <View className="flex-1 justify-center items-center">
                {isTopOption ? (
                    <View className="items-center">
                        <Text className="text-[#f7f7f7] text-md mb-2 ml-2">{title}</Text>
                        {Icon}
                    </View>
                ) : (
                    <View className="items-center">
                        <View className="mb-2">{Icon}</View>
                        <Text className="text-[#f7f7f7] text-md ml-2">{title}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}
