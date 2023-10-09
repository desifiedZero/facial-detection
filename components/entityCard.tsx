import React from "react";
import { View, Text, Image } from "react-native";
import { BaseButton } from "react-native-gesture-handler";

interface ProjectLinkProps {
    entry: any;
}

export default function EntityCard({ entry }: ProjectLinkProps) {
    const imageUrl = `http://192.168.18.55:8000${entry.image}`;
    console.log(imageUrl);
    return (
        <BaseButton
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
            </View>
        </BaseButton>);
}