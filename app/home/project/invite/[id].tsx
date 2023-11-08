import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { BaseButton, TextInput } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { toastConfig } from "../../../../common/util";
import * as SecureStore from 'expo-secure-store';
import env from '../../../../common/env';

export default function SendInvite() {
    const [project, setProject] = React.useState<any | null>(null);
    const [email, setEmail] = React.useState<string>("");

    const params = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        SecureStore.getItemAsync('token').then((token) => {
            if (!token)
                router.replace('/login');
            
            fetch(`${env.API_URL}project/${params.id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            }).then(async (response) => {
                const json = await response.json();
                if (response.status === 200) {
                    console.log(json)
                    setProject(json);
                }
            }).catch((error) => {
                console.log(error.message);
                Toast.show("Server Error: Please try again later!", toastConfig);
            });
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: 20,
            }}>
                <View>
                    <BaseButton style={{
                        borderRadius: 500,
                        padding: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={router.back}>
                        <FontAwesome name="angle-left" size={30} color="#494949" />
                    </BaseButton>
                </View>
                <View style={{
                    flexGrow: 1,
                }}>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: "bold",
                    }}>
                        {project?.name} / Invite
                    </Text>
                </View>
            </View>          

            <View style={{
                display: "flex",
                flexDirection: "column",
                rowGap: 10,
            }}>
                <Text style={{fontSize: 20, fontWeight: "600"}}>Invite by Email</Text>
                <Text style={{fontSize: 14, fontWeight: "600"}}>Enter the email address of the user you want to invite to this project.</Text>
                <TextInput style={{
                    padding: 10,
                    backgroundColor: "#e8e8e8",
                    borderRadius: 10,
                }} placeholder="Email Address" value={email} onChangeText={setEmail}/>

                <BaseButton style={{
                    padding: 10,
                    backgroundColor: "#e8e8e8",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onPress={() => {
                    SecureStore.getItemAsync('token').then((token) => {
                        if (!token)
                            router.replace('/login');
                        
                        fetch(`${env.API_URL}project/${params.id}/invite/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Token ${token}`
                            },
                            body: JSON.stringify({
                                email: email,
                            })
                        }).then(async (response) => {
                            const json = await response.json();
                            if (response.status === 200) {
                                console.log(json)
                                Toast.show("Invite sent!", toastConfig);
                                setEmail("");
                                router.back();
                            }
                        }).catch((error) => {
                            console.log(error.message);
                            Toast.show("Server Error: Please try again later!", toastConfig);
                        });
                    })
                }}>
                    <Text style={{fontSize: 16, fontWeight: "600"}}>Send Invite</Text>
                </BaseButton>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight,
    },
});