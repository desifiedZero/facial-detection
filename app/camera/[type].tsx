import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Pressable, Alert, ImageBackground } from 'react-native'
import { Camera, CameraCapturedPicture, CameraType, FlashMode, PermissionStatus } from 'expo-camera'
import { BaseButton } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

let camera: Camera;

export default function CameraPage() {
  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false)
  const [capturedImage, setCapturedImage] = React.useState<CameraCapturedPicture | null>(null)
  const [cameraType, setCameraType] = React.useState<CameraType>(CameraType.back)
  const [flashMode, setFlashMode] = React.useState<FlashMode>(FlashMode.off)

  const router = useRouter();
  const params = useLocalSearchParams();

  const takePicture = async () => {
    console.log('take picture');
    
    const photo: CameraCapturedPicture = await camera.takePictureAsync()
    setPreviewVisible(true)
    setCapturedImage(photo)
  }

  const scanImage = () => {}

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
              {params.type === "scan" ? "Scan" : "Register"} Entity
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
            <CameraPreview photo={capturedImage} savePhoto={scanImage} retakePicture={retakeImage} />
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
                      {cameraType === 'front' ? '🤳' : '📷'}
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

const CameraPreview = ({photo, retakePicture, savePhoto}) => {
  console.log('sdsfds', photo)
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
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                Re-take
              </Text>
            </BaseButton>
            <BaseButton
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                Process Image
              </Text>
            </BaseButton>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}