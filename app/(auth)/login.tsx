import React from "react";
import { StyleSheet, Text, View, Pressable, Alert, ImageBackground, StatusBar, TextInput, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import InputField from "../../components/inputField";
import { BaseButton } from "react-native-gesture-handler";
import { Link, useRouter } from "expo-router";
import Toast from "react-native-root-toast";
import { toastConfig } from "../../common/util";
import * as SecureStore from 'expo-secure-store';

export default function CameraPage() {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [loggingIn, setLogginIn] = React.useState<boolean>(false);

  const router = useRouter();

  const loginUser = async () => {
    console.log('login user');
    setLogginIn(true);

    fetch('http://192.168.18.55:8000/api/token/', {
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((json) => {
          console.log(json)
          SecureStore.setItemAsync('loginStatus', JSON.stringify(json)).then(() => {
            Toast.show("Login successful!", toastConfig);
            router.replace('/');
          });
        });
      } else {
        Toast.show("Invalid username or password!", toastConfig);
      }
    }).catch((error) => {
      console.log(error.message);
      Toast.show("Server Error: Please try again later!", toastConfig);
    }).finally(() => {
      setLogginIn(false);
    });
  };

  return (
    <View style={styles.content}>
      <View style={{
        flexGrow: 1,
        justifyContent: "center",
      }}>
        <Text style={styles.title}>LOGIN</Text>
        <View style={styles.inputs}>
          <InputField value={username} setValue={setUsername} placeHolder="username" iconName="user" iconSize={20} autoComplete="username" />
          <InputField value={password} setValue={setPassword} placeHolder="password" iconName="lock" iconSize={20} autoComplete="password" isPassword />
          <BaseButton style={{
            backgroundColor: "#0097C7",
            borderRadius: 20,
            padding: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            
          }}
          onPress={() => {
            if (!loggingIn) loginUser();
          }}>
            <Text style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "800"
            }}>{loggingIn ? <ActivityIndicator /> : 'LOGIN'}</Text>
          </BaseButton>
          <View>
            <Link href='/forgotPassword' asChild>
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
                }}>Forgot password?</Text>
              </BaseButton>
            </Link>
          </View>
        </View>
      </View>
      
      <Link href='/register' asChild>
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
          }}>Don't have an account?</Text>
          <Text style={{
            color: "#0097C7",
            fontSize: 18,
            fontWeight: "800"
          }}> Register</Text>
        </BaseButton>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "rgba(73, 73, 73, 0.40)",
    fontSize: 70,
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