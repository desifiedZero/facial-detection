import React from "react";
import { View, Text, Image } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import env from "../common/env";
import * as SecureStore from 'expo-secure-store';
import Toast from "react-native-root-toast";
import { toastConfig } from "../common/util";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface ProjectLinkProps {
    entry: any;
    onDelete?: () => void;
}

export default function EntityCard({ entry, onDelete }: ProjectLinkProps) {
    const imageUrl = `${env.BASE_URL}${entry.image}`;
    const router = useRouter();

    return (
        <View
            key={entry.project_activity_id}
            style={{
                display: "flex",
                flexDirection: "row",
                paddingVertical: 12,
                paddingHorizontal: 15,
                borderRadius: 10,
                alignItems: "center",
                columnGap: 10,
                backgroundColor: "#eee",
            }}>
            <View style={{
                flexGrow: 1,
                flexShrink: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 10,
            }}>
                <Image
                    style={{ width: 80, height: 80, borderRadius: 8}}
                    source={{
                        uri: imageUrl,
                    }} 
                />
                
                <View style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                }}>
                    { entry.entry_details?.map((value) => {
                        return <Text style={{
                            color: "#494949",
                            fontSize: 18,
                            fontWeight: "400"
                        }}>{value.kv_key}: {String(value.kv_value)}</Text>
                    })
                }
                </View>

                <BaseButton style={{
                    borderRadius: 500,
                    padding: 13,
                    // dark red
                }}
                onPress={() => {
                    SecureStore.getItemAsync('token').then((token) => {
                        if (!token)
                            router.replace('/login');

                        fetch(`${env.API_URL}project/${entry.project}/face/register/${entry.entry_id}/`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Token ${token}`
                            }
                        }).then(async (response) => {
                            if (response.status === 200) {
                                onDelete && onDelete();
                                Toast.show("Deleted", toastConfig);
                            }
                            console.log(response);
                        }).catch((error) => {
                            Toast.show("Server Error: Please try again later!", toastConfig);
                        });
                    });    
                }}>
                    <FontAwesome name="trash" size={20} color="#B22222" />
                </BaseButton>
            </View>
        </View>);
}