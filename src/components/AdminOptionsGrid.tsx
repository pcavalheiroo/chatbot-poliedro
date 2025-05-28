// components/AdminOptionsGrid.tsx
import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import tw from "twrnc";

interface AdminOptionProps {
    title: string;
    onPress: () => void;
    Icon: React.ReactNode;
    bgColor: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Sub-componente para cada opção (reutilizado do HomeOption, mas mais simples aqui)
const AdminOption: React.FC<AdminOptionProps> = ({ title, onPress, Icon, bgColor, position }) => {
    let containerStyle;
    switch (position) {
        case 'top-left': containerStyle = tw`top-0 left-0`; break;
        case 'top-right': containerStyle = tw`top-0 right-0`; break;
        case 'bottom-left': containerStyle = tw`bottom-0 left-0`; break;
        case 'bottom-right': containerStyle = tw`bottom-0 right-0`; break;
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                tw`absolute w-28 h-28 rounded-full items-center justify-center shadow-lg`,
                // AQUI ESTÁ A CORREÇÃO: Aplique tw`...` ao bgColor recebido
                tw`${bgColor}`, // <--- CORREÇÃO AQUI!
                containerStyle
            ]}
        >
            <View style={tw`mb-1`}>
                {Icon}
            </View>
            <Text style={tw`text-white text-base font-semibold text-center`}>{title}</Text>
        </TouchableOpacity>
    );
};


export default function AdminOptionsGrid() {
    const router = useRouter();

    return (
        <View style={tw`relative w-80 h-80 mx-auto mt-10`}>
            {/* Círculo central com logo simples do PoliChat */}
            <View style={tw`absolute top-1/2 left-1/2 w-40 h-40 bg-[#f7f7f7] rounded-full -ml-20 -mt-20 z-10 flex items-center justify-center`}>
                <Image source={require("../assets/logos/logo-simples.jpg")} style={tw`w-32 h-32`} resizeMode="contain" />
            </View>

            {/* Opções em grid */}
            <View style={tw`flex-row flex-wrap w-full h-full justify-between`}>
                <AdminOption
                    title="Gerenciar Cardápio"
                    onPress={() => router.push('./cardapio-gerenciar')}
                    Icon={<Ionicons name="fast-food" size={24} color="#f7f7f7" />}
                    bgColor="bg-[#1E88E5]" // <--- PASSE A CLASSE TAILWIND COMO STRING
                    position="top-left"
                />
                <AdminOption
                    title="Gerenciar Pedidos"
                    onPress={() => router.push('./pedidos-gerenciar')}
                    Icon={<Ionicons name="receipt" size={24} color="#f7f7f7" />}
                    bgColor="bg-[#D84315]" // <--- PASSE A CLASSE TAILWIND COMO STRING
                    position="top-right"
                />
                <AdminOption
                    title="Gerenciar Usuários"
                    onPress={() => alert("Funcionalidade em desenvolvimento")}
                    Icon={<Ionicons name="people" size={24} color="#f7f7f7" />}
                    bgColor="bg-[#673AB7]" // <--- PASSE A CLASSE TAILWIND COMO STRING
                    position="bottom-left"
                />
                <AdminOption
                    title="Relatórios"
                    onPress={() => alert("Funcionalidade em desenvolvimento")}
                    Icon={<Ionicons name="stats-chart" size={24} color="#f7f7f7" />}
                    bgColor="bg-[#00BFA5]" // <--- PASSE A CLASSE TAILWIND COMO STRING
                    position="bottom-right"
                />
            </View>
        </View>
    );
}