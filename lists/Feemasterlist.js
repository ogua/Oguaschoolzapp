import { useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Divider, List, Menu, Portal, Snackbar, Text, MD3Colors } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { selectaccstatus, selectcurrency } from "../features/userinfoSlice";
import { StyleSheet } from "react-native";

function Feemasterlist ({item,deletedata}) {

    const [visible, setVisible] = useState(false);
    const currency = useSelector(selectcurrency);
    const accnt = useSelector(selectaccstatus);
    const router = useRouter();   

    return (
        <>
         <List.AccordionGroup>
            <List.Accordion title={item?.class} id={item?.id}
             description={`${item?.semester} - ${item?.exyear} Academic year`}
             right={props => (
                <>
                <Text style={{color: '#17a2b8'}}>{accnt == '1' && item?.extotalamount}</Text>
                </>
            )}
            >
            <View style={{backgroundColor: '#fff', borderBottomColor: '#000', borderBottomWidth: 1 }}>
            
            {item.fees.map((feeitem,index) => (
                <>
                    <Divider />
                    <List.Item title={feeitem?.fee} key={item?.id} 
                     right={props => (
                        <>
                        <Text style={{color: feeitem?.status != '0' && 'red'}}>{feeitem?.totalamount}</Text>
                        </>
                    )}
                    />
                    <Divider />
                </>
            ))}


                <View style={{flexDirection: 'row', justifyContent: "space-evenly"}}>
                    <Button onPress={()=> router.push(`/admin/Accounts/update-feemaster?id=${item?.id}`)} icon="square-edit-outline">Edit</Button>
                    <Button  onPress={()=> deletedata(item?.id,item?.class+' ('+item?.fee+')')} icon="delete-forever-outline">Delete</Button>
                </View>
            
                {/* <Menu.Item style={{marginLeft: 10}} leadingIcon="square-edit-outline" onPress={()=> router.push(`/admin/Accounts/update-feemaster?id=${item?.id}`)} title="Edit" />
                <Divider />
                <Menu.Item style={{marginLeft: 10}} leadingIcon="delete-forever-outline" title="Delete" onPress={()=> deletedata(item?.id,item?.class+' ('+item?.fee+')')} />
                 <Divider />
                 <Menu.Item style={{marginLeft: 10}} leadingIcon="content-duplicate" title="Duplicate" onPress={()=> deletedata(item?.id,item?.class+' ('+item?.fee+')')} /> */}
            </View>
            
            </List.Accordion>
        </List.AccordionGroup>



        {/* <TouchableOpacity style={{backgroundColor: '#fff', padding: 10}}
        onPress={() => setVisible(! visible)}
        >

        <List.Item
            title={()=> (
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Ionicons name="cash" size={20} style={{marginRight: 10}} />
                    <Text style={{flex: 1, fontSize: 18}}>{item?.class}</Text>
                     <Text style={{fontSize: 10}}>{item?.semester}</Text>
                </View>
            )}
            titleEllipsizeMode="middle"
            description={()=>(
                <>
                <Text style={{fontSize: 13, marginLeft: 30}}>{item?.fee} ({item?.feecode})</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View>
                       <Text style={{fontSize: 12,color: '#abc',marginLeft: 30}}>Fee Amount {currency}{item?.feeamount}</Text>
                       <Text style={{fontSize: 12,color: '#abc',marginLeft: 30}}>Other Fee {currency}{item?.ofeeamount}</Text>
                    </View>
                    <Text style={{fontSize: 12,color: '#abc', fontWeight: 500, marginLeft: 30}}>Total {currency}{item?.total}</Text>
                </View>
                <View style={styles.ribbon}>
                <Text style={styles.ribbontext}>{item?.year}</Text>
                </View>
                
                </>
            )}
            descriptionNumberOfLines={5}
        />
            
        </TouchableOpacity> */}

        {visible && (
            <View style={{backgroundColor: '#fff', borderBottomColor: '#000', borderBottomWidth: 1 }}>
                {/* <Menu.Item disabled={item?.doc == "" ? true: false} style={{marginLeft: 10}} leadingIcon="download-circle" title="Downlaod Attachment" onPress={() => Linking.openURL(`mailto:${item?.email}`)} /> */}
                <Menu.Item style={{marginLeft: 10}} leadingIcon="square-edit-outline" onPress={()=> router.push(`/admin/Accounts/create-edit-feemaster?id=${item?.id}`)} title="Edit" />
                <Menu.Item style={{marginLeft: 10}} leadingIcon="delete-forever-outline" title="Delete" onPress={()=> deletedata(item?.id,item?.class+' ('+item?.fee+')')} />
            </View>
        )}
        </>
    )
}

export default Feemasterlist;

const styles = StyleSheet.create({
    ribbon: {
        position: "absolute",
        bottom: -45,
        right: -40,
        zIndex: 1,
        overflow: "hidden",
        width: 70,
        height: 70,
        textAlign: "right",
    },
    ribbontext: {
        transform: [{ rotate: "295deg" }],
        color: '#9BC90D',
        fontSize: 20
    }
});