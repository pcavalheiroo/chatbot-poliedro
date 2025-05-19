import { View, Text, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import HomeOption from "../components/HomeOption";

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }} className="bg-[#f7f7f7] px-12 relative">

      <Image
        source={require("../assets/poliedros/1.png")}
        style={{ position: "absolute", top: 225, right: -20, width: 100, height: 100, opacity: 0.7 }}
        resizeMode="contain"
      />

      <Image
        source={require("../assets/poliedros/1.png")}
        style={{ position: "absolute", top: 395, left: -65, width: 100, height: 100 }}
        resizeMode="contain"
      />

      <Image
        source={require("../assets/poliedros/9.png")}
        style={{ position: "absolute", top: 550, left: 10, width: 100, height: 100 }}
        resizeMode="contain"
      />

      <Image
        source={require("../assets/poliedros/4.png")}
        style={{ position: "absolute", top: -30, left: -30, width: 100, height: 100 }}
        resizeMode="contain"
      />

      <Image
        source={require("../assets/poliedros/5.png")}
        style={{ position: "absolute", top: -20, right: -30, width: 100, height: 100 }}
        resizeMode="contain"
      />

      <Image
        source={require("../assets/poliedros/6.png")}
        style={{ position: "absolute", top: 418, right: 50, width: 100, height: 100 }}
        resizeMode="contain"
      />

      <Image
        source={require("../assets/poliedros/7.png")}
        style={{ position: "absolute", bottom: 100, right: -70, width: 100, height: 100 }}
        resizeMode="contain"
      />

      <Image
        source={require("../assets/poliedros/8.png")}
        style={{ position: "absolute", bottom: 0, left: -40, width: 100, height: 100 }}
        resizeMode="contain"
      />

      <Image
        source={require("../assets/poliedros/10.png")}
        style={{ position: "absolute", bottom: -60, right: 50, width: 100, height: 100 }}
        resizeMode="contain"
      />

      <Image source={require("../assets/logo.jpg")} className="w-full h-36 mt-20 self-center" />

      <View className="h-px w-full mt-5 bg-gray-300" />

      <Text className="text-4xl pt-8 font-bold">Bem-vindo ao PoliChat!</Text>
      <Text className="text-xl py-3">Selecione uma das opções abaixo e faça seu pedido.</Text>

      <View className="h-px w-full mt-7 bg-gray-300" />

      <View className="relative w-80 h-80 mx-auto mt-10">
        <View className="absolute top-1/2 left-1/2 w-40 h-40 bg-[#f7f7f7] rounded-full -ml-20 -mt-20 z-10 flex items-center justify-center">
          <Image source={require("../assets/logo-simples.jpg")} className="w-32 h-32" resizeMode="contain" />
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
            onPress={() => router.push("./pedidos")}
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
    </View>
  );
}