import React from "react";
import { StyleSheet, Text, View, Pressable, Alert, ImageBackground, StatusBar, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import InputField from "../../components/inputField";
import { BaseButton } from "react-native-gesture-handler";
import { Link } from "expo-router";
import Toast from "react-native-root-toast";
import { toastConfig } from "../../common/util";

export default function CameraPage() {
  const [password, setPassword] = React.useState<string>('');

  return (
    <View style={styles.content}>
      <View style={{
        flexGrow: 1,
        justifyContent: "center",
      }}>
        <Text style={styles.title}>RESET PASSWORD</Text>
        <View style={styles.inputs}>
          <InputField value={password} setValue={setPassword} placeHolder="password" iconName="user" iconSize={20} autoComplete="new-password" isPassword />
          <Link href='/login' asChild>
            <BaseButton style={{
              backgroundColor: "#0097C7",
              borderRadius: 20,
              padding: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              Toast.show("Password set!", toastConfig);
            }}>
              <Text style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "800"
              }}>SET PASSWORD</Text>
            </BaseButton>
          </Link>
        </View>
      </View>
      
      <Link href='/login' asChild>
        <BaseButton style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          borderRadius: 10
        }}>
          <Text style={{
            color: "#494949",
            fontSize: 18,
            fontWeight: "800"
          }}>Remember your password?</Text>
          <Text style={{
            color: "#0097C7",
            fontSize: 18,
            fontWeight: "800"
          }}> Login</Text>
        </BaseButton>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "rgba(73, 73, 73, 0.40)",
    fontSize: 50,
    fontStyle: "normal",
    fontWeight: "700",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  }, 
  inputs: {
    display: "flex",
    flexDirection: "column",
    rowGap: 10,
  },
});