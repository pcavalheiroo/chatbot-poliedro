// components/AuthLink.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

interface AuthLinkProps {
  question: string;
  linkText: string;
  onPress: () => void;
}

export default function AuthLink({ question, linkText, onPress }: AuthLinkProps) {
  return (
    <View style={tw`flex-row mt-4 mb-8`}>
      <Text style={tw`text-gray-600`}>{question}</Text>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text style={tw`text-[#2a52be] font-bold ml-2`}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
}