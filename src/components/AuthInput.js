import React from 'react'
import {
    View, TextInput, StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const AuthInput = (props) => {
    return (
        <View style={[styles.container, props.style]}>
            <Icon name={props.icon} size={20} style={styles.icon}/>
            <TextInput {...props} style={styles.input}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        height: 40,
        backgroundColor: '#EEE',
        borderRadius: 20,
    },
    icon: {
        color: '#888',
        marginLeft: 10,
    },
    input: {
        width: '80%',
        marginLeft: 10,
    }

})
export default AuthInput