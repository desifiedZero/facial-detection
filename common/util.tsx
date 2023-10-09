import Toast from "react-native-root-toast";

const toastConfig = {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    opacity: 0.7,
};

const jsonToMap = (json) => new Map(Object.entries(json));


export { toastConfig, jsonToMap };