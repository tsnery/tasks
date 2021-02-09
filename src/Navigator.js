import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import Auth from "./screens/Auth";
import TaskList from "./screens/TaskList";
import Menu from "./screens/Menu";
import Loading from "./screens/Loading";

const menuConfig = {
  initialRouteName: "Today",
  contentComponent: Menu,
  contentOptions: {
    labelStyle: {
      fontWeight: "normal",
      fontSize: 20,
    },
    activeLabelStyle: {
      fontWeight: "bold",
      color: "#080",
    },
  },
};

const menuRoutes = {
  Today: {
    name: "Today",
    screen: (props) => <TaskList {...props} title="Hoje" daysAhead={0} />,
    navigationOptions: {
      title: "Hoje",
    },
  },
  Tomorrow: {
    name: "Tomorrow",
    screen: (props) => <TaskList {...props} title="Amanhã" daysAhead={1} />,
    navigationOptions: {
      title: "Amanhã",
    },
  },
  Week: {
    name: "Week",
    screen: (props) => <TaskList {...props} title="Semana" daysAhead={7} />,
    navigationOptions: {
      title: "Semana",
    },
  },
  Month: {
    name: "Month",
    screen: (props) => <TaskList {...props} title="Mês" daysAhead={30} />,
    navigationOptions: {
      title: "Mês",
    },
  },
};

const menuNavigator = createDrawerNavigator(menuRoutes, menuConfig);

const mainRoutes = {
  Loading: {
    name: "Loading",
    screen: Loading,
  },
  Auth: {
    name: "Auth",
    screen: Auth,
  },
  Home: {
    name: "Home",
    screen: menuNavigator,
  },
};

const mainNavigator = createSwitchNavigator(mainRoutes, {
  initialRouteName: "Loading",
});

export default createAppContainer(mainNavigator);
