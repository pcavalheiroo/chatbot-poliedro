import { View, Image } from "react-native";
import HomeOption from "./HomeOption";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeOptionsGrid() {
    const router = useRouter();

    return (
        <View className="relative w-80 h-80 mx-auto mt-10">
            <View className="absolute top-1/2 left-1/2 w-40 h-40 bg-[#f7f7f7] rounded-full -ml-20 -mt-20 z-10 flex items-center justify-center">
                <Image source={require("../assets/logos/logo-simples.jpg")} className="w-32 h-32" resizeMode="contain" />
            </View>

            <View className="flex-row flex-wrap w-full h-full justify-between">
                <HomeOption
                    title="Cardápio"
                    onPress={() => router.push("./cardapio")}
                    Icon={<Ionicons name="restaurant" size={24} color="#f7f7f7" />}
                    bgColor="#FAA41F"
                    position="top-left"
                />
                <HomeOption
                    title="Chatbot"
                    onPress={() => router.push("./chatbot")}
                    Icon={<Ionicons name="chatbubble-ellipses" size={24} color="#f7f7f7" />}
                    bgColor="#EA5E3F"
                    position="top-right"
                />
                <HomeOption
                    title="Pedidos"
                    onPress={() => router.push("./pedido")}
                    Icon={<Ionicons name="clipboard" size={24} color="#f7f7f7" />}
                    bgColor="#005B7F"
                    position="bottom-left"
                />
                <HomeOption
                    title="Histórico"
                    onPress={() => router.push("./historico")}
                    Icon={<Ionicons name="time" size={24} color="#f7f7f7" />}
                    bgColor="#00BBE8"
                    position="bottom-right"
                />
            </View>
        </View>
    );
}
