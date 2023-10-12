import React, { Component } from 'react'
import { Stack, useRouter } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert, ActivityIndicator } from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, TextInput } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { schoolzapi } from '../constants';
import { selecttoken } from '../../features/userinfoSlice';
import Bookissuedlist from '../../lists/Bookissedlist';
import { LocaleConfig, Calendar } from "react-native-calendars";
import DropDownPicker from 'react-native-dropdown-picker';
import Recordattendancelist from '../../lists/Recordattendancelist';



function Studentattendance () {

    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [isatt, setisatt] = useState(false);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);


    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);
    const [attdate, setattdate] = useState("");

    const [openstudentclass, setOpenstudentclass] = useState(false);
    const [studentclass, setstudentclass] = useState("");
    const [studentclassitems, setstudentclassItems] = useState([]);

    const [apiresponse, setapiresponse] = useState("");
    
    

    useEffect(()=> {

       loaddata();

    },[]);


    useEffect(()=> {

        fetchstudent();
 
     },[studentclass,attdate]);


    const loaddata = () => {
        setLoading(true);
        axios.get(schoolzapi+'/student-classes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            loadstclass(response.data.data);
           
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }

    const loadstclass = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setstudentclassItems(mdata);

         setLoading(false);
    }


    const fetchstudent = () => {

        if(attdate == ""){
            //alert('Attendance Date Cant Be Empty');
            return;
        }

        if(studentclass == ""){
            //alert('Attendance Date Cant Be Empty');
            return;
        }

        console.log("setisatt",attdate+" "+studentclass);

        setFilterdata([]);
        
        setisatt(true);
        axios.get(schoolzapi+'/record-attendance/'+attdate+'/'+studentclass,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
           console.log("setisatt",response.data.data);
           setisatt(false);
           setFilterdata(response.data.data);
           
          })
          .catch(function (error) {
            setisatt(false);
            console.log(error);
          });
    }

    const saveattendance = (studentid,radioprops) => {

        const formdata = {
            studentid,
            radioprops,
            attdate,
            studentclass
        }

        axios.post(schoolzapi+'/save-attendance',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (response) {
            setapiresponse("successfully");
        })
        .catch(function (error) {
            setapiresponse("error");
        });

        return apiresponse;
        
    }


    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen options={{
            headerTitle: 'Student Attendance'
        }}
        />
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loaddata} />
        }
        >
            <Card>
                <Card.Content>

                {isloading ? null : (
                <>

    <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Text>Attendance Date </Text>
    <Button icon="calendar-range" onPress={() => setShowdialog(true)}> select Date</Button>
</View>
<Portal>
    <Dialog visible={showdialog} onDismiss={hideDialog}>
        <Dialog.Content>
            <Calendar
                visible={true}
                onDayPress={(day) => {
                setSelecteddate(day.dateString);
                setattdate(day.dateString);
                setShowdialog(false);
                //setstudentclass("");
                }}
                markedDates={{
                    [selecteddate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                }}
                    enableSwipeMonths={true}
                />

        </Dialog.Content>
        <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
        </Dialog>
</Portal>
<TextInput
        //style={styles.Forminput}
        keyboardType="numeric"
        mode="outlined"
        onChangeText={(e) => setattdate(e)}
        value={attdate} />


         <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Student Class</Text>
               <DropDownPicker
                    open={openstudentclass}
                    value={studentclass}
                    items={studentclassitems}
                    setOpen={setOpenstudentclass}
                    setValue={setstudentclass}
                    setItems={setstudentclassItems}
                    //onChangeValue={fetchstudent}
                    placeholder={"Student Class"}
                    placeholderStyle={{
                        color: "#456A5A",
                    }}
                    listMode="MODAL"
                    dropDownContainerStyle={{
                        borderWidth: 0,
                        borderRadius: 30,
                        backgroundColor: "#fff"
                    }}
                    labelStyle={{
                        color: "#000",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 50,
                        marginTop: 10,
                        marginBottom: 20
                    }}
                    />
                    </>
                    )}


                {isatt ? <ActivityIndicator /> : (
                
                <FlatList
                    data={filterdata}
                    renderItem={({item})=> <Recordattendancelist item={item} saveattendance={saveattendance} studentclass={studentclass} attdate={attdate} /> }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                         marginBottom: 10
                    }}
                    keyExtractor={item => item.id}
                />

                )}
                </Card.Content>
            </Card> 

        </ScrollView>
      </SafeAreaView>
      </Provider>
    )
}

export default Studentattendance;

const styles = StyleSheet.create({

    separator: {
        height: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    calendarWrapper: {
      padding: 0,
      margin: 0,
      height: '100%',
      width: '100%'
  }
});
