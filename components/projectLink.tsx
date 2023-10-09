import React from "react";
import { View, Text } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface ProjectLinkProps {
    id: number;
    title: string;
    peopleRegistered: number;
    details: string;
}

export default function ProjectLink({ id, title, peopleRegistered, details }: ProjectLinkProps) {

    const router = useRouter();

    return <BaseButton key={id} style={{
        display: "flex",
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: "center",
        columnGap: 10,
    }} onPress={() => router.push(`/home/project/${id}`)}>
        <View style={{
            flexGrow: 1,
            flexShrink: 1,
        }}>
            <Text style={{
                color: "#494949",
                fontSize: 20,
                fontWeight: "800"
            }}>{title}</Text>

            <Text style={{
                color: "#494949",
                fontSize: 18,
                fontWeight: "400"
            }}>{peopleRegistered} people registered</Text>

            <Text style={{
                color: "#494949",
                fontSize: 18,
                fontWeight: "300",
            }} 
            numberOfLines={2} 
            ellipsizeMode='tail'>{details}</Text>
        </View>
        <View style={{
            flexGrow: 0,
        }}>
            <FontAwesome name="angle-right" size={30} color="#0097C7" />
        </View>
    </BaseButton>;
}