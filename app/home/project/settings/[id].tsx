import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { toastConfig } from "../../../../common/util";
import * as SecureStore from 'expo-secure-store';
import env from '../../../../common/env';

export default function Settings() {
    const [project, setProject] = React.useState<any | null>(null);
    const [users, setUsers] = React.useState<any | null>(null);
    const [detectChange, setDetectChange] = React.useState<boolean>(false);
    const [disableButton, setDisableButton] = React.useState<boolean>(false);

    const params = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        SecureStore.getItemAsync('token').then((token) => {
            if (!token)
                router.replace('/login');

            fetch(`${env.API_URL}project/${params.id}/`, {
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
        console.log("fetching users")
        SecureStore.getItemAsync('token').then((token) => {
            if (!token)
                router.replace('/login');

                console.log(`${env.API_URL}project/${params.id}/manage/users/`)
            fetch(`${env.API_URL}project/${params.id}/manage/users/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            }).then(async (response) => {
                const json = await response.json();
                if (response.status === 200) {
                    console.log(json)
                    setUsers(json);
                }
            }).catch((error) => {
                console.log(error.message);
                Toast.show("Server Error: Please try again later!", toastConfig);
            });
        })
            
    }, [project, detectChange]);

    const deleteProject = () => {
        SecureStore.getItemAsync('token').then((token) => {
            if (!token)
                router.replace('/login');

            fetch(`${env.API_URL}project/${params.id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            }).then(async (response) => {
                if (response.status === 200) {
                    router.replace('/home');

                    Toast.show("Project Deleted Successfully!", toastConfig);
                }
            }).catch((error) => {
                console.log(error.message);
                Toast.show("Server Error: Please try again later!", toastConfig);
            });
        }
    )}

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
                        {project?.name} / Settings
                    </Text>
                </View>
            </View>          

            <View style={{
                marginTop: 40,
                display: "flex",
                flex: 1,
                flexDirection: "column",
                rowGap: 10,
            }}>
                <ScrollView>
                    <View style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 10,
                    }}>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingHorizontal: 15,
                            paddingVertical: 20,
                            borderColor: "#DDD",
                            borderWidth: 1,
                            borderRadius: 10,
                        }}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: "600",
                            }}>Project Name</Text>
                            <Text style={{
                                fontSize: 18,
                            }}>{project?.name}</Text>
                        </View>

                        <View style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            paddingHorizontal: 15,
                            paddingVertical: 20,
                            borderColor: "#DDD",
                            borderWidth: 1,
                            borderRadius: 10,
                            rowGap: 5,
                        }}>
                            <Text style={{fontSize: 20, fontWeight: "600"}}>Project Description</Text>
                            <Text style={{fontSize: 18}}>{project?.description}</Text>
                        </View>

                        <View style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            paddingHorizontal: 15,
                            paddingVertical: 20,
                            borderColor: "#DDD",
                            borderWidth: 1,
                            borderRadius: 10,
                        }}>
                            <Text style={{fontSize: 20, fontWeight: "600"}}>Project Storage Schema</Text>
                            
                            <Text style={{fontSize: 14, marginTop: 10, color: "#555"}}>
                                Structure of data required when registering people.
                            </Text>
                            
                            <View style={{
                                display: "flex",
                                flexDirection: "column",
                                columnGap: 10,
                                marginTop: 10,
                                rowGap: 10,
                            }}>
                                {project?.storageSchema?.map((property: any) => {
                                    return <>
                                        <View key={property.name} style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            columnGap: 5,
                                            justifyContent: "space-between",
                                            paddingHorizontal: 15,
                                            paddingVertical: 15,
                                            backgroundColor: "#F6f6f6",
                                            borderRadius: 10,
                                        }}>
                                            <Text style={{fontSize: 18}}>{property.name}</Text>
                                            <Text style={{fontSize: 18}}>{property.type}</Text>
                                        </View>
                                    </>
                                })
                                }
                            </View>
                        </View>

                        {
                            users && <View style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                paddingHorizontal: 15,
                                paddingVertical: 20,
                                borderColor: "#DDD",
                                borderWidth: 1,
                                borderRadius: 10,
                            }}>
                                <Text style={{fontSize: 20, fontWeight: "600"}}>Members</Text>
                                
                                <Text style={{fontSize: 14, marginTop: 10, color: "#555"}}>
                                    Members in this project
                                </Text>
                                
                                <View style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    columnGap: 10,
                                    marginTop: 10,
                                    rowGap: 10,
                                }}>
                                    {users.map((user: any) => {
                                        return <>
                                            <View key={user.username} style={{
                                                display: "flex",
                                                columnGap: 5,
                                                justifyContent: "space-between",
                                                paddingHorizontal: 15,
                                                paddingVertical: 15,
                                                backgroundColor: "#F6f6f6",
                                                borderRadius: 10,
                                            }}>
                                                <View>
                                                    <Text style={{fontSize: 18, fontWeight: '600'}}>{user.username}</Text>
                                                    <Text style={{fontSize: 18}}>{user.first_name} {user.last_name}</Text>
                                                    <Text style={{fontSize: 18}}>{user.email}</Text>
                                                </View>
                                                {users.length > 1 && <View key={user.username + "!"} style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    columnGap: 5,
                                                    marginTop: 10,
                                                    // space-between
                                                    justifyContent: "flex-end",
                                                }}>
                                                    <BaseButton style={{
                                                        borderRadius: 500,
                                                        padding: 13,
                                                        backgroundColor: "#0097C7",
                                                    }}
                                                    onPress={() => {
                                                        if (disableButton) return;

                                                        setDisableButton(true);
                                                        SecureStore.getItemAsync('token').then((token) => {
                                                            if (!token)
                                                                router.replace('/login');
                                                            
                                                            fetch(`${env.API_URL}project/${params.id}/adminpermission/${user.id}/`, {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    'Authorization': `Token ${token}`
                                                                },
                                                            }).then(async (response) => {
                                                                if (response.status === 200) {
                                                                    Toast.show("User Made Admin Successfully!", toastConfig);
                                                                }
                                                            }).catch((error) => {
                                                                console.log(error.message);
                                                                Toast.show("Server Error: Please try again later!", toastConfig);
                                                            }).finally(() => {
                                                                setDetectChange(!detectChange);
                                                                setDisableButton(false);
                                                            });
                                                        });
                                                    }}>
                                                        <Text style={{color: '#fff'}}>Make Admin</Text>
                                                    </BaseButton>
                                                    <BaseButton style={{
                                                        borderRadius: 500,
                                                        padding: 13,
                                                        backgroundColor: "#B22222",
                                                    }} onPress={() => {
                                                        if (disableButton) return;

                                                        setDisableButton(true);
                                                        SecureStore.getItemAsync('token').then((token) => {
                                                            if (!token)
                                                                router.replace('/login');
                                                            
                                                            fetch(`${env.API_URL}project/${params.id}/manage/users/${user.id}/`, {
                                                                method: 'DELETE',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    'Authorization': `Token ${token}`
                                                                }
                                                            }).then(async (response) => {
                                                                if (response.status === 200) {
                                                                    Toast.show("User Removed Successfully!", toastConfig);
                                                                }
                                                            }).catch((error) => {
                                                                console.log(error.message);
                                                                Toast.show("Server Error: Please try again later!", toastConfig);
                                                            }).finally(() => {
                                                                setDetectChange(!detectChange);
                                                                setDisableButton(false);
                                                            });
                                                        });
                                                    }}>
                                                        <Text style={{color: '#fff'}}>Delete</Text>
                                                    </BaseButton>
                                                </View>}
                                            </View>
                                        </>
                                    })
                                    }
                                </View>
                            </View>
                        }
                    </View>
                </ScrollView>
            </View>
            {
                project?.is_admin && (
                    <View style={{
                        marginTop: 40,
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 10,
                    }}>
                        <BaseButton style={{
                            borderRadius: 500,
                            padding: 13,
                            // dark red
                            backgroundColor: "#B22222", 
                        }}
                        onPress={deleteProject}>
                            <Text style={{ fontSize: 20, color: 'white', textAlign: 'center'}}>Delete Project</Text>
                        </BaseButton>
                    </View>
                )
            }
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight,
    },
});