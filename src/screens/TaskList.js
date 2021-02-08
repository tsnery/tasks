import React, { Component } from "react";

import commonStyles from "../commonStyles"

import todayImage from "../../assets/imgs/today.jpg";
import tomorrowImage from "../../assets/imgs/tomorrow.jpg";
import weekImage from "../../assets/imgs/week.jpg";
import monthImage from "../../assets/imgs/month.jpg";

import moment from "moment";
import "moment/locale/pt-br";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

import Task from "../components/Task";
import CreateTask from "./CreateTask";
import { server, showError } from "../common";
import {
  Alert,
  View,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform} from "react-native";

const initialState = {
  showDoneTasks: true,
  showModal: false,
  visibleTasks: [],
  tasks: [],
}

export default class TaskList extends Component {
  state = {
    ...initialState,
  };

  // carrega os dados salvos no async storage ao iniciar a aplicação
  componentDidMount = () => {
    this.getData(); // carrega os dados do async storage
    this.loadTasks(); // carrega os dados do banco de dados
  };

  // carrega as tasks do banco de dados de acordo com o tempo selecionado
  loadTasks = async () => {
    try {
      const maxDate = moment()
        .add({ days: this.props.daysAhead })
        .format("YYYY-MM-DD 23:59:59");
      const response = await axios.get(`${server}/tasks?date=${maxDate}`);
      this.setState({ tasks: response.data }, this.filterTasks);
    } catch (e) {
      showError(e);
    }
  };

  // alterna uma task pendente para conclúida e vice-versa
  toggleTask = async (taskId) => {
    try {
      await axios.put(`${server}/tasks/${taskId}/toggle`);
      await this.loadTasks();
    } catch (e) {
      showError(e);
    }
  };

  // alterna a visibilidade das tasks
  toggleFilter = () => {
    this.setState(
      { showDoneTasks: !this.state.showDoneTasks },
      this.filterTasks
    );
  };

  // filtra as tarefas de acordo com a visibilidade
  filterTasks = () => {
    let visibleTasks = null;
    if (this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks];
    } else {
      const pending = (task) => task.doneAt === null;
      visibleTasks = this.state.tasks.filter(pending);
    }
    this.setState({ visibleTasks });
    this.storeData({
      showDoneTasks: this.state.showDoneTasks,
    });
  };

  // guarda os dados no async storage
  storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("taskState", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };
  // obtem os dados do async storage
  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("taskState");
      const savedState =
        jsonValue != null ? JSON.parse(jsonValue) : initialState;
      this.setState(
        { showDoneTasks: savedState.showDoneTasks },
        this.filterTasks
      );
    } catch (e) {
      console.log(e);
    }
  };

  // adiciona nova task
  addTask = async (newTask) => {
    if (!newTask.description || !newTask.description.trim()) {
      Alert.alert("Dados inválidos!", "Descrição não informada!");
      return;
    }

    try {
      await axios.post(`${server}/tasks`, {
        description: newTask.description,
        estimateAt: newTask.date,
      });
      this.setState({ showModal: false }, this.loadTasks);
    } catch (e) {
      showError(e);
    }
  };

  // deleta uma task
  deleteTask = async (id) => {
    try {
      await axios.delete(`${server}/tasks/${id}`);
      await this.loadTasks();
    } catch (e) {
      showError(e);
    }
  };

  getImage = () => {
    switch(this.props.daysAhead) {
      case 0: return todayImage
      case 1: return tomorrowImage
      case 7: return weekImage
      default: return monthImage
    }
  }
  getColor = () => {
    switch(this.props.daysAhead) {
      case 0: return commonStyles.colors.today
      case 1: return commonStyles.colors.tomorrow
      case 7: return commonStyles.colors.week
      default: return commonStyles.colors.month
    }
  }

  render() {
    const today = moment().locale("pt-br").format("ddd, D [de] MMMM");

    const { visibleTasks, showModal, showDoneTasks } = this.state;
    return (
      <View style={styles.container}>
        <CreateTask
          isVisible={showModal}
          onCancel={() => this.setState({ showModal: false })}
          onSave={this.addTask}
        />
        <ImageBackground source={this.getImage()} style={styles.background}>
          <View style={styles.iconBar}>
            <TouchableWithoutFeedback onPress={() => this.props.navigation.openDrawer()}>
              <Icon
                style={styles.icon}
                name="bars"
                size={20}
                color="#FFF"
            />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.toggleFilter}>
              <Icon
                style={styles.icon}
                name={showDoneTasks ? "eye" : "eye-slash"}
                size={20}
                color="#FFF"
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
          <FlatList
            data={visibleTasks}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item }) => (
              <Task
                {...item}
                onToggleTask={this.toggleTask}
                onDelete={this.deleteTask}
              />
            )}
          />
        </View>
        <View style={[styles.addButton, {backgroundColor: this.getColor()}]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => this.setState({ showModal: true })}
          >
            <Icon name="plus" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  taskList: {
    flex: 7,
  },
  titleBar: {
    flex: 1,
    justifyContent: "flex-end",
  },
  title: {
    color: "#FFF",
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 10,
  },
  subtitle: {
    color: "#FFF",
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
  iconBar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    paddingVertical: Platform.OS === "ios" ? 30 : 10,
    paddingHorizontal: 20,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    height: 50,
    width: 50,
    backgroundColor: "#B13B44",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
