import { useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Divider, List, Menu, Portal, Snackbar, Text } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { selectcurrency } from "../features/userinfoSlice";
import { StyleSheet } from "react-native";

function HomeworkList ({item,deletedata}) {

    const [visible, setVisible] = useState(false);
    const currency = useSelector(selectcurrency);
    const router = useRouter();    

    return (
        <>
        <TouchableOpacity style={{backgroundColor: '#fff', padding: 10}}
        onPress={() => setVisible(! visible)}
        >

        <List.Item
            title={()=> (
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Ionicons name="book-outline" size={20} style={{marginRight: 10}} />
                    <Text style={{flex: 1, fontSize: 18}}>{item?.title}</Text>
                     <Text style={{fontSize: 10}}>{item?.studentclass}</Text>
                     {/* <Ionicons name="ellipsis-vertical-sharp" size={20} /> */}
                </View>
            )}
            titleEllipsizeMode="middle"
            description={()=>(
                <>
                <Text style={{fontSize: 10, marginLeft: 30}}>{item?.term}</Text>
                <Text style={{fontSize: 10, marginLeft: 30}}>Submission Date: {item?.subdate} - {item?.time}</Text>
                <Text style={{fontSize: 13, marginLeft: 30}}>{item?.description}</Text>
                <View style={styles.ribbon}>
                <Text style={styles.ribbontext}>{item?.status}</Text>
                </View>
                
                </>
            )}
            descriptionNumberOfLines={5}
            //left={props => <Ionicons name="help-circle" {...props} size={20} />}
            //right={props => <Ionicons name="ellipsis-vertical-sharp" {...props} size={20} />}
        />
            
        </TouchableOpacity>

        <View style={{flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'flex-end'}}>
            <Button onPress={()=> router.push(`/admin/homework/view-assignment-submitted?stclass=${item?.stclass}&assigmtid=${item?.id}`)}>Assignments Received</Button>
            <Button onPress={()=> router.push(`/admin/homework/enter-assignment-score?stclass=${item?.stclass}&assigmtid=${item?.id}`)}>Enter Score</Button>
        </View>

        {visible && (
            <View style={{backgroundColor: '#fff', borderBottomColor: '#000', borderBottomWidth: 1 }}>
                <Menu.Item disabled={item?.file == "" ? true: false} style={{marginLeft: 10}} leadingIcon="download-circle" title="Downlaod Attachment" onPress={() => Linking.openURL(`mailto:${item?.email}`)} />
                <Menu.Item style={{marginLeft: 10}} leadingIcon="square-edit-outline" onPress={()=> router.push(`/admin/homework/create-edit-homework?id=${item?.id}`)} title="Edit" />
                <Menu.Item style={{marginLeft: 10}} leadingIcon="delete-forever-outline" title="Delete" onPress={()=> deletedata(item?.id,item?.title)} />
            </View>
        )}
        </>
    )
}

export default HomeworkList;

const styles = StyleSheet.create({
    ribbon: {
        position: "absolute",
        bottom: -35,
        right: -30,
        zIndex: 5,
        overflow: "hidden",
        width: 90,
        height: 70,
        textAlign: "right",
    },
    ribbontext: {
        transform: [{ rotate: "295deg" }],
        color: '#9BC90D',
        fontSize: 20
    }
});