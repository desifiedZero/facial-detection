import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";
import ProjectLink from "../../components/projectLink";
import Toast from "react-native-root-toast";
import { toastConfig } from "../../common/util";

export default function HomePage() {
    const router = useRouter();
    const [projects, setProjects] = React.useState<JSX.Element[]>([]);

    useEffect(() => {
        SecureStore.getItemAsync('token').then((token) => {
            if (!token)
                router.replace('/login');

            fetch('http://192.168.18.55:8000/api/projects/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            }).then(async (response) => {
                const json = await response.json();
                if (response.status === 200) {
                    console.log(json)
                    setProjects(json.map((project: any) => {
                        return (
                            <ProjectLink 
                                key={project.id} 
                                id={project.id} 
                                title={project.name} 
                                details={project.description} 
                                peopleRegistered={project.registered} />
                        )
                    }));
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
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 40,
            }}>
                <View>
                    <Text style={{
                        fontSize: 40,
                    }}>
                        Welcome Back!
                    </Text>
                </View>
                <View>
                    <BaseButton style={{
                        borderRadius: 500,
                        padding: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => {
                        SecureStore.deleteItemAsync('token');
                        router.replace('/login');
                    }}>
                        <FontAwesome name="sign-out" size={25} color="#BD0000" />
                    </BaseButton>
                </View>
            </View>

            <View style={{
                display: "flex",
                flexDirection: "column",
                rowGap: 10,
            }}>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <Text style={{fontSize: 30, fontWeight: "600"}}>Projects</Text>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        columnGap: 8,
                    }}>
                        <BaseButton style={{
                            borderRadius: 10,
                            padding: 13,
                            backgroundColor: "#0097C7",
                        }}
                        onPress={() => {
                            router.push('/home/invites');
                        }}>
                            <Text style={{
                                color: "#fff",
                                fontSize: 18,
                                fontWeight: "800"
                            }}>
                                <FontAwesome name="user-plus" size={18} color="#fff" />
                            </Text>
                        </BaseButton>
                        <BaseButton style={{
                            borderRadius: 10,
                            padding: 13,
                            backgroundColor: "#0097C7",
                        }}
                        onPress={() => {
                            router.push('/home/createProject');
                        }}>
                            <Text style={{
                                color: "#fff",
                                fontSize: 18,
                                fontWeight: "800"
                            }}>
                                <FontAwesome name="plus" size={18} color="#fff" />
                            </Text>
                        </BaseButton>
                    </View>
                </View>

                <ScrollView>
                    <View style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 10,
                    }}>
                        {projects}
                    </View>
                </ScrollView>
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