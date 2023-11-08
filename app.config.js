export default {
    "expo": {
      "name": "facial-detection",
      "slug": "facial-detection",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/icon.png",
      "userInterfaceStyle": "light",
      "splash": {
        "image": "./assets/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
      "scheme": "facerecognition",
      "assetBundlePatterns": [
        "**/*"
      ],
      "ios": {
        "supportsTablet": true,
        "config": {
          "usesNonExemptEncryption": false
        },
        "bundleIdentifier": "com.mvp.facialRecognition"
      },
      "android": {
        "package": "com.mvp.facialrecognition",
        "versionCode": 1,
        "versionCode": 1,
        "adaptiveIcon": {
          "foregroundImage": "./assets/adaptive-icon.png",
          "backgroundColor": "#ffffff"
        },
      },
      "plugins": [
        [
          "expo-router",
        ],
        [
          'expo-build-properties',
          {
            "android": {
              "usesCleartextTraffic": true
            }
          }
        ]
      ],
      "extra": {
        "eas": {
          "projectId": "02d6c392-3e26-4988-950f-15e355672237"
        }
      }
    },
  };