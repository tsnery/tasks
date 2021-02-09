import { Alert, Platform } from "react-native";

const server =
  Platform.OS === "ios" ? "http://192.168.100.7:3000" : "http://10.0.2.2:3000";

const showError = (err) => {
  if (err.response && err.response.data) {
    Alert.alert("Ops! Ocorreu um problema!", `${err.response.data}`);
  }
};

const showSuccess = (msg) => {
  Alert.alert("Sucesso!", msg);
};

export { server, showError, showSuccess };
