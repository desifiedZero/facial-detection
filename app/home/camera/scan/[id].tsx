import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Pressable, Alert, ImageBackground, ActivityIndicator } from 'react-native'
import { Camera, CameraCapturedPicture, CameraType, FlashMode, PermissionStatus } from 'expo-camera'
import { BaseButton, TextInput } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-root-toast';
import { toastConfig } from '../../../../common/util';

let camera: Camera;

export default function CameraPage() {
  const [project, setProject] = React.useState<any | null>(null);
  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false)
  const [capturedImage, setCapturedImage] = React.useState<CameraCapturedPicture | null>(null)
  const [cameraType, setCameraType] = React.useState<CameraType>(CameraType.back)
  const [flashMode, setFlashMode] = React.useState<FlashMode>(FlashMode.off)
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [fields, setFields] = React.useState<Map<string, string>>(new Map<string, string>());
  const [sending, setSending] = React.useState<boolean>(false);

  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      if (!token)
          router.replace('/login');

      fetch(`http://192.168.18.55:8000/api/project/${params.id}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`
          }
      }).then(async (response) => {
          const json = await response.json();
          if (response.status === 200) {
            console.log(json)
            setProject(json)
          }
      }).catch((error) => {
          console.log(error.message);
          Alert.alert("Server Error: Please try again later!");
      });
    });
  }, []);

  const takePicture = async () => {  
    console.log("Taking picture");
    
    const photo: CameraCapturedPicture = await camera.takePictureAsync()
    setPreviewVisible(true)
    setCapturedImage(photo)
  }

  const modal = () => {
    if (showModal && previewVisible && capturedImage) {
      return (
        <View style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: 20,
          backgroundColor: "#fff",
        }}>
          <View style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            flexGrow: 1,
          }}>
            {
            project.storageSchema.map((field: {name: string, type: string}) => {
              console.log("field", field);
              return <View style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: 10,
                marginBottom: 10,
                justifyContent: "space-between",
              }}>
                <TextInput
                style={{
                  width: "100%",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                }}
                  placeholder={field.name}
                  value={fields[field.name]}
                  onChangeText={(text) => {
                    setFields(fields.set(field.name, text));
                    console.log(fields);
                  }}
                />
              </View>
            })
            }
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <BaseButton onPress={() => {
              setShowModal(false);
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                padding: 10,
              }}>Cancel</Text>
            </BaseButton>
            <BaseButton onPress={() => {
              scanImage();
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                padding: 10,
              }}>{sending ? <ActivityIndicator /> : 'Scan'}</Text>
            </BaseButton>
          </View>
        </View>
      )
    }
  }

  const scanImage = () => {
    setSending(true);
    
    let uri = capturedImage.uri;
    let name = uri.split('/').pop();

    let match = /\.(\w+)$/.exec(name);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append('test', { uri, name, type });
    formData.append('project_id', params.id);
    
    SecureStore.getItemAsync('token').then((token) => {
      if (!token)
        router.replace('/login');

      fetch(`http://192.168.18.55:8000/api/face/scan/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        },
        body: formData
      }).then(async (response) => {
        const json = await response.json();
        if (response.status !== 200) {
          Alert.alert("Server Error: Please try again later!");
        }
      }).catch((error) => {
        Alert.alert("Server Error: Please try again later!");
      }).finally(() => {
        setSending(false);
        setPreviewVisible(false);
        setCapturedImage(null);
        setShowModal(false);

        Toast.show("Entity Scanned!", toastConfig);

        router.back();
      });
    });
  }

  const retakeImage = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
  }

  const toggleFlash = () => {
    if (flashMode === FlashMode.on) {
      setFlashMode(FlashMode.off)
    } else if (flashMode === FlashMode.off) {
      setFlashMode(FlashMode.on)
    } else {
      setFlashMode(FlashMode.auto)
    }
  }

  const flipCamera = () => {
    if (cameraType === CameraType.back) {
      setCameraType(CameraType.front)
    } else {
      setCameraType(CameraType.back)
    }
  }

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync()
      if (status !== PermissionStatus.GRANTED) {
        Alert.alert('Sorry, we need camera permissions to make this work!')
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
        <View style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          columnGap: 20,
          padding: 20,
        }}>
          <View>
            <BaseButton style={{
              borderRadius: 500,
              padding: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={router.back}>
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
              Scan Entity
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: '100%'
          }}
        >
          {previewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} savePhoto={scanImage} retakePicture={retakeImage} setShowModal={setShowModal} />
          ) : (
            <Camera
              type={cameraType}
              flashMode={flashMode}
              style={{flex: 1}}
              ref={(r) => {
                camera = r
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: '5%',
                    top: '10%',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <BaseButton
                    onPress={toggleFlash}
                    style={{
                      backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                      borderRadius: 50
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        padding: 5,
                      }}
                    >
                      ⚡️
                    </Text>
                  </BaseButton>
                  <BaseButton
                    onPress={flipCamera}
                    style={{
                      marginTop: 20,
                      borderRadius: 50
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        padding: 5,
                      }}
                    >
                      📷
                    </Text>
                  </BaseButton>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between'
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <BaseButton
                      onPress={takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: '#fff'
                      }}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>

      <StatusBar translucent={false} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const CameraPreview = ({photo, retakePicture, savePhoto, setShowModal}) => {
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{uri: photo && photo.uri}}
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <BaseButton
              onPress={retakePicture}
              style={{
                alignItems: 'center',
                borderRadius: 4,
                padding: 13,
                justifyContent: 'center',
                backgroundColor: '#FFF'
              }}
            >
              <Text
                style={{
                  color: '#000',
                  fontSize: 20
                }}
              >
                Re-take
              </Text>
            </BaseButton>
            <BaseButton
              onPress={() => savePhoto()}
              style={{
                alignItems: 'center',
                borderRadius: 4,
                padding: 13,
                justifyContent: 'center',
                backgroundColor: '#FFF'
              }}
            >
              <Text
                style={{
                  color: '#000',
                  fontSize: 20
                }}
              >
                Scan
              </Text>
            </BaseButton>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}
