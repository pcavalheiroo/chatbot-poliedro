import { SvgUri } from 'react-native-svg';
import { View } from 'react-native';

export default function Logo() {
    return (
        <View className="w-40 h-40 items-center justify-center">
            <SvgUri width="100%" height="100%" uri={require('../assets/logo-poliedro.svg')} />
        </View>
    );
}
