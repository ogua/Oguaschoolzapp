import React, { Component } from 'react'
import { Stack, useRouter } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert, ActivityIndicator } from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, TextInput, Checkbox } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { schoolzapi } from '../constants';
import { selecttoken } from '../../features/userinfoSlice';
import Bookissuedlist from '../../lists/Bookissedlist';
import { LocaleConfig, Calendar } from "react-native-calendars";
import DropDownPicker from 'react-native-dropdown-picker';
import Recordattendancelist from '../../lists/Recordattendancelist';
import { selecttranemail, setTranemail } from '../../features/examSlice';



function Sendtransactionbymail () {

    const token = useSelector(selecttoken);
    const temail = useSelector(selecttranemail);
    const disptach = useDispatch();
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setissubmitting] = useState(false);
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
        { label: 'Questionnaire 2', value: 'Sample 2'}
    ]);


    const [reopenshowdialog, setreopenShowdialog] = useState(false);
    const reopenhideDialog = () => setreopenShowdialog(false);
    const [reopenselecteddate, setreopenSelecteddate] = useState(false);
    const [reopenattdate, setreopenattdate] = useState("");

    const [apiresponse, setapiresponse] = useState("");

    const [email, setemail] = useState(temail);
    const [totstudent, settotstudent] = useState("");

    const [fetchingclass, setfetchingclass] = useState(false);

    const [excel, setexcel] = useState(false);
    const [pdf, setpdf] = useState(false);


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


    const sendmail = () => {


        if(attdate == ""){
            return;
        }

        if(reopenattdate == ""){
            return;
        }

        if(email == ""){
            return;
        }

        const formdata = {
            email,
            fromdate: attdate,
            todate: reopenattdate,
            excel: excel ? 'excel' : '',
            pdf: pdf ? 'pdf' : ''
        }

        setissubmitting(true);

        disptach(setTranemail(email));

        axios.post(schoolzapi+'/generate-transaction-report',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
           
            setissubmitting(false);

            console.log(response.data.data);

          })
          .catch(function (error) {
            setissubmitting(false);
            console.log(error);
          });

        
        
    }

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen options={{
            headerTitle: 'Transaction Report'
        }}
        />
        <ScrollView>
            <Card>
                <Card.Content>

                {isloading ? null : (
                <>


    <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Text>From Date</Text>
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



<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
    <Text>To Date </Text>
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


<Text style={{marginTop: 25}}>Email Address</Text>
<TextInput
        //style={styles.Forminput}
        keyboardType="email-address"
        mode="outlined"
        onChangeText={(e) => setemail(e)}
        value={email} /> 


        <Checkbox.Item label='Excel Format' status={excel ? 'checked' : 'unchecked'} style={{marginTop: 20}} onPress={()=> setexcel(!excel)} />  

        <Checkbox.Item label='Pdf Format' status={pdf ? 'checked' : 'unchecked'} onPress={()=> setpdf(!pdf)} />    


                    {issubmitting ? <ActivityIndicator size="large"  style={{marginTop: 40}} /> : (
                        <Button onPress={sendmail} mode="contained" style={{marginTop: 40}}>Send Report</Button>
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

export default Sendtransactionbymail;

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
