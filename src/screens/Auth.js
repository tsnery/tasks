import React, { Component } from "react";
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity } from "react-native";

import backgroundImage from "../../assets/imgs/login.jpg";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { server, showError, showSuccess } from "../common";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  stageNew: false,
};

export default class Auth extends Component {
  state = {
    ...initialState,
  };
  
  signinOrSignup = () => {
    if (this.state.stageNew) {
      this.signup();
    } else {
      this.signin();
    }
  };
  signup = async () => {
    try {
      await axios.post(`${server}/signup`, {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      });
      showSuccess("Usuário cadastrado!");
      this.setState({ ...initialState });
    } catch (e) {
      showError(e);
    }
  };

  signin = async () => {
    try {
      const response = await axios.post(`${server}/signin`, {
        email: this.state.email,
        password: this.state.password,
      });

      // adiciona o token no header de authorization
      // após adicionar o token, guarda para recuperar a partir de cada request
      await AsyncStorage.setItem("userData", JSON.stringify(response.data))
      axios.defaults.headers.common[
        "Authorization"
      ] = `bearer ${response.data.token}`;

      // segue para a tela de tarefas
      this.props.navigation.navigate("Home", response.data);
    } catch (e) {
      showError(e);
    }
  };

  render() {
    const validations = [];
    validations.push(this.state.email && this.state.email.includes("@"));
    validations.push(this.state.password && this.state.password.length >= 6);

    if (this.state.stageNew) {
      validations.push(this.state.name && this.state.name.trim().length >= 2);
      validations.push(this.state.password === this.state.confirmPassword);
    }

    const validForm = validations.reduce((total, atual) => total && atual);
    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>
            {this.state.stageNew ? "Crie sua conta" : "Informe seus dados"}
          </Text>
          {this.state.stageNew && (
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={this.state.name}
              onChangeText={(name) => this.setState({ name })}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha (mínimo 6 caracteres)"
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            secureTextEntry
          />
          {this.state.stageNew && (
            <TextInput
              style={styles.input}
              placeholder="Confirmação de senha"
              value={this.state.confirmPassword}
              onChangeText={(confirmPassword) =>
                this.setState({ confirmPassword })
              }
              secureTextEntry
            />
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={this.signinOrSignup}
            disabled={!validForm}
          >
            <View
              style={[
                styles.buttonContainer,
                validForm ? {} : { backgroundColor: "#AAA" },
              ]}
            >
              <Text style={styles.button}>
                {this.state.stageNew ? "Registrar" : "Entrar"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ padding: 10 }}
          activeOpacity={0.7}
          onPress={() => {
            this.setState({ stageNew: !this.state.stageNew });
          }}
        >
          <Text style={styles.button}>
            {this.state.stageNew
              ? "Já possui conta?"
              : "Ainda não possui conta?"}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 70,
    marginBottom: 10,
  },
  subtitle: {
    color: "#FFF",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
    width: "90%",
  },
  input: {
    marginTop: 10,
    backgroundColor: "#FFF",
    padding: 10,
  },
  buttonContainer: {
    backgroundColor: "#080",
    marginTop: 10,
    padding: 10,
    alignItems: "center",
  },
  button: {
    color: "#FFF",
    fontSize: 16,
  },
});
