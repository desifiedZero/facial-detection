import { Slot } from 'expo-router';
import React from 'react';
import { StatusBar, View } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function AuthLayout() {
  return <RootSiblingParent>
    <View style={{
      display: "flex",
      flexGrow: 1,
    }}>
      <Slot />
    </View>
  </RootSiblingParent>;
}