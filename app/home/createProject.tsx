import React from "react";
import { View, StyleSheet, StatusBar, Text, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { TextInput, BaseButton, ScrollView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-root-toast";
import { toastConfig } from "../../common/util";
import * as SecureStore from 'expo-secure-store';
import env from "../../common/env";

export default function CreateProject() {
    const router = useRouter();

    const [name, setName] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>();
    const [fields, setFields] = React.useState<Map<string, string>>(new Map<string, string>());
    const [fieldPopup, setFieldPopup] = React.useState<boolean>(false);

    const [fieldName, setFieldName] = React.useState<string>('');
    const [fieldType, setFieldType] = React.useState<string>('text');

    return (
        <><View style={styles.container}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: 20,
                marginBottom: 20
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
                        Create Project
                    </Text>
                </View>
            </View>

            <ScrollView style={{
                flexGrow: 1
            }}>
                <View>
                    <Text style={{marginBottom: 4}}>Project Name</Text>
                    <TextInput placeholder="Name" style={{
                        padding: 10,
                        fontSize: 18,
                        borderRadius: 10,
                        borderColor: "#ddd",
                        borderWidth: 1
                    }}
                    onChangeText={(text) => setName(text)}
                    value={name}
                    />
                </View>
                <View style={{
                    marginTop: 20
                }}>
                    <Text style={{marginBottom: 4}}>Project Description</Text>
                    <TextInput placeholder="Description" style={{
                        padding: 10,
                        fontSize: 18,
                        borderRadius: 10,
                        borderColor: "#ddd",
                        borderWidth: 1
                    }} 
                    multiline
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    />
                </View>
                <View style={{
                    marginTop: 20,
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 10,
                }}>
                    <Text>Fields</Text>
                    <View style={{
                        marginTop: 10,
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 10,
                    }}>
                        {Array.from(fields).map(([fieldName, fieldType], idx) => {
                            return (
                                <View style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: 10,
                                    paddingHorizontal: 20,
                                    backgroundColor: "#eee",
                                    borderRadius: 100,

                                }} key={idx}>
                                    <Text style={{
                                        fontSize: 18,
                                        fontWeight: "bold"
                                    }}>{fieldName}</Text>
                                    <Text style={{
                                        fontSize: 18,
                                    }}>{fieldType}</Text>
                                    {/* Remove from map icon button */}
                                    <BaseButton style={{
                                        padding: 10,
                                        borderRadius: 500,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                    onPress={() => {
                                        fields.delete(fieldName);
                                        setFields(new Map(fields));
                                    }}
                                    >
                                        <FontAwesome name="trash" size={20} color="#BD0000" />
                                    </BaseButton>
                                </View>
                            )
                        })}
                    </View>
                    <BaseButton 
                    onPress={() => {
                        setFieldPopup(true);
                    }}
                    style={{
                        padding: 10,
                        borderRadius: 100,
                        borderColor: "#ddd",
                        borderWidth: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        backgroundColor: "#0097C7",
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#fff"
                        }}>Add Field</Text>
                    </BaseButton>
                </View>
            </ScrollView>
            
            <View style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20
            }}>
                <BaseButton style={{
                    padding: 10,
                    borderRadius: 10,
                    borderColor: "#ddd",
                    borderWidth: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onPress={() => {
                    router.back();
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: "bold"
                    }}>Cancel</Text>
                </BaseButton>
                <BaseButton style={{
                    padding: 10,
                    borderRadius: 10,
                    borderColor: "#ddd",
                    borderWidth: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onPress={async () => {
                    if (name.length === 0) Toast.show("Project name cannot be empty!", toastConfig);
                    else if (description.length === 0) Toast.show("Project description cannot be empty!", toastConfig);
                    else if (fields.size === 0) Toast.show("Project must have at least one field!", toastConfig);

                    let projectInfo = JSON.stringify({
                        name,
                        description,
                        storageSchema: Array.from(fields).map(([fieldName, fieldType]) => {
                            return {
                                name: fieldName,
                                type: fieldType
                            }
                        })
                    });

                    fetch(`${env.API_URL}project/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${await SecureStore.getItemAsync('token')}`
                        },
                        body: projectInfo
                    }).then(async (response) => {
                        const json = await response.json();
                        if (response.status === 201) {
                            console.log(json)
                            Toast.show("Project created successfully!", toastConfig);
                            router.back();
                        }
                        console.log(json);
                    }).catch((error) => {
                        console.log(error.message);
                        Toast.show("Server Error: Please try again later!", toastConfig);
                    });
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#0097C7"
                    }}>Save</Text>
                </BaseButton>
            </View>
        </View>
        { fieldPopup && <View style={{
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.2)',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height + StatusBar.currentHeight,
            top: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
            }}
            onTouchEnd={() => {
                setFieldPopup(false);
            }} />
            
            <View style={{
                width: '90%',
                borderRadius: 20,
                padding: 20, 
                backgroundColor: "#fff",
            }}
            >
                <Text style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 10
                }}>Add Field</Text>

                <Text style={{
                    marginTop: 10,
                    marginBottom: 4
                }}>Field Name</Text>
                <TextInput placeholder="Field Name" style={{
                    padding: 10,
                    fontSize: 18,
                    borderRadius: 10,
                    borderColor: "#ddd",
                    borderWidth: 1
                }} 
                value={fieldName}
                onChangeText={(text) => setFieldName(text)}
                />

                <Text style={{
                    marginTop: 10,
                    marginBottom: 4
                }}>Field Type</Text>
                <Picker
                    selectedValue={fieldType}
                    style={{
                        height: 50,
                        borderRadius: 10,
                        borderColor: "#ddd",
                        borderWidth: 1
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                        setFieldType(itemValue);
                    }}
                >
                    <Picker.Item label="Text" value="text" />
                    <Picker.Item label="Number" value="number" />
                    <Picker.Item label="Date" value="date" />
                </Picker>

                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20
                }}>
                    <BaseButton style={{
                        padding: 10,
                        borderRadius: 10,
                        borderColor: "#ddd",
                        borderWidth: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onPress={() => {
                        setFieldPopup(false);
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: "bold"
                        }}>Cancel</Text>
                    </BaseButton>
                    <BaseButton style={{
                        padding: 10,
                        borderRadius: 10,
                        borderColor: "#ddd",
                        borderWidth: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => {
                        if (fields.has(fieldName)) Toast.show("Field name already exists!", toastConfig);
                        else if (fieldName.length === 0) Toast.show("Field name cannot be empty!", toastConfig);
                        else if (fieldType.length === 0) Toast.show("Field type cannot be empty!", toastConfig);
                        else
                        {
                            setFields(new Map(fields.set(fieldName, fieldType)));
                            setFieldName('');
                            setFieldType('text');
                            setFieldPopup(false);
                        }
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#0097C7"
                        }}>Save</Text>
                    </BaseButton>
                </View>
            </View>
        </View>}
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        display: "flex",    
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
});