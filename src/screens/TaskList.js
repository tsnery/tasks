import React, { Component } from "react";

import todayImage from "../../assets/imgs/today.jpg";

import moment from "moment";
import "moment/locale/pt-br";
import axios from 'axios'

import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from "react-native-vector-icons/FontAwesome";

import Task from "../components/Task";
import CreateTask from './CreateTask'
import {server, showError} from '../common'
import {
  Alert,
  View,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform
} from "react-native";

const initialState = {
  showDoneTasks: true,
  showModal: false,
  visibleTasks: [],
  tasks: [],
}

export default class TaskList extends Component {
  state = {
    ...initialState
  };

  // carrega os dados salvos no async storage ao iniciar a aplicação
  componentDidMount = () => {
      this.getData() // carrega os dados do async storage
      this.loadTasks() // carrega os dados do banco de dados
  }

  loadTasks = async() => {
    try {
      const maxDate = moment().format('YYYY-MM-DD 23:59:59')
      const response = await axios.get(`${server}/tasks`)
      this.setState({ tasks: response.data }, this.filterTasks)
    } catch(e) {
      showError(e)
    }
  }

  // alterna uma task pendente para conclúida e vice-versa
  toggleTask = (taskId) => {
    const tasks = [...this.state.tasks];
    tasks.forEach((task) => {
      if (task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date();
      }
    });
    this.setState({ tasks }, this.filterTasks);
  };

  // alterna a visibilidade das tasks
  toggleFilter = () => {
    this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks);
  };

  // filtra as tarefas de acordo com a visibilidade
  filterTasks = () => {
      let visibleTasks = null
      if(this.state.showDoneTasks){
          visibleTasks = [...this.state.tasks]
      } else {
          const pending = task => task.doneAt === null
          visibleTasks = this.state.tasks.filter(pending)
      }
      this.setState({visibleTasks})
      this.storeData({
        showDoneTasks: this.state.showDoneTasks
      })
  }

  // guarda os dados no async storage
  storeData = async(value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('taskState', jsonValue)
    } catch (e) {
      console.log(e)
    }
  }
  // obtem os dados do async storage
  getData = async() => {
    try {
      const jsonValue = await AsyncStorage.getItem('taskState')
      const savedState = jsonValue != null ? JSON.parse(jsonValue) : initialState
      this.setState({showDoneTasks: savedState.showDoneTasks}, this.filterTasks)
    } catch (e) {
      console.log(e)
    }
  }


  // adiciona nova task
  addTask = (newTask) => {
    if(!newTask.description || !newTask.description.trim()){
      Alert.alert('Dados inválidos!', 'Descrição não informada!')
      return
    }
    const tasks = [...this.state.tasks]
    tasks.push({
      id:Math.random(),
      description: newTask.description,
      estimateAt: newTask.date,
      doneAt: null
    })
    this.setState({tasks, showModal: false}, this.filterTasks)
  }

  // deleta uma task
  deleteTask = (id) => {
    const tasks = this.state.tasks.filter(task => task.id !== id)
    this.setState({tasks}, this.filterTasks)
  }

  render() {
    const today = moment().locale("pt-br").format("ddd, D [de] MMMM");

    const {visibleTasks, showModal, showDoneTasks} = this.state
    return (
      <View style={styles.container}>
        <CreateTask isVisible={showModal} 
          onCancel={() => this.setState({showModal: false})}
          onSave={this.addTask}
        />
        <ImageBackground source={todayImage} style={styles.background}>
          <View style={styles.iconBar}>
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
            <Text style={styles.title}>Hoje</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>

          <FlatList
            data={visibleTasks}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item }) => (
              <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask}/>
            )}
          />

        </View>
        <View style={styles.addButton}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({showModal:true})}>
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
    marginBottom: 20,
  },
  subtitle: {
    color: "#FFF",
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
  iconBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  icon: {
      paddingVertical: Platform.OS === 'ios' ? 30 : 10,
      paddingHorizontal: 20,
  },
  addButton: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      height: 50,
      width: 50,
      backgroundColor: '#B13B44',
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center'
  }
});
