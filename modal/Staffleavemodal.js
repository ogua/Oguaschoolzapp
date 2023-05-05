import { Modal, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from "react-native";


function Staffleavemodal({modalvisible,setvisibility}){

    return(
        <View style={style.centeredView}>
            <Modal
            animationType="slide"
            transparent={false}
            visible={modalvisible}
            presentationStyle="overFullScreen"
            >
                <View style={style.modalcontainer}>
                    <View style={style.modalheader}>
                      <Text>Modal Header</Text>
                      <Pressable style={style.closebtn} onPress={() => setvisibility(false)}>
                         <Text><Ionicons name="close-circle" size={20} color="#abc" /> Hide Modal </Text>
                      </Pressable>
                    </View>
                    
                    <View style={style.modalbody}>
                       <Text>Modal body</Text>
                    </View>

                    <View style={style.modalfooter}>
                      <Text>Modal footer</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default Staffleavemodal;

const style = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalcontainer: {
        backgroundColor: '#fff',
        padding: 20
    },
    modalheader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    closebtn: {
        backgroundColor: '#fff',
        borderRadius: 100/2,
        borderWidth: 2
    },
    modalbody: {
        backgroundColor: '#fff'
    },
    modalfooter: {
        backgroundColor: 'blue'
    }
});