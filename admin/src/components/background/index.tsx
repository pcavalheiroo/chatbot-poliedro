import { View, Image } from 'react-native';

export function Background() {
  return (
    <View className="absolute inset-0 -z-10">
      {/* Topo esquerdo */}
      <Image
        source={require('../../../assets/images/img1.png')}
        className="absolute top-5 left-[-20] w-50 h-50 opacity-40"
        resizeMode="contain"
      />

      {/* Centro superior direito */}
      <Image
        source={require('../../../assets/images/img2.png')}
        className="absolute top-20 right-[-80] w-50 h-50 opacity-40"
        resizeMode="contain"
      />

      {/* Inferior esquerdo */}
      <Image
        source={require('../../../assets/images/img3.png')}
        className="absolute bottom-[-100] left-10 w-50 h-50 opacity-40"
        resizeMode="contain"
      />
    </View>
  );
}
