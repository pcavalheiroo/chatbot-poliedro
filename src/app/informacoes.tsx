// app/(app)/informacoes.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import AppHeader from '../components/AppHeader'; // Ajuste o caminho
import PageContainer from '../components/PageContainer';

export default function Informacoes() {
  const handlePressLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={tw`flex-1 bg-[#f7f7f7]`}>
      <PageContainer>
        <AppHeader title="Informações" />
        <ScrollView contentContainerStyle={tw`p-6 pt-4`}>
          {/* Título da Seção */}
          <Text style={tw`text-3xl font-bold mb-6 text-[#005B7F] text-center`}>
            PoliChat Restaurante
          </Text>

          {/* Horários de Funcionamento */}
          <View style={tw`bg-white rounded-lg p-5 mb-6 shadow-md`}>
            <View style={tw`flex-row items-center mb-3`}>
              <Ionicons name="time-outline" size={24} color={tw.color('orange-500')!} style={tw`mr-3`} />
              <Text style={tw`text-xl font-bold text-gray-800`}>Horários de Funcionamento</Text>
            </View>
            <Text style={tw`text-base text-gray-700 mb-1 ml-9`}>Segunda a Sexta: 08:00 - 18:00</Text>
            <Text style={tw`text-base text-gray-700 mb-1 ml-9`}>Sábado: 09:00 - 14:00</Text>
            <Text style={tw`text-base text-gray-700 ml-9`}>Domingo: Fechado</Text>
          </View>

          {/* Contato */}
          <View style={tw`bg-white rounded-lg p-5 mb-6 shadow-md`}>
            <View style={tw`flex-row items-center mb-3`}>
              <Ionicons name="call-outline" size={24} color={tw.color('green-500')!} style={tw`mr-3`} />
              <Text style={tw`text-xl font-bold text-gray-800`}>Contato</Text>
            </View>
            <TouchableOpacity onPress={() => handlePressLink('tel:+5511987654321')} style={tw`flex-row items-center mb-2 ml-9`}>
              <Ionicons name="call" size={18} color={tw.color('gray-600')!} style={tw`mr-2`} />
              <Text style={tw`text-base text-blue-600 underline`}>+55 11 98765-4321</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePressLink('mailto:contato@polichat.com')} style={tw`flex-row items-center mb-2 ml-9`}>
              <Ionicons name="mail" size={18} color={tw.color('gray-600')!} style={tw`mr-2`} />
              <Text style={tw`text-base text-blue-600 underline`}>contato@polichat.com</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePressLink('https://wa.me/5511987654321')} style={tw`flex-row items-center ml-9`}>
              <Ionicons name="logo-whatsapp" size={18} color={tw.color('gray-600')!} style={tw`mr-2`} />
              <Text style={tw`text-base text-blue-600 underline`}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          {/* Endereço */}
          <View style={tw`bg-white rounded-lg p-5 mb-6 shadow-md`}>
            <View style={tw`flex-row items-center mb-3`}>
              <Ionicons name="location-outline" size={24} color={tw.color('red-500')!} style={tw`mr-3`} />
              <Text style={tw`text-xl font-bold text-gray-800`}>Localização</Text>
            </View>
            <Text style={tw`text-base text-gray-700 mb-2 ml-9`}>Av. Bernardino de Campos, 270</Text>
            <Text style={tw`text-base text-gray-700 ml-9`}>Paraíso, São Paulo - SP</Text>
            <TouchableOpacity onPress={() => handlePressLink('https://www.google.com/maps/place/Poliedro+Curso+-+São+Paulo,+Paraíso/@-23.5737235,-46.6452082,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce599741e993bf:0xfc0e19abbb55dab5!8m2!3d-23.5737235!4d-46.6426279!16s%2Fg%2F1vnrm41f?entry=ttu&g_ep=EgoyMDI1MDUyNy4wIKXMDSoASAFQAw%3D%3D')} style={tw`flex-row items-center mt-3 ml-9`}>
              <Ionicons name="map" size={18} color={tw.color('blue-600')!} style={tw`mr-2`} />
              <Text style={tw`text-base text-blue-600 underline`}>Ver no Mapa</Text>
            </TouchableOpacity>
          </View>

          {/* Redes Sociais (Opcional) */}
          <View style={tw`bg-white rounded-lg p-5 mb-6 shadow-md`}>
            <View style={tw`flex-row items-center mb-3`}>
              <Ionicons name="share-social-outline" size={24} color={tw.color('purple-500')!} style={tw`mr-3`} />
              <Text style={tw`text-xl font-bold text-gray-800`}>Redes Sociais</Text>
            </View>
            <View style={tw`flex-row justify-around mt-2`}>
              <TouchableOpacity onPress={() => handlePressLink('https://www.instagram.com/poliedrocurso')} style={tw`items-center`}>
                <Ionicons name="logo-instagram" size={36} color={tw.color('pink-600')!} />
                <Text style={tw`text-xs text-gray-600`}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePressLink('https://www.facebook.com/poliedrocurso/?locale=pt_BR')} style={tw`items-center`}>
                <Ionicons name="logo-facebook" size={36} color={tw.color('blue-800')!} />
                <Text style={tw`text-xs text-gray-600`}>Facebook</Text>
              </TouchableOpacity>
              {/* Adicione outras redes sociais */}
            </View>
          </View>

        </ScrollView>
      </PageContainer>

    </View>
  );
}

// Se precisar de estilos adicionais que twrnc não cobre
const styles = StyleSheet.create({});