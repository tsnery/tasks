import React, { Component, state } from "react";
import todayImage from "../../assets/imgs/today.jpg";
import moment from "moment";
import "moment/locale/pt-br";
import Icon from "react-native-vector-icons/FontAwesome";

import Task from "../components/Task";
import CreateTask from './CreateTask'
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform
} from "react-native";

export default class TaskList extends Component {
  state = {
    showDoneTasks: true,
    showModal: false,
    visibleTasks: [],
    tasks: [
      {
        id: Math.random(),
        description: "Estudar NodeJS",
        estimateAt: new Date(),
        doneAt: null,
      },
      {
        id: Math.random(),
        description: "Estudar ReactJS",
        estimateAt: new Date(),
        doneAt: new Date(),
      },
    ],
  };

  componentDidMount = () => {
      this.filterTasks()
  }

  // alterna uma task pendente para conclúida e vice-versa
  toggleTask = (taskId) => {
    const tasks = [...this.state.tasks];
    tasks.forEach((task) => {
      if (task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date();
      }
    });
    this.setState({ tasks });
  };

  // alterna a visibilidade das tasks
  toggleFilter = () => {
    this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks);
  };

  // filtra as tarefas para mostrar apenas as pendentes
  filterTasks = () => {
      let visibleTasks = null
      if(this.state.showDoneTasks){
          visibleTasks = [...this.state.tasks]
      } else {
          const pending = task => task.doneAt === null
          visibleTasks = this.state.tasks.filter(pending)
      }
      this.setState({visibleTasks})
  }

  render() {
    const today = moment().locale("pt-br").format("ddd, D [de] MMMM");

    const {visibleTasks, showModal, showDoneTasks} = this.state
    return (
      <View style={styles.container}>
        <CreateTask isVisible={showModal} onCancel={() => this.setState({showModal: false})}/>
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
              <Task {...item} onToggleTask={this.toggleTask} />
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
