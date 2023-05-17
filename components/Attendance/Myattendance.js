import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, Dimensions, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, Divider, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import MapView, { Marker } from "react-native-maps";
import { FlatList,Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CalendarStrip from 'react-native-calendar-strip';
import { selecttoken } from '../../features/userinfoSlice';
import { schoolzapi } from '../constants';

function Myattendance() {

    const token = useSelector(selecttoken);
    const [waypoints, setWaypoints] = useState([]);
    const [students, setstudents] = useState([]);
    const [staff, setstaff] = useState([]);
    const [route, setroutes] = useState({});
    
    const [latitude, setlatitude] = useState(""); 
    const [logitude, setlogitude] = useState("");
    const [address, setaddress] = useState("");
    const [routename,setroutename] = useState("");
    
    const SCREEN_HEIGHT = Dimensions.get("window").height;
    const [isloading, setLoading] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

    const [studnname, setstudnname] = useState("");
    const [studimg, setstudimg] = useState("");
    const [attendance, setattendance] = useState("");

    const [markedDates, setmarkedDatesArray] = useState([]);

    const markedDatesArray = [
        {
            date: '2023-04-24',
            dots: [
              {
                color: "#fff",
                selectedColor: "#ccc"
              },
            ],
        },
        {
            date: '2023-04-26',
            dots: [
              {
                color: "#fff",
                selectedColor: "#ccc"
              },
            ],
        },
    ];

    useEffect(()=>{
      loaddata();
    },[]);

    const loaddata = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/my-attendance-student',
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    })
      .then(function (response) {
        setstudimg(response.data.data.pic);
        setstudnname(response.data.data.fullname);
        setattendance(response.data.data.studentcount);
        loadattendance(response.data.data.allattendance);

      }).catch(function(error){
          setLoading(false);
          console.log("error",error);
      });
  }

  const loadattendance = (data) => {
            
    const mddatas = data;
    
    let mdata = [];

     mddatas.map(item =>  mdata.push({
        date: item?.date,
        dots: [
          {
            color: "#fff",
            selectedColor: "#ccc"
          },
        ],
    }))
    
    setmarkedDatesArray(mdata);

    setLoading(false);
}

    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'My Attendance'
            }}

        />
        <ScrollView style={{marginBottom: 30}}
        >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>

        <Avatar.Image 
             source={{uri: studimg}}
            size={100}
        />

        <Text style={{fontSize: 18, fontWeight: 500, marginTop: 10}}>{studnname.toUpperCase()}</Text>


        <Text style={{fontSize: 15, fontWeight: 500, marginTop: 10}}>Total Attendance: {attendance}</Text>
        
        <CalendarStrip
            scrollable
            style={{height:300, paddingTop: 20, paddingBottom: 10, marginTop: 20}}
            calendarColor={'#3343CE'}
            calendarHeaderStyle={{color: 'white',fontSize: 25}}
            dateNumberStyle={{color: 'white',fontSize: 15}}
            dateNameStyle={{color: 'white'}}
            highlightDateNumberStyle={{color: 'yellow'}}
            highlightDateNameStyle={{color: 'yellow'}}
            iconContainer={{flex: 0.1, color: '#fff'}}
            iconStyle={{color: '3fff'}}
            iconLeftStyle={{fontSize: 20, color: '#fff'}}
            markedDates={markedDates}
            markedDatesStyle={{borderWidth: 5, borderColor: 'yellow'}}
            //dayContainerStyle={{height: 50, borderWidth: 1, marginBottom: 40}}
        />


       </Card.Content>
        </Card>
        )}
        </ScrollView>

      </SafeAreaView>
    )
}

export default Myattendance;

const styles = StyleSheet.create({
    map: {
      width: '100%',
      height: '100%',
    },
});