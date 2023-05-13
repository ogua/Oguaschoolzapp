import { useState } from "react";
import { ActivityIndicator, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Button, Dialog, Divider, List, Menu,MD3Colors, Portal,ProgressBar, Snackbar, Text } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";
import { selecttoken } from "../features/userinfoSlice";
import { useEffect } from "react";
import { color } from "react-native-reanimated";

function Stafflist ({item,deletedata,studentclasslist,updatestatus,updatesstclass}) {

    const token = useSelector(selecttoken);
    const [visible, setVisible] = useState(false);
    const router = useRouter();

    const [openstatus, setOpenstatus] = useState(false);
    const [status, setStatus] = useState(null);
    const [statusitem, setStatusitems] = useState([
        { label: "Completed", value: "Yes"},
        { label: "Dismissed", value: "Dismissed"},
        { label: "Stopped", value: "Stopped"},
        { label: "Active", value: "No"},
    ]);

    const [openstudentclass, setOpenstudentclass] = useState(false);
    const [studentclass, setStudentclass] = useState(null);
    const [classitem, setClassitems] = useState();
    const [currentphone, setcurrentphone] = useState();


    useEffect(() => {

        //loaddropdown(studentclasslist);

        //console.log(studentclasslist);

       // setcurrentphone(item?.fgaurdain?.mobile);

    },[]);


    const loaddropdown = (studentclasslist) => {

        console.log("studentclasslist",studentclasslist);
            
        const mddatas = studentclasslist;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setClassitems(mdata);
          
      }


    return (
        <>
        
        <TouchableOpacity style={{backgroundColor: '#fff', padding: 20}}
        onPress={() => setVisible(! visible)}
        >
         <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
            <Avatar.Image 
                source={{uri: item?.pic}}
                    size={30}
            />
             <Text style={{fontSize: 15}}>{item?.fullname}</Text>
        </View>
         
         {/* <View style={{alignItems: 'center',padding: 10}}>
                <Text style={{fontSize: 18}}>{item?.fullname}</Text>
                <Text style={{fontSize: 15}}>{item?.student_id} :-: {item?.stclass}</Text>
        </View> */}
        </TouchableOpacity>

        {visible && (
                <View style={{backgroundColor: `${visible ? '#fff' : '#fff'}`, borderBottomColor: '#000', borderBottomWidth: 1 }}>
                <Divider bold={true} />
                <Menu.Item style={[styles.textcolor,{marginLeft: 10}]} leadingIcon="square-edit-outline" onPress={()=> router.push(`/admin/staff/create-edit-staff?id=${item?.id}&userid=${item?.user_id}`)} title="Edit" />
                <Menu.Item style={{marginLeft: 10}} leadingIcon="eye" title="View" onPress={()=> router.push(`/admin/staff/view-staff?id=${item?.id}&userid=${item?.user_id}`)} />
                <Menu.Item style={{marginLeft: 10}} leadingIcon="delete-forever-outline" title="Delete" onPress={()=> deletedata(item?.id,item?.fullname)} />
                <Menu.Item disabled={item?.phone == "" ? true: false} style={{marginLeft: 10}} leadingIcon="phone" title="Call" onPress={() => Linking.openURL(`tel:${item?.phone}`)} />                   
            </View>
        )}
        </>
    )
}

export default Stafflist;

const styles = StyleSheet.create({
    textcolor: {
        color: '#fff'
    }
})