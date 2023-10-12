import { useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Divider, List, Menu, Portal, Snackbar, Text } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";

function Enquirylist ({item,deletedata}) {

    const [visible, setVisible] = useState(false);
    const router = useRouter();    

    return (
        <>
        <TouchableOpacity style={{backgroundColor: '#fff', padding: 10}}
        onPress={() => setVisible(! visible)}
        >

        <List.Item
            title={`${item?.fullname}`}
            titleEllipsizeMode="middle"
            description={item?.note}
            descriptionNumberOfLines={5}
            //left={props => <Text>{item?.location}</Text>}
            right={props => <Text>{item?.created_at}</Text>}
        />
            
        </TouchableOpacity>

        {visible && (
            <View style={{backgroundColor: '#fff', borderBottomColor: '#000', borderBottomWidth: 1 }}>
                <Menu.Item disabled={item.phone == "" ? true: false} style={{marginLeft: 10}} leadingIcon="phone" title="Call" onPress={() => Linking.openURL(`tel:${item?.phone}`)} />
                <Menu.Item disabled={item.email == "" ? true: false} style={{marginLeft: 10}} leadingIcon="email-box" title="Send Mail" onPress={() => Linking.openURL(`mailto:${item?.email}`)} />
                <Menu.Item style={{marginLeft: 10}} leadingIcon="square-edit-outline" onPress={()=> router.push(`/admin/Frontdesk/create-edit-enquirey?id=${item?.id}`)} title="Edit" />
                <Menu.Item style={{marginLeft: 10}} leadingIcon="delete-forever-outline" title="Delete" onPress={()=> deletedata(item?.id,item?.fullname)} />
            </View>
        )}
        </>
    )
}

export default Enquirylist;