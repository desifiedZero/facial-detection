import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { toastConfig } from "../../../common/util";
import * as SecureStore from 'expo-secure-store';
import env from '../../../common/env';
import InviteCard from "../../../components/InviteCard";

export interface Invite {
    token: string;
    project: Project;
    user: number;
    accept_link: string;
    decline_link: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    registered: number;
}

export default function HomePage() {
    const [invites, setInvites] = React.useState<Invite[]>([]);
    const [changeDetect, setChangeDetect] = React.useState<boolean>(false);

    const params = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        SecureStore.getItemAsync('token').then((token) => {
            if (!token)
                router.replace('/login');

            fetch(`${env.API_URL}invite/list/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            }).then(async (response) => {
                const json = await response.json();
                if (response.status === 200) {
                    console.log(json);
                    setInvites(json);
                }
            }).catch((error) => {
                console.log(error.message);
                Toast.show("Server Error: Please try again later!", toastConfig);
            });
        });
    }, [changeDetect]);

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
                        Invites
                    </Text>
                </View>
            </View>          

            <ScrollView style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                rowGap: 10,
            }}>
                <Text style={{
                    fontSize: 27,
                    fontWeight: "bold",
                    paddingVertical: 10,
                }}>
                    Projects
                </Text>
                <View style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 10,
                }}>
                    { invites.length === 0 && <Text style={{
                        fontSize: 20,
                        color: "#494949", 
                        }}>
                            No Invites!
                        </Text>
                    }
                    { invites.map((invite, i) => <InviteCard invite={invite} key={invite.token + i} onChange={() => setChangeDetect(!changeDetect)} />) }
                </View>
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
});