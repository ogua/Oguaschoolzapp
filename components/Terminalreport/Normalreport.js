import React, { Component } from 'react'
import { Stack, useRouter } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert, ActivityIndicator, Linking } from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, TextInput } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { oguaschoolz, schoolzapi } from '../constants';
import { selectprinttype, selecttoken, selectuser } from '../../features/userinfoSlice';
import Bookissuedlist from '../../lists/Bookissedlist';
import { LocaleConfig, Calendar } from "react-native-calendars";
import DropDownPicker from 'react-native-dropdown-picker';
import Recordattendancelist from '../../lists/Recordattendancelist';



function Normalreport () {

    const token = useSelector(selecttoken);
    const user = useSelector(selectuser);
    const printtype = useSelector(selectprinttype);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
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

    const [openterm, setOpenterm] = useState(false);
    const [term, setterm] = useState("");
    const [termitems, settermItems] = useState([]);

    const [openreporttype, setOpenreporttype] = useState(false);
    const [reporttype, setreporttype] = useState("");
    const [reporttypeitems, setreporttypeItems] = useState([
        { label: 'Normal Report', value: 'Normal Report'},
        { label: 'Questionnaire 1', value: 'Sample 1'},
        { label: 'Questionnaire 2', value: 'Sample 2'},
        { label: 'Preschool', value: 'Preschool'}
    ]);


    const [reopenshowdialog, setreopenShowdialog] = useState(false);
    const reopenhideDialog = () => setreopenShowdialog(false);
    const [reopenselecteddate, setreopenSelecteddate] = useState(false);
    const [reopenattdate, setreopenattdate] = useState("");

    const [apiresponse, setapiresponse] = useState("");

    const [working, setworking] = useState("");
    const [totstudent, settotstudent] = useState("");

    const [fetchingclass, setfetchingclass] = useState(false);

    useEffect(()=> {

       loaddata();

    },[]);

    function getstudentclass() {

        return axios.get(schoolzapi+'/student-classes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
    }

    function getacademicterm() {

        return axios.get(schoolzapi+'/academicterms',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }

     function workingdays() {

        return axios.get(schoolzapi+'/total-working-days',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }


    const loaddata = () => {
        setLoading(true);
        Promise.all([getstudentclass(), getacademicterm(), workingdays()])
          .then(function (response) {
            loadterm(response[1].data.data);
            loadstclass(response[0].data.data);
            setworking(response[2].data.totalattendance);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }

    const loadterm = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         settermItems(mdata);

         setLoading(false);
    }

    const loadstclass = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setstudentclassItems(mdata);

         setLoading(false);
    }

    const gettotalclass = () => {
        
        setfetchingclass(true);
        axios.get(schoolzapi+'/fetch-total-class/'+studentclass,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
           
            setfetchingclass(false);
            settotstudent(response.data.totalclass);
          })
          .catch(function (error) {
            setfetchingclass(false);
            console.log(error);
          });
    }


    const fetchstudent = () => {
        
        if(term == ""){
            return;
        }

        if(reopenattdate == ""){
            return;
        }

        if(studentclass == ""){
            return;
        }

        if(reporttype == ""){
            return;
        }

        
        const currentDate = new Date();
        const dateString = currentDate.toISOString();


        if(printtype != "0"){

            Linking.openURL(`${oguaschoolz}/terminal-report/${term}/{reopenattdate}/${user.uniqueid == "e6ddc0c0-2e7e-4735-bfe1-4ee02f53834f" ? dateString : attdate}/${studentclass}/${user.uniqueid}/${reporttype}`);
            return;
        }
        
        router.push(`/admin/terminalreport/report-students?term=${term}&open=${reopenattdate}&close=${user.uniqueid == "e6ddc0c0-2e7e-4735-bfe1-4ee02f53834f" ?  dateString :attdate}&stclass=${studentclass}&type=${reporttype}&working=${working}&totstudent=${totstudent}`);
    }

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen options={{
            headerTitle: 'Terminal Report'
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

<Text style={{fontSize: 15, fontWeight: 500}}>Report Type </Text>
               <DropDownPicker
                    open={openreporttype}
                    value={reporttype}
                    items={reporttypeitems}
                    setOpen={setOpenreporttype}
                    setValue={setreporttype}
                    setItems={setreporttypeItems}
                    placeholder={""}
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

       <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Academic Term</Text>
               <DropDownPicker
                    open={openterm}
                    value={term}
                    items={termitems}
                    setOpen={setOpenterm}
                    setValue={setterm}
                    setItems={settermItems}
                    placeholder={""}
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

    
    {user.uniqueid != "e6ddc0c0-2e7e-4735-bfe1-4ee02f53834f" && (
        <>
    
    
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Text>School Closes On </Text>
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

</>
    )}


<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
    <Text>School Reopens On </Text>
    <Button icon="calendar-range" onPress={() => setreopenShowdialog(true)}> select Date</Button>
</View>
<Portal>
    <Dialog visible={reopenshowdialog} onDismiss={reopenhideDialog}>
        <Dialog.Content>
            <Calendar
                visible={true}
                onDayPress={(day) => {
                setreopenSelecteddate(day.dateString);
                setreopenattdate(day.dateString);
                setreopenShowdialog(false);
                }}
                markedDates={{
                    [reopenselecteddate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                }}
                    enableSwipeMonths={true}
                />

        </Dialog.Content>
        <Dialog.Actions>
            <Button onPress={reopenhideDialog}>Cancel</Button>
            </Dialog.Actions>
        </Dialog>
</Portal>
<TextInput
        //style={styles.Forminput}
        keyboardType="numeric"
        mode="outlined"
        onChangeText={(e) => setreopenattdate(e)}
        value={reopenattdate} />


<Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Student Class</Text>
               <DropDownPicker
                    open={openstudentclass}
                    value={studentclass}
                    items={studentclassitems}
                    setOpen={setOpenstudentclass}
                    setValue={setstudentclass}
                    setItems={setstudentclassItems}
                    onChangeValue={gettotalclass}
                    placeholder={""}
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

                    {fetchingclass ? <ActivityIndicator size="large"  style={{marginTop: 20}} /> : (
                        <Button onPress={fetchstudent} mode="contained" style={{marginTop: 20}}>{printtype != "0" ? 'View Report' : 'Fetch Details'}</Button>
                    )}

         
                    </>
                    )}

                </Card.Content>
            </Card> 

        </ScrollView>
      </SafeAreaView>
      </Provider>
    )
}

export default Normalreport;

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
