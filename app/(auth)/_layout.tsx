import { Slot } from 'expo-router';
import { StatusBar, StyleSheet, View } from "react-native";

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <Slot />
    </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: "7%",
  }
});