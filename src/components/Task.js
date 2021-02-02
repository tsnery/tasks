import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableWithoutFeedback, 
    TouchableOpacity, 
    Platform 
} from 'react-native'

const Task = (props) => {

    // checkbox das tasks
    const checkTask = (doneAt) => {
        if(doneAt != null) {
            return <View style={styles.done}><Icon name="check" size={20} color="#FFF"/></View>
        } else {
            return <View style={styles.pending}></View>
        }
    }

    // estilo utilizado em uma task feita
    const doneOrNotStyle = props.doneAt ? {textDecorationLine: 'line-through'} : {}

    // formata a data de acordo com a atributo utilizado, estimateAt ou doneAt
    const date = props.doneAt != null ? props.doneAt : props.estimateAt
    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM')

    return(
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => props.onToggleTask(props.id)}>
                <View style={styles.checkContainer}>
                    {checkTask(props.doneAt)}
                </View>
            </TouchableWithoutFeedback>
            <View>
                <Text style={[styles.desc, doneOrNotStyle]}>{props.description}</Text>
                <Text style={[styles.date, doneOrNotStyle]}>{formattedDate}</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    checkContainer: {
        width: '15%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pending: {
        height: 25,
        width: 25,
        borderColor: '#333',
        borderRadius: 13,
        borderWidth: 1,
    },
    done: {
        height: 25,
        width: 25,
        borderColor: '#333',
        borderRadius: 13,
        borderWidth: 1,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        fontSize: 15,
        color: '#222',
    },
    date: {
        fontSize: 12,
        color: '#555',
    }
})

export default Task