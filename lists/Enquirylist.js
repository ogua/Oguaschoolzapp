import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button, Dialog, List, Menu, Portal, Snackbar, Text } from "react-native-paper";
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
            title={item?.name}
            titleEllipsizeMode="middle"
            //description={item?.code}
            left={props => <Ionicons name="book" {...props} size={20} />}
            right={props => <Ionicons name="ellipsis-vertical-sharp" {...props} size={20} />}
        />
            
        </TouchableOpacity>

        {visible && (
            <View style={{backgroundColor: '#fff', borderBottomColor: '#000', borderBottomWidth: 1 }}>
                <Menu.Item style={{marginLeft: 10}} leadingIcon="square-edit-outline" onPress={()=> router.push(`/admin/Academics/create-edit-classroom?id=${item.id}`)} title="Edit" />
                <Menu.Item style={{marginLeft: 10}} leadingIcon="delete-forever-outline" title="Delete" />
            </View>
        )}
        </>
    )
}

export default Enquirylist;