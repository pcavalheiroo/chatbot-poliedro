import { View, Text, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Header from "../components/Header";
import HomeOption from "../components/HomeOption";
import BackgroundPoliedros from "../components/BackgroundPoliedros";
import HomeOptionsGrid from "../components/HomeOptionsGrid";

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }} className="bg-[#f7f7f7] px-12 relative">

      <BackgroundPoliedros />

      <Header />

      <HomeOptionsGrid />
      
    </View>
  );
}