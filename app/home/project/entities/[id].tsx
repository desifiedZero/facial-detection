import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { toastConfig } from "../../../../common/util";
import EntityCard from "../../../../components/entityCard";
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
        fetch(`http://192.168.18.55:8000/api/project/${params.id}/entries/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            const json = await response.json();
            if (response.status === 200) {
                console.log(json)
                setActivity(json.map((activity: any) => {
                    return (<EntityCard key={activity.id} entry={activity} />)
                }));
            }
        }).catch((error) => {
            console.log(error.message);
            Toast.show("Server Error: Please try again later!", toastConfig);
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
                        {project?.name} / Entities
                    </Text>
                </View>
            </View>          

            <View style={{
                marginTop: 40,
                display: "flex",
                flexDirection: "column",
                rowGap: 10,
            }}>
                <Text style={{fontSize: 30, fontWeight: "600"}}>Registered Entities</Text>
                <ScrollView>
                    <View style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 10,
                    }}>
                        {activity}
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