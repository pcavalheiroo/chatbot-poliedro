import React from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import AppHeader from '../components/AppHeader';
import PageContainer from '../components/PageContainer';
import * as Animatable from 'react-native-animatable';
import BackgroundPoliedros from '../components/BackgroundPoliedros';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';

export default function Informacoes() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const handlePressLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          onPress: () => {
            setUser(null);
            router.replace("/");
          },
        },
      ]
    );
  };

  const customAnimation = {
    0: {
      opacity: 0,
      translateY: 30,
      scale: 0.95
    },
    1: {
      opacity: 1,
      translateY: 0,
      scale: 1
    },
  };

  return (
    <View style={tw`flex-1 bg-[#f7f7f7] relative`}>
      <BackgroundPoliedros />

      <PageContainer>
        <Animatable.View
          animation="fadeInDown"
          duration={800}
        >
          <AppHeader title="Informações" />
        </Animatable.View>

        <ScrollView contentContainerStyle={tw`p-6 pt-4`}>

          <Animatable.Text
            animation="bounceIn"
            duration={1200}
            style={tw`text-3xl font-bold mb-6 text-[#005B7F] text-center`}
          >
            PoliChat Restaurante
          </Animatable.Text>

          {/* Seção de Horários */}
          <Animatable.View
            animation={customAnimation}
            duration={800}
            delay={200}
            style={tw`bg-white rounded-lg p-5 mb-6 shadow-lg`}
          >
            <View style={tw`flex-row items-center mb-3`}>
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={3000}
              >
                <Ionicons name="time-outline" size={24} color={tw.color('orange-500')!} style={tw`mr-3`} />
              </Animatable.View>
              <Text style={tw`text-xl font-bold text-gray-800`}>Horários de Funcionamento</Text>
            </View>
            <Animatable.Text
              animation="fadeInRight"
              duration={600}
              delay={400}
              style={tw`text-base text-gray-700 mb-1 ml-9`}
            >
              Segunda a Sexta: 08:00 - 18:00
            </Animatable.Text>
            <Animatable.Text
              animation="fadeInRight"
              duration={600}
              delay={500}
              style={tw`text-base text-gray-700 mb-1 ml-9`}
            >
              Sábado: 09:00 - 14:00
            </Animatable.Text>
            <Animatable.Text
              animation="fadeInRight"
              duration={600}
              delay={600}
              style={tw`text-base text-gray-700 ml-9`}
            >
              Domingo: Fechado
            </Animatable.Text>
          </Animatable.View>

          {/* Seção de Contato */}
          <Animatable.View
            animation={customAnimation}
            duration={800}
            delay={300}
            style={tw`bg-white rounded-lg p-5 mb-6 shadow-lg`}
          >
            <View style={tw`flex-row items-center mb-3`}>
              <Animatable.View
                animation="rubberBand"
                duration={1500}
                delay={500}
              >
                <Ionicons name="call-outline" size={24} color={tw.color('green-500')!} style={tw`mr-3`} />
              </Animatable.View>
              <Text style={tw`text-xl font-bold text-gray-800`}>Contato</Text>
            </View>

            <Animatable.View
              animation="fadeInRight"
              duration={600}
              delay={400}
            >
              <TouchableOpacity
                onPress={() => handlePressLink('tel:+5511987654321')}
                style={tw`flex-row items-center mb-2 ml-9`}
                activeOpacity={0.7}
              >
                <Ionicons name="call" size={18} color={tw.color('gray-600')!} style={tw`mr-2`} />
                <Text style={tw`text-base text-blue-600 underline`}>+55 11 98765-4321</Text>
              </TouchableOpacity>
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              duration={600}
              delay={500}
            >
              <TouchableOpacity
                onPress={() => handlePressLink('mailto:contato@polichat.com')}
                style={tw`flex-row items-center mb-2 ml-9`}
                activeOpacity={0.7}
              >
                <Ionicons name="mail" size={18} color={tw.color('gray-600')!} style={tw`mr-2`} />
                <Text style={tw`text-base text-blue-600 underline`}>contato@polichat.com</Text>
              </TouchableOpacity>
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              duration={600}
              delay={600}
            >
              <TouchableOpacity
                onPress={() => handlePressLink('https://wa.me/5511987654321')}
                style={tw`flex-row items-center ml-9`}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-whatsapp" size={18} color={tw.color('gray-600')!} style={tw`mr-2`} />
                <Text style={tw`text-base text-blue-600 underline`}>WhatsApp</Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>

          {/* Seção de Endereço */}
          <Animatable.View
            animation={customAnimation}
            duration={800}
            delay={400}
            style={tw`bg-white rounded-lg p-5 mb-6 shadow-lg`}
          >
            <View style={tw`flex-row items-center mb-3`}>
              <Animatable.View
                animation="swing"
                duration={2000}
                delay={700}
              >
                <Ionicons name="location-outline" size={24} color={tw.color('red-500')!} style={tw`mr-3`} />
              </Animatable.View>
              <Text style={tw`text-xl font-bold text-gray-800`}>Localização</Text>
            </View>

            <Animatable.Text
              animation="fadeInRight"
              duration={600}
              delay={500}
              style={tw`text-base text-gray-700 mb-2 ml-9`}
            >
              Av. Bernardino de Campos, 270
            </Animatable.Text>

            <Animatable.Text
              animation="fadeInRight"
              duration={600}
              delay={600}
              style={tw`text-base text-gray-700 ml-9`}
            >
              Paraíso, São Paulo - SP
            </Animatable.Text>

            <Animatable.View
              animation="fadeInRight"
              duration={600}
              delay={700}
            >
              <TouchableOpacity
                onPress={() => handlePressLink('https://www.google.com/maps/place/Poliedro+Curso+-+São+Paulo,+Paraíso/@-23.5737235,-46.6452082,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce599741e993bf:0xfc0e19abbb55dab5!8m2!3d-23.5737235!4d-46.6426279!16s%2Fg%2F1vnrm41f?entry=ttu&g_ep=EgoyMDI1MDUyNy4wIKXMDSoASAFQAw%3D%3D')}
                style={tw`flex-row items-center mt-3 ml-9`}
                activeOpacity={0.7}
              >
                <Ionicons name="map" size={18} color={tw.color('blue-600')!} style={tw`mr-2`} />
                <Text style={tw`text-base text-blue-600 underline`}>Ver no Mapa</Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>

          {/* Seção de Redes Sociais */}
          <Animatable.View
            animation={customAnimation}
            duration={800}
            delay={500}
            style={tw`bg-white rounded-lg p-5 mb-6 shadow-lg`}
          >
            <View style={tw`flex-row items-center mb-3`}>
              <Animatable.View
                animation="tada"
                duration={1500}
                delay={800}
              >
                <Ionicons name="share-social-outline" size={24} color={tw.color('purple-500')!} style={tw`mr-3`} />
              </Animatable.View>
              <Text style={tw`text-xl font-bold text-gray-800`}>Redes Sociais</Text>
            </View>

            <Animatable.View
              animation="fadeInUp"
              duration={800}
              delay={600}
              style={tw`flex-row justify-around mt-2`}
            >
              <TouchableOpacity
                onPress={() => handlePressLink('https://www.instagram.com/poliedrocurso')}
                style={tw`items-center`}
                activeOpacity={0.7}
              >
                <Animatable.View
                  animation="pulse"
                  iterationCount="infinite"
                  duration={2000}
                >
                  <Ionicons name="logo-instagram" size={36} color={tw.color('pink-600')!} />
                </Animatable.View>
                <Text style={tw`text-xs text-gray-600 mt-1`}>Instagram</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePressLink('https://www.facebook.com/poliedrocurso/?locale=pt_BR')}
                style={tw`items-center`}
                activeOpacity={0.7}
              >
                <Animatable.View
                  animation="pulse"
                  iterationCount="infinite"
                  duration={2000}
                  delay={300}
                >
                  <Ionicons name="logo-facebook" size={36} color={tw.color('blue-800')!} />
                </Animatable.View>
                <Text style={tw`text-xs text-gray-600 mt-1`}>Facebook</Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>

        </ScrollView>
      </PageContainer>
    </View>
  );
}

const styles = StyleSheet.create({});