import { View, Text, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HomeOption from "../components/HomeOption";

export default function Index() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1 }} className="bg-[#f7f7f7] px-12" showsVerticalScrollIndicator={false}>
      <Image source={require("../assets/logo.jpg")} className="w-full h-36 mt-20 self-center" />

      <Text className="text-4xl pt-5 font-bold">Bem-vindo ao PoliChat!</Text>
      <Text className="text-xl py-3">Selecione uma das opções abaixo e faça seu pedido.</Text>

      <View className="relative w-80 h-80 mx-auto mt-10">
        <View className="absolute top-1/2 left-1/2 w-40 h-40 bg-[#f7f7f7] rounded-full -ml-20 -mt-20 z-10 flex items-center justify-center">
          <Image source={require("../assets/logo-simples.jpg")} className="w-32 h-32" resizeMode="contain" />
        </View>

        <View className="flex-row flex-wrap w-full h-full justify-between">
          <HomeOption
            title="Cardápio"
            onPress={() => router.push("./cardapio")}
            Icon={<Ionicons name="restaurant" size={24} color="#FFF" />}
            bgColor="#FAA41F"
            position="top-left"
          />
          <HomeOption
            title="Chatbot"
            onPress={() => router.push("./chatbot")}
            Icon={<Ionicons name="chatbubble-ellipses" size={24} color="#FFF" />}
            bgColor="#EA5E3F"
            position="top-right"
          />
          <HomeOption
            title="Pedidos"
            onPress={() => router.push("./pedidos")}
            Icon={<Ionicons name="clipboard" size={24} color="#FFF" />}
            bgColor="#005B7F"
            position="bottom-left"
          />
          <HomeOption
            title="Histórico"
            onPress={() => router.push("./historico")}
            Icon={<Ionicons name="time" size={24} color="#FFF" />}
            bgColor="#244D51"
            position="bottom-right"
          />
        </View>
      </View>
    </ScrollView>
  );
}