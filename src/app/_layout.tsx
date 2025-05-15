import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Diodrum-Semibold": require("../assets/fonts/Diodrum-Semibold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8F8F8]">
        <ActivityIndicator size="large" color="#1FB4C3" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8F8F8]">
      <Slot />
    </View>
  );
}
