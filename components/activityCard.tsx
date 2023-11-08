import React from "react";
import { View, Text } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { jsonToMap } from "../common/util";

interface ProjectLinkProps {
    activity: any;
}

export default function ProjectLink({ activity }: ProjectLinkProps) {
    // use darker rgb colors
    const statusLight = (item) => {
        if (item.activity_type === "scanned-entity" && item.activity_data.success === true)
            return <FontAwesome name="circle" size={18} color="#00BD00" />;
        else if (item.activity_type === "scanned-entity" && item.activity_data.success === false)
            return <FontAwesome name="circle" size={18} color="#BD0000" />;
        return null;
    }

    return (
        <BaseButton
            key={activity.project_activity_id}
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
                }}>{activity.activity_data.name}  {statusLight(activity)}</Text>

                { activity.activity_data.info && 
                    Array.from(activity.activity_data.info.entry_details).map((item) => {
                        return <Text style={{
                            color: "#494949",
                            fontSize: 18,
                            fontWeight: "400"
                        }}>{item.kv_key}: {String(item.kv_value)}</Text>
                    })
                }
                { activity.activity_type === "scanned-entity" && activity.activity_data.success === false && 
                    <Text style={{
                        color: "#494949",
                        fontSize: 18,
                        fontWeight: "400"
                    }}>Not Found</Text>
                }
            </View>
        </BaseButton>);
}