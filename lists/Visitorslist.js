import { useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Divider, List, Menu, Portal, Snackbar, Text } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";

function Visitorslist ({item,deletedata}) {

    const [visible, setVisible] = useState(false);
    const router = useRouter();    

    return (
        <>
        <TouchableOpacity style={{backgroundColor: '#fff', padding: 10}}
        onPress={() => setVisible(! visible)}
        >

        <List.Item
            title={item?.fullname}
            titleEllipsizeMode="middle"
            description={`${item?.purpose}`}
            descriptionNumberOfLines={15}
            //left={props => <Ionicons name="help-circle" {...props} size={20} />}
            left={props => <View>
                <Text style={{fontSize: 10,color: '#17a2b8'}}>{item?.intime}</Text>
                <Text style={{fontSize: 10,color: 'red'}}>{item?.outtime}</Text>
                </View>
                }

                right={props => <View>
                    <Text style={{fontSize: 10}}>{item?.created_at}</Text>
                    </View>
                    }
        />
            
        </TouchableOpacity>

        {visible && (
            <View style={{backgroundColor: '#fff', borderBottomColor: '#000', borderBottomWidth: 1 }}>
                <Menu.Item disabled={item?.phone == "" ? true: false} style={{marginLeft: 10}} leadingIcon="phone" title="Call" onPress={() => Linking.openURL(`tel:${item?.phone}`)} />
                <Menu.Item disabled={item?.doc == "" ? true: false} style={{marginLeft: 10}} leadingIcon="download-circle" title="Downlaod Attachment" onPress={() => Linking.openURL(`${item?.doc}`)} />
                <Menu.Item style={{marginLeft: 10}} leadingIcon="square-edit-outline" onPress={()=> router.push(`/admin/Frontdesk/create-edit-visitor?id=${item?.id}`)} title="Edit" />
                <Menu.Item style={{marginLeft: 10}} leadingIcon="delete-forever-outline" title="Delete" onPress={()=> deletedata(item?.id,item?.fullname)} />
            </View>
        )}
        </>
    )
}

export default Visitorslist;