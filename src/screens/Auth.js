import React, { Component } from 'react'

import {
    Alert,
    ImageBackground, 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity } from 'react-native'

import backgroundImage from '../../assets/imgs/login.jpg'

export default class Auth extends Component {

    state = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        stageNew: false,
    }

    signinOrSignup = () => {
        if(this.state.stageNew){
            Alert.alert('Sucesso!', 'Criar a conta!')
        } else {
            Alert.alert('Sucesso!', 'Logar!')
        }
    }

    render () {
        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 'Crie sua conta':'Informe seus dados'}
                    </Text>
                    {this.state.stageNew &&
                        <TextInput style={styles.input} placeholder="Nome" 
                            value={this.state.name} 
                            onChangeText={name => this.setState({name})}
                        />  
                    }
                    <TextInput style={styles.input} placeholder="Email" 
                        value={this.state.email} 
                        onChangeText={email => this.setState({email})}
                    />
                    <TextInput style={styles.input} placeholder="Senha" secureTextEntry
                        value={this.state.password} 
                        onChangeText={password => this.setState({password})}
                    />
                    {this.state.stageNew &&
                        <TextInput style={styles.input} placeholder="Confirmar senha" secureTextEntry
                            value={this.state.confirmPassowrd} 
                            onChangeText={confirmPassowrd => this.setState({confirmPassowrd})}
                        />                        
                    }
                    <TouchableOpacity style={styles.buttonContainer} onPress={this.signinOrSignup}>
                        <Text style={styles.button}>
                            {this.state.stageNew ? 'Registrar':'Entrar'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{padding: 10}} 
                    onPress={()=> this.setState({stageNew: !this.state.stageNew})}>
                    <Text style={styles.button}>
                        {this.state.stageNew ? 'Já possui conta?':'Ainda não possui conta?'}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 70,
        color: '#FFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%',
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
        padding: 10,
        fontSize: 16
    },
    buttonContainer: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
    button: {
        color: '#FFF',
        fontSize: 16,
    }
})