import React from "react";
import { View, Text } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { jsonToMap, toastConfig } from "../common/util";
import { Invite } from "../app/home/invites";
import Toast from "react-native-root-toast";

interface InviteCardProps {
    invite: Invite;
    key: any;
    onChange: () => void;
}

export default function InviteCard({ invite, key, onChange }: InviteCardProps) {
    return (
        <View
            key={key}
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
            }}>
                <Text style={{
                    color: "#494949",
                    fontSize: 20,
                    fontWeight: "800",
                }}>{invite.project.name}</Text>
                <Text style={{
                    color: "#494949",
                    fontSize: 16,
                    fontWeight: "600",
                }}>{invite.project.description}</Text>
            </View>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: 10,
            }}>
                <BaseButton style={{
                    borderRadius: 500,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    backgroundColor: "#0097C7",
                }}
                onPress={() => {
                    fetch('http://' + invite.accept_link, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }).then(async (response) => {
                        if (response.status === 200) {
                            Toast.show("Invite Accepted!", toastConfig);
                            onChange();
                        }
                    }).catch((error) => {
                        Toast.show("Server Error: Please try again later!", toastConfig);
                    });
                }}>
                    <Text style={{
                        color: "#fff",
                        fontSize: 18,
                        fontWeight: "800"
                    }}>
                        <FontAwesome name="check" size={20} color="#fff" />
                    </Text>
                </BaseButton>
                <BaseButton style={{
                    borderRadius: 500,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    backgroundColor: "#BD0000",
                }}
                onPress={() => {
                    fetch('http://' + invite.decline_link, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }).then(async (response) => {
                        if (response.status === 200) {
                            Toast.show("Invite Rejected!", toastConfig);
                            onChange();
                        }
                    }).catch((error) => {
                        Toast.show("Server Error: Please try again later!", toastConfig);
                    });
                }}>
                    <Text style={{
                        color: "#fff",
                        fontSize: 18,
                        fontWeight: "800"
                    }}>
                        <FontAwesome name="times" size={20} color="#fff" />
                    </Text>
                </BaseButton>
            </View>
        </View>);
}