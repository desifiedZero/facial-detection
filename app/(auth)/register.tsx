import React from "react";
import { StyleSheet, Text, View, Pressable, Alert, ImageBackground, StatusBar, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import InputField from "../../components/inputField";
import { BaseButton } from "react-native-gesture-handler";
import { Link, useRouter } from "expo-router";
import Toast from "react-native-root-toast";
import { toastConfig } from "../../common/util";

export default function CameraPage() {
  const [username, setUsername] = React.useState<string>('');
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const router = useRouter();

  const registerUser = async () => {
    console.log('register user');

    fetch('http://192.168.18.55:8000/api/register/', {
      body: JSON.stringify({
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (response) => {
      const json = await response.json();
      if (response.status === 200) {
          console.log(json)
          Toast.show("Registration successful!", toastConfig);
          router.replace('/login');
      } else {
        console.log(json)
        let errors = [];
        json.Object.keys.forEach((error: any) => {
          errors.push(error);
        });
        Toast.show(`Invalid ${errors.join(", ")}`, toastConfig);
      }
    }).catch((error) => {
      console.log(error.message);
      Toast.show("Server Error: Please try again later!", toastConfig);
    });
  }

  return (
    <View style={styles.content}>
      <View style={{
        flexGrow: 1,
        justifyContent: "center",
      }}>
        <Text style={styles.title}>REGISTER</Text>
        <View style={styles.inputs}>
          <InputField value={username} setValue={setUsername} placeHolder="username" iconName="user" iconSize={20} autoComplete="username" />
          <InputField value={firstName} setValue={setFirstName} placeHolder="first name" iconName="user" iconSize={20} autoComplete="name-given" />
          <InputField value={lastName} setValue={setLastName} placeHolder="last name" iconName="user" iconSize={20} autoComplete="name-family" />
          <InputField value={email} setValue={setEmail} placeHolder="email" iconName="envelope" iconSize={20} autoComplete="email" />
          <InputField value={password} setValue={setPassword} placeHolder="password" iconName="lock" iconSize={20} autoComplete="password" isPassword />
          <BaseButton style={{
            backgroundColor: "#0097C7",
            borderRadius: 20,
            padding: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={registerUser}>
            <Text style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "800"
            }}>REGISTER</Text>
          </BaseButton>
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
          }}>Already have an account?</Text>
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