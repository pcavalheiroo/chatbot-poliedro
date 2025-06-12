import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeOptionsGrid() {
    const router = useRouter();

    const options = [
        {
            title: "Cardápio",
            onPress: () => router.push("./cardapio"),
            color: "#FAA41F",
            icon: <Ionicons name="restaurant" size={30} color="#f7f7f7" />,
        },
        {
            title: "Chatbot",
            onPress: () => router.push("./chatbot"),
            color: "#EA5E3F",
            icon: <Ionicons name="chatbubble-ellipses" size={30} color="#f7f7f7" />,
        },
        {
            title: "Pedidos",
            onPress: () => router.push("./pedidos"),
            color: "#005B7F",
            icon: <Ionicons name="clipboard" size={30} color="#f7f7f7" />,
        },
        {
            title: "Info",
            onPress: () => router.push("./informacoes"),
            color: "#00BBE8",
            icon: <Ionicons name="time" size={30} color="#f7f7f7" />,
        },
    ];

    // Diminuir radius um pouco (de 160 para 150)
    const radius = 150;
    const center = 150;
    const angle = 90;

    // Base angles originais
    const baseAngles = [45, 135, 225, 315];

    // Função para converter graus para radianos
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    // Adiciona rotação de 90 graus para direita
    const rotateAngle = (deg: number) => (deg + 90) % 360;

    // Gera o path do segmento
    const getPath = (startAngle: number) => {
        const a1 = toRadians(startAngle);
        const a2 = toRadians(startAngle + angle);

        const x1 = center + radius * Math.cos(a1);
        const y1 = center + radius * Math.sin(a1);

        const x2 = center + radius * Math.cos(a2);
        const y2 = center + radius * Math.sin(a2);

        return `
      M${center},${center}
      L${x1},${y1}
      A${radius},${radius} 0 0,1 ${x2},${y2}
      Z
    `;
    };

    return (
        <View style={{ alignItems: "center", marginTop: 35 }}>
            <View style={{ width: 300, height: 300, position: "relative" }}>
                <Svg width={300} height={300} style={{ position: "absolute", top: 0, left: 0 }}>
                    {options.map((opt, i) => (
                        <Path key={i} d={getPath(rotateAngle(baseAngles[i]))} fill={opt.color} />
                    ))}
                </Svg>

                {options.map((opt, i) => {
                    const angleDeg = rotateAngle(baseAngles[i] + angle / 2);
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

                <View
                    style={{
                        position: "absolute",
                        left: center - 50,
                        top: center - 50,
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
