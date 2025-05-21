import { View, Image } from 'react-native';

export function Background() {
  return (
    <View className="absolute inset-0 bg-gray-200 z-[-1]">
      {/* Imagem 1 */}
      <Image
        source={require('../../../assets/images/img1.png')}
        className="absolute w-20 h-20 top-10 left-5 opacity-20"
      />

      {/* Imagem 2 */}
      <Image
        source={require('../../../assets/images/img2.png')}
        className="absolute w-24 h-24 bottom-10 right-5 opacity-20"
      />

      {/* Imagem 3 */}
      <Image
        source={require('../../../assets/images/img3.png')}
        className="absolute w-16 h-16 top-1/2 left-1/3 opacity-20"
      />
    </View>
  );
}







