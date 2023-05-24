import React, { Component, useCallback, useRef } from 'react'
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, 
  View, DeviceEventEmitter, Alert, StatusBar, ActivityIndicator } from 'react-native'
  import { useEffect } from 'react';
  import {RadioButton, Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, Avatar, TextInput, Divider } from 'react-native-paper';
  import { useState } from 'react';
  import axios from 'axios';
  import Ionicons from '@expo/vector-icons/Ionicons';
  import { useSelector } from 'react-redux';
  import * as Imagepicker from 'expo-image-picker';
  import { showMessage } from "react-native-flash-message";
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  import DropDownPicker from 'react-native-dropdown-picker';
  import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { selectroles, selecttoken, selectuser } from '../../features/userinfoSlice';
import { schoolzapi } from '../constants';
import {produce} from "immer";
import Resultenter from './Resultenter';

  
  function Reportpersubject ({termid,stclass,subject}) {
    
    const token = useSelector(selecttoken);
    const role = useSelector(selectroles);
    const user = useSelector(selectuser);
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setissubmitting] = useState(false);
    const router = useRouter();

    const [openstudentclass, setOpenstudentclass] = useState(false);
    const [studentclass, setstudentclass] = useState("");
    const [studentclassitems, setstudentclassItems] = useState([]);

    const [studentinfo, setstudentinfo] = useState({});
    const [result, setresult] = useState([]);
    const [quanswers, setquanswers] = useState({});
    const [classscore, setclassscore] = useState("");
    const [examscore, setexamscore] = useState("");
    
    const examloop = [0,1,2,3,4,5,6,7,8,9];
    const [loadresults, setloadresults] = useState([]);

    const [grothimp,setgrowthimp] = useState("");
    const [areaneeded,setareaneeded] = useState("");
    const [groupwrk,setgroupwrk] = useState("");
    const [conduct,setconduct] = useState("");


    const [data, setdata] = useState([]);



    useEffect(()=> {
     // setcheckstudent(student);
      loaddata();

    },[]);

    
    
    const loaddata = () => {
    setLoading(true);
      
    axios.get(schoolzapi+`/results-per-subject/${stclass}/${termid}/${subject}`,
        {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
        }
      })
    .then(function (response) {

       console.log("response",response.data.result);
    
        if(response.data.error){

        showMessage({
            message: response.data.error,
            type: "warning",
            position: 'bottom',
        });

    }else{

        setclassscore(response.data.classscore);
        setexamscore(response.data.examscore);

        // if(response.data.result?.results == null){
        //   loadexamresult([])
        // }else{
        //   loadexamresult(response.data.result);
        // }

        setdata(response.data.result);
      
        setLoading(false);
    }

    

   // setLoading(false);
      
      
    }).catch(function(error){
      setLoading(false);
      console.log(error);
    });
  }



const loadexamresult = (data) => {
            
    const mddatas = data;

    let exam = [];
    
    examloop.map(item =>  exam.push({ fullnams: item?.surname, subject: 'subject', classscore:  0, examscore:  0}));

    setloadresults(exam);
    setLoading(false);
}

const changesubject = useCallback((indexx,value) => {
    setloadresults(
      produce((draft) => {
        const subjects = draft.find((subject) => subject.id == ""+indexx);
       // subjects.subject = value;
        console.log("subjects",subjects);
        console.log("indexx",indexx);

      })
    );
  }, []);


  const saveaddresults = () => {

    

    if(studentclass == null){
      alert("Promoted To cant be empty!");
      return;
    }

    setissubmitting(true);

    const formdata = {
      id: studentinfo?.id,
      attendance: quanswers?.attendance,
      outof: quanswers?.outof,
      promotedto: studentclass,
      growthnimprove: grothimp,
      areaneedingaddwork: areaneeded,
      grpwork: groupwrk,
      conduct: conduct,
      studentid: studentinfo?.student_id,
      studentclass: stclass,
      term: termid
    }

      
    axios.post(schoolzapi+`/student-result-add-info-save`,
    formdata,
        {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
        }
      })
    .then(function (results) {

      setissubmitting(false);

    
        if(results.data.error){

        showMessage({
            message: results.data.error,
            type: "warning",
            position: 'bottom',
        });

    }else{

      showMessage({
        message: 'Recorded Successfully!',
        type: "success",
        position: 'bottom',
      });
        

    }
      
      
    }).catch(function(error){
      setissubmitting(false);
      console.log(error);
    });

  }




return (
        <>
        {isloading ? <ActivityIndicator size="large" /> : (

            <View style={styles.container}>
                <Text style={{backgroundColor: '#1782b6', color: '#fff', padding: 15, width: '100%'}}>Students Results</Text>
                <ScrollView style={styles.dataWrapper}>
                      

                    {data.map((item,index) => (
                        <>

<View style={{ borderWidth: 0.5, padding: 10, marginTop: 20}}>
   
   <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginBottom: 15}}>
        <Avatar.Image 
            source={{uri: item?.pic}}
            size={50}
        />

    <Text>{item.fullname.toUpperCase()}</Text> 
   </View>

   <TextInput
    mode='outlined'
    keyboardType="numeric"
    label="Subject"
    value={item.result.subject}
/>


<View style={{flexDirection: 'row', justifyContent: 'space-evenly',marginTop: 10}}>
<View style={{flex: 1}}>
<TextInput
mode='outlined'
keyboardType="numeric"
label={`C.S (`+classscore+`%)`}
disabled
value={item.result.classtestscore}
/>
</View>

<View style={{flex: 1, marginLeft: 20}}>
<TextInput
label={`E.S `+examscore+`%)`}
keyboardType="numeric"
mode='outlined'
disabled
value={item.result.examscore}
/> 
</View> 
</View>

<Divider bold={true} style={{marginVertical: 20}} />

<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginBottom: 15}}>
<Text>Total: {item.result.total}%</Text>
<Text>Grade: {item.result.grade}</Text>
  </View>

 <Text>Remarks: {item.result.remarks}</Text>

</View>
                                   
                        
                        </>
                       
                    ))}
                            
                    
                </ScrollView>
            </View>

        )}
        

        </>      
      )
}
    
    export default Reportpersubject;
    
    const styles = StyleSheet.create({
      separator: {
        height: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
      },
      field: {
        marginTop: 15
      },
      container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
      dataWrapper: { marginTop: -1 },
    });