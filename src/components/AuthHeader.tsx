// components/AuthHeader.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import tw from 'twrnc';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={tw`items-center mb-8`}>
      <Image
        source={require("../assets/logos/logo.jpg")}
        style={tw`w-48 h-48 rounded-full border-4 border-white shadow-lg`}
        resizeMode="contain"
      />
      <Text style={tw`text-3xl font-bold mt-9`}>{title}</Text>
      <Text style={tw`text-lg text-center mt-3 mb-4`}>{subtitle}</Text>
    </View>
  );
}