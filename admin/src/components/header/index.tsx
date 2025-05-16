import { Ionicons } from '@expo/vector-icons'
import { Pressable, View } from 'react-native'

export function Header() {
    return (
      <View>
        <Pressable>
            <Ionicons name='menu' size={20} color="#202020">

            </Ionicons>
        </Pressable>
      </View>
    )
  }


