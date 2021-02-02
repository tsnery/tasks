import React, {Component} from 'react'

import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TextInput
} from 'react-native'

export default class CreateTask extends Component {
    render () {
        return (
            <Modal 
                transparent={true}
                visible={this.props.isVisible}
                onRequestClose={this.props.onCancel}
                animationType="slide"
            >
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <Text style={styles.headerModal}>Nova tarefa</Text>
                    <TextInput placeholder="nova tarefa..." />
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#FFF',
    },
    background: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0, 0.7)',
    }
})