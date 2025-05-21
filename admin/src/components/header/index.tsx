import { Ionicons } from '@expo/vector-icons';
import { Pressable, View, Image, Text } from 'react-native';

export function Header() {
  return (
    <View className="w-full flex-row items-center justify-between bg-white px-4 py-2">
      
      {/* Lado esquerdo - Ícone do menu */}
      <Pressable>
        <Ionicons name="menu" size={24} color="#121212" />
      </Pressable>

      {/* Centro - Logo - Texto */}
      <View className='flex flex-column items-center'>
        <Image
          source={require('../../../assets/images/logo.png')}
          className="w-32 h-10"
          resizeMode="contain"
        />
        <Text className="text-xl font-bold text-black mt-5">
          Admin
        </Text>
      </View>

      {/* Lado direito - Vazio (ou algo no futuro) */}
      <View className="w-6" />
    </View>
  );
}



