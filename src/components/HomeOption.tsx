import { TouchableOpacity, Text, Image, View } from 'react-native';
import { ReactNode } from 'react';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

interface Props {
    title: string;
    onPress: () => void;
}

function HomeOption({ title, Icon, onPress, color }: any) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center rounded-2xl ${color} p-4 shadow-md`}
        >
            <View className="mr-4">{Icon}</View>
            <Text className="text-white font-diodrum text-lg">{title}</Text>
        </TouchableOpacity>
    );
}
