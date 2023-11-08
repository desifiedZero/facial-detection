import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Pressable, Alert, ImageBackground, ActivityIndicator } from 'react-native'
import { Camera, CameraCapturedPicture, CameraType, FlashMode, PermissionStatus } from 'expo-camera'
import { BaseButton, TextInput } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as FaceDetector from 'expo-face-detector';
import Toast from 'react-native-root-toast';
import { toastConfig } from '../../../../common/util';
import { ImageResult, SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import env from '../../../../common/env';

let camera: Camera;

export default function CameraPage() {
  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false)
  const [capturedImage, setCapturedImage] = React.useState<ImageResult | null>(null)
  const [cameraType, setCameraType] = React.useState<CameraType>(CameraType.back)
  const [flashMode, setFlashMode] = React.useState<FlashMode>(FlashMode.off)
  const [sending, setSending] = React.useState<boolean>(false);
  const [processingImage, setProcessingImage] = React.useState<boolean>(false);

  const router = useRouter();
  const params = useLocalSearchParams();

  const takePicture = async () => {  
    console.log("Taking picture");
    setProcessingImage(true);
    
    const photo: CameraCapturedPicture = await camera.takePictureAsync();

    const faces = await FaceDetector.detectFacesAsync(photo.uri);
    
    try {
      if (faces.faces.length > 0) {
        // crop image with face
        manipulateAsync(photo.uri, 
          [
            { 
              crop: 
              { 
                originX: faces.faces[0].bounds.origin.x, 
                originY: faces.faces[0].bounds.origin.y, 
                width: faces.faces[0].bounds.size.width, 
                height: faces.faces[0].bounds.size.height 
              } 
            }
          ], 
          { compress: 0.8, format: SaveFormat.JPEG })
        .then((result) => {
          console.log("Face detected");
          setPreviewVisible(true)
          setCapturedImage(result);
          setProcessingImage(false);
        });
      } else {
        console.log("No face detected");
        Alert.alert("No face detected!");
        setProcessingImage(false);
      }
    } catch (error) {
      console.log(error.message);
      Alert.alert(error.message);
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

      fetch(`${env.API_URL}face/scan/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        },
        body: formData
      }).then((response) => {
        if (response.status !== 200) {
          console.log("ERROR", response.status, response.body)
          Alert.alert("Person not found!");
          return;
        }

        response.json().then((json) => {
          let content: string = '';

          if (json.entry_details?.length > 0) {
            json.entry_details.forEach((entry: any) => {
              content += `${entry.kv_key}: ${entry.kv_value}\n`;
            });
          }
          Alert.alert("Person found!", content);
        });
      }).catch((error) => {
        console.log("ERROR", error);
        Alert.alert("Person not found!");
      }).finally(() => {
        setSending(false);
        setPreviewVisible(false);
        setCapturedImage(null);

        Toast.show("Entity Scanned!", toastConfig);

        router.back();
      });
    });
  }

  const retakeImage = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    setSending(false);
    setProcessingImage(false);
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
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1,
          backgroundColor: "rgba(255,255,255, 0.7)",
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
              <FontAwesome name="angle-left" size={30} color="#000" />
            </BaseButton>
          </View>
          <View style={{
              flexGrow: 1,
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#000",
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
            <CameraPreview photo={capturedImage} savePhoto={scanImage} retakePicture={retakeImage} sending={sending} />
          ) : (
            <Camera
              type={cameraType}
              flashMode={flashMode}
              style={{flex: 1}}
              ref={(r) => {
                camera = r
              }}
              ratio={'16:9'}
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
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}
                  >
                    <View style={{
                      width: '15%',
                      display: 'flex',
                      flexDirection: 'column',
                      rowGap: 5,
                    }}>
                      <BaseButton
                        onPress={toggleFlash}
                        style={{
                          backgroundColor: flashMode === 'off' ? 'rgba(0, 0, 0, 0.2)' : '#fff',
                          borderRadius: 150,
                        }}
                      >
                        <Text
                          style={{
                            padding: 15,
                            textAlign: 'center'
                          }}
                        >
                          <FontAwesome name="flash" size={25} color={flashMode === 'off' ? '#fff' : '#494949'} />
                        </Text>
                      </BaseButton>
                      <BaseButton
                        onPress={flipCamera}
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: 50,
                        }}
                      >
                        <Text style={{
                          padding: 15,
                          textAlign: 'center'
                        }}>
                          <FontAwesome name="camera" size={25} color="#fff" />
                        </Text>
                      </BaseButton>
                    </View>

                    <BaseButton
                      onPress={processingImage ? () => {} : takePicture}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: '#fff'
                      }}
                    >
                      { processingImage ? <ActivityIndicator /> : null }
                    </BaseButton>
                    
                    <View style={{
                      width: '15%'
                    }} />
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

const CameraPreview = ({photo, retakePicture, savePhoto, sending}) => {
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <View
        style={{
          flex: 1,
          display: 'flex',
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            flexGrow: 1,
            paddingHorizontal: '20%',
          }}
        >
          <ImageBackground
            resizeMode='contain'
            source={{uri: photo.uri}}
            style={{
              flex: 1,
            }}
          />
        </View>
        <View
          style={{
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
                borderRadius: 500,
                paddingVertical: 13,
                paddingHorizontal: 20,
                justifyContent: 'center',
                backgroundColor: '#111'
              }}
            >
              <Text
                style={{
                  color: '#FFF',
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
                borderRadius: 500,
                paddingVertical: 13,
                paddingHorizontal: 20,
                justifyContent: 'center',
                backgroundColor: '#0097C7'
              }}
            >
              <Text
                style={{
                  color: '#FFF',
                  fontSize: 20
                }}
              >
                { sending ? <ActivityIndicator size="small" color="#000" /> : "Scan" }
              </Text>
            </BaseButton>
          </View>
        </View>
      </View>
    </View>
  )
}
