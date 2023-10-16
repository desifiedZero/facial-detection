import { Slot, usePathname } from 'expo-router';
import { StatusBar, StyleSheet, View } from "react-native";
import * as Location from "expo-location";

export default function HomeLayout() {
  const pathname = usePathname();

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: !pathname.includes('camera') ? 20 : 0,
    }
  });

  return (
    <View style={styles.container}>
      <Slot />
    </View>);
}

