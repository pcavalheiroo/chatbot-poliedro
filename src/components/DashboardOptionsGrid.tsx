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
      onPress: () => router.push("./cardapio_gerenciar"),
      color: "#FAA41F", // Laranja vibrante
      icon: <Ionicons name="restaurant" size={30} color="#f7f7f7" />,
    },
    {
      title: "Pedidos",
      onPress: () => router.push("./pedidos_gerenciar"),
      color: "#00BBE8", // Vermelho forte
      icon: <Ionicons name="receipt" size={30} color="#f7f7f7" />,
    },
    {
      title: "Usuários",
      onPress: () => router.push("./usuarios_gerenciar"),
      color: "#EE2252", // Azul vibrante EE2252
      icon: <Ionicons name="people" size={30} color="#f7f7f7" />,
    },
  ];

  const radius = 150;
  const center = 150;
  const angle = 120;
  const baseAngles = [30, 150, 270];

  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const getPath = (startAngle: number) => {
    const x1 = center + radius * Math.cos(toRadians(startAngle));
    const y1 = center + radius * Math.sin(toRadians(startAngle));
    const x2 = center + radius * Math.cos(toRadians(startAngle + angle));
    const y2 = center + radius * Math.sin(toRadians(startAngle + angle));

    return `
      M${center},${center}
      L${x1},${y1}
      A${radius},${radius} 0 0,1 ${x2},${y2}
      Z
    `;
  };

  return (
    <View style={{ alignItems: "center", marginTop: 5 }}>
      <View style={{ width: 300, height: 300, position: "relative" }}>
        <Svg width={300} height={300} style={{ position: "absolute", top: 0, left: 0 }}>
          {options.map((opt, i) => (
            <Path key={i} d={getPath(baseAngles[i])} fill={opt.color} />
          ))}
        </Svg>

        {/* Botões posicionados no centro de cada setor */}
        {options.map((opt, i) => {
          const angleDeg = baseAngles[i] + angle / 2;
          const distance = radius * 0.6;
          const x = center + distance * Math.cos(toRadians(angleDeg)) - 40;
          const y = center + distance * Math.sin(toRadians(angleDeg)) - 40;

          return (
            <TouchableOpacity
              key={i}
              onPress={opt.onPress}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {opt.icon}
              <Text
                style={{
                  color: "#f7f7f7",
                  fontSize: 12,
                  fontWeight: "bold",
                  marginTop: 4,
                  textAlign: "center",
                }}
              >
                {opt.title}
              </Text>
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
