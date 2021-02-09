import React, { Component } from "react";

import { Alert, View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

export default class Loading extends Component {
  // recupera o token de autenticação salvo no asyncStorage
  componentDidMount = async () => {
    const userDataJson = await AsyncStorage.getItem("userData");
    let userData = null;
    try {
      userData = JSON.parse(userDataJson);
    } catch (e) {
      // UserData inválido
    }

    // verifica se os dados de autenticação ainda existem, se sim, entra no app
    // caso contrário, volta para a tela de login
    if (userData && userData.token) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `bearer ${userData.token}`;
      this.props.navigation.navigate("Home", userData);
    } else {
      this.props.navigation.navigate("Auth");
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#cecece" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
