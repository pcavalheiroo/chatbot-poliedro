import { Image, Text, View } from "react-native";

export default function Header() {
  return (
    <>
      <Image source={require("../assets/logos/logo.jpg")} className="w-full h-36 mt-20 self-center" />
      <View className="h-px w-full mt-5 bg-gray-300" />
      <Text className="text-4xl pt-8 font-bold">Bem-vindo ao PoliChat!</Text>
      <Text className="text-xl py-3">Selecione uma das opções abaixo e faça seu pedido.</Text>
      <View className="h-px w-full mt-7 bg-gray-300" />
    </>
  );
}
