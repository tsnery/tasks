import React, {Component} from 'react'

import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput
} from 'react-native'

const initialState = {description: '',}

export default class CreateTask extends Component {
    state = {
        ...initialState
    }
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
                    <TextInput 
                        style={styles.input} 
                        placeholder="nova tarefa..." 
                        value={this.state.description}
                        onChangeText={(text)=> this.setState({description: text})}
                    />
                    <View style={styles.buttons}>
                        <TouchableOpacity>
                            <Text style={styles.button} onPress={this.props.onCancel}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.button}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background}></View>
                </TouchableWithoutFeedback>
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
    },
    headerModal: {
        paddingVertical: 15,
        backgroundColor: '#B13B44',
        textAlign: 'center',
        fontSize: 18,
        color:'#FFF',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: '#B13B44',
    },  
    input: {
        height: 40,
        marginTop: 10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6,
    }
})