import { TouchableOpacity, Text, View } from "react-native";
import { ReactNode } from "react";

interface Props {
    title: string;
    onPress: () => void;
    Icon: ReactNode;
    bgColor: string;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export default function HomeOption({ title, onPress, Icon, bgColor, position }: Props) {
    const positionStyle = {
        'top-left': 'rounded-tl-full',
        'top-right': 'rounded-tr-full',
        'bottom-left': 'rounded-bl-full',
        'bottom-right': 'rounded-br-full',
    }[position];

    const isTopOption = position === 'top-left' || position === 'top-right';

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`w-[48%] h-[48%] mb-3 overflow-hidden ${positionStyle}`}
            style={{ backgroundColor: bgColor }}
        >
            <View className="flex-1 justify-center items-center p-4">
                {isTopOption ? (
                    <View className="items-center">
                        <Text className="text-white text-lg text-center mb-2 mt-2">
                            {title}
                        </Text>
                        {Icon}
                    </View>
                ) : (

                    <View className="items-center">
                        <View className="mb-2">{Icon}</View>
                        <Text className="text-white text-lg text-center mb-2">
                            {title}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}