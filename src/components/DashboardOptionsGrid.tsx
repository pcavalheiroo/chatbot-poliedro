import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DashboardOptionsGrid() {
  const router = useRouter();

  const options = [
    {
      title: "Cardápio",
      onPress: () => router.push("./cardapio-gerenciar"),
      color: "#1E88E5",
      icon: <Ionicons name="restaurant" size={24} color="#f7f7f7" />,
    },
    {
      title: "Pedidos",
      onPress: () => router.push("./pedidos-gerenciar"),
      color: "#D84315",
      icon: <Ionicons name="receipt" size={24} color="#f7f7f7" />,
    },
    {
      title: "Usuários",
      onPress: () => router.push("./usuarios"),
      color: "#388E3C",
      icon: <Ionicons name="people" size={24} color="#f7f7f7" />,
    },
  ];

  const radius = 150;
  const center = 150;
  const angle = 120;

  // Função para gerar o path SVG de uma fatia de pizza de 120°
  const getPath = (startAngle: number) => {
    const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
    const x2 = center + radius * Math.cos((Math.PI * (startAngle + angle)) / 180);
    const y2 = center + radius * Math.sin((Math.PI * (startAngle + angle)) / 180);

    return `
      M${center},${center}
      L${x1},${y1}
      A${radius},${radius} 0 0,1 ${x2},${y2}
      Z
    `;
  };

  return (
    <View style={{ alignItems: "center", marginTop: 50 }}>
      <View style={{ width: 300, height: 300, position: "relative" }}>
        <Svg width={300} height={300} style={{ position: "absolute", top: 0, left: 0 }}>
          {options.map((opt, i) => (
            <Path key={i} d={getPath(i * 120)} fill={opt.color} />
          ))}
        </Svg>

        {/* Botões sobre cada fatia */}
        {options.map((opt, i) => {
          const angleDeg = i * 120 + 60;
          const x = center + radius * 0.55 * Math.cos((Math.PI * angleDeg) / 180) - 30;
          const y = center + radius * 0.55 * Math.sin((Math.PI * angleDeg) / 180) - 30;

          return (
            <TouchableOpacity
              key={i}
              onPress={opt.onPress}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {opt.icon}
              <Text style={{ color: "#f7f7f7", fontSize: 10, marginTop: 2 }}>{opt.title}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Logo central */}
        <View
          style={{
            position: "absolute",
            left: 100,
            top: 100,
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#f7f7f7",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <Image
            source={require("../assets/logos/logo-simples.jpg")}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}
