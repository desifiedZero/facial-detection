import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import ActivityCard from "../../../components/activityCard";
import { toastConfig } from "../../../common/util";
import Toast from "react-native-root-toast";
import * as SecureStore from 'expo-secure-store';

export default function HomePage() {
    const [project, setProject] = React.useState<any | null>(null);
    const [activity, setActivity] = React.useState<any | null>(null);

    const params = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        SecureStore.getItemAsync('token').then((token) => {
            if (!token)
                router.replace('/login');
        
            fetch(`http://192.168.18.55:8000/api/project/${params.id}/`, {
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

    useEffect(() => {
        SecureStore.getItemAsync('token').then((token) => {
            if (!token)
                router.replace('/login');

            fetch(`http://192.168.18.55:8000/api/project/${params.id}/activity/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            }).then(async (response) => {
                const json = await response.json();
                if (response.status === 200) {
                    if (!json || json.length === 0) {
                        return (<Text>No Activity Found</Text>);
                    }

                    setActivity(json.map((activity: any) => {
                        return (<ActivityCard key={activity.id} activity={activity} />)
                    }));
                }
            }).catch(() => {
                Toast.show("Server Error: Please try again later!", toastConfig);
            });
        });
    }, [project]);

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
                    onPress={() => {
                        router.back();
                    }}>
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
                        {project?.name}
                    </Text>
                </View>
            </View>

            <View style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                rowGap: 8,
            }}>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 8,
                }}>
                    <BaseButton style={{
                        borderRadius: 500,
                        padding: 13,
                        backgroundColor: "#0097C7",
                        flexGrow: 1,
                    }}
                    onPress={() => {
                        router.push(`/home/project/entities/${project?.id}`);
                    }}>
                        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center'}}>Registered Entities</Text>
                    </BaseButton>
                    <BaseButton style={{
                        borderRadius: 500,
                        padding: 13,
                        backgroundColor: "#0097C7",
                    }}
                    onPress={() => {
                        router.push(`/home/project/invite/${project?.id}`);
                    }}>
                        <FontAwesome name="user-plus" size={20} color="white" />
                    </BaseButton>
                    <BaseButton style={{
                        borderRadius: 500,
                        padding: 13,
                        paddingHorizontal: 15,
                        backgroundColor: "#0097C7",
                    }}
                    onPress={() => {
                        router.replace(`/home/project/settings/${project?.id}`)
                    }}>
                        <FontAwesome name="gear" size={20} color="white" />
                    </BaseButton>
                </View>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: 8,
                }}>
                    <BaseButton style={{
                        borderRadius: 500,
                        padding: 13,
                        backgroundColor: "#0097C7",
                        flexGrow: 1,
                    }}
                    onPress={() => {
                        router.push(`home/camera/register/${project?.id}`);
                    }}>
                        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center'}}>Enroll New Entity</Text>
                    </BaseButton>
                    <BaseButton style={{
                        borderRadius: 500,
                        padding: 13,
                        backgroundColor: "#0097C7",
                        flexGrow: 1,
                    }}
                    onPress={() => {
                        router.push(`home/camera/scan/${project?.id}`);
                    }}>
                        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center'}}>Scan Entity</Text>
                    </BaseButton>
                </View>
            </View>           

            <ScrollView style={{
                marginTop: 40,
                display: "flex",
                flexDirection: "column",
                rowGap: 10,
            }}>
                <Text style={{fontSize: 30, fontWeight: "600", marginBottom: 10}}>Activity</Text>
                <View>
                    <View style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 10,
                    }}>
                        {activity}
                    </View>
                </View>
            </ScrollView>

            {/* <View style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                padding: 20,
            }}>
                <BaseButton style={{
                    borderRadius: 500,
                    padding: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0097C7",
                }}
                onPress={() => {
                    router.push(`home/camera/scan/${project?.id}`);
                }}>
                    <FontAwesome name="camera" size={25} color="#fff" />
                </BaseButton>
            </View> */}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight,
    },
});