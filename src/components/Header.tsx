import { Image, Text, View } from "react-native";
import tw from "twrnc";

export default function Header() {
  return (
    <>
      <Image
        source={require("../assets/logos/logo.jpg")}
        style={tw`w-48 h-48 mt-19 self-center rounded-full border-4 border-white shadow-lg`}
        resizeMode="contain"
      />
      <View className="h-px w-full mt-5 bg-gray-300" />
      <Text className="text-4xl pt-5 font-bold">Bem-vindo ao PoliChat!</Text>
      <Text className="text-xl pt-3">Selecione uma das opções abaixo e faça seu pedido.</Text>
      <View className="h-px w-full mt-7 bg-gray-300" />
    </>
  );
}
