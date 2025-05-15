import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import {
  FontAwesome,
  MaterialIcons,
  Feather,
  Entypo,
} from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <ScrollView className="min-h-screen bg-[#F8F8F8] px-6 pt-12">
      {/* LOGO */}
      <View className="items-center mb-8">
        <Image
          source={require("../assets/logo-poliedro.svg")} // ⬅️ Substitua com seu caminho
          style={{ width: 160, height: 160, resizeMode: "contain" }}
        />
      </View>

      {/* TÍTULO */}
      <View className="items-center mb-6">
        <Text className="text-2xl font-diodrum text-[#3C3C3C]">
        Bem-vindo ao Restaurante Poliedro
      </Text>
      <Text className="text-base text-[#3C3C3C] mt-3 text-center">
        Escolha uma opção para começar
      </Text>
    </View>

      {/* OPÇÕES */ }
  <View className="gap-5 mb-10">
    <HomeOption
      title="Ver Cardápio"
      color="#1FB4C3"
      icon={<FontAwesome name="cutlery" size={28} color="white" />}
      onPress={() => router.push("/cardapio")}
    />
    <HomeOption
      title="PoliChat"
      color="#EE2252"
      icon={<MaterialIcons name="chat" size={28} color="white" />}
      onPress={() => router.push("/chatbot")}
    />
    <HomeOption
      title="Meu Pedido"
      color="#FAA41F"
      icon={<Entypo name="shopping-bag" size={28} color="white" />}
      onPress={() => router.push("/pedido")}
    />
    <HomeOption
      title="Histórico"
      color="#CC4014"
      icon={<Feather name="clock" size={28} color="white" />}
      onPress={() => router.push("/historico")}
    />
  </View>
    </ScrollView >
  );
}

function HomeOption({ title, icon, onPress, color }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
      }}
      className="space-x-4"
    >
      {icon}
      <Text className="text-white text-lg font-[Diodrum-Semibold]">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
