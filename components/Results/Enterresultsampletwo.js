import React, { Component, useCallback, useRef } from 'react'
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, 
  View, DeviceEventEmitter, Alert, StatusBar, ActivityIndicator } from 'react-native'
  import { useEffect } from 'react';
  import {RadioButton, Switch, Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, Avatar, TextInput, Divider } from 'react-native-paper';
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

  
  function Enterresultsampletwo ({termid,stclass,resulttype,student}) {
    
    const token = useSelector(selecttoken);
    const role = useSelector(selectroles);
    const user = useSelector(selectuser);
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setissubmitting] = useState(false);
    const router = useRouter();

    const [opensubject, setOpensubject] = useState(false);
    const [subject, setsubject] = useState("");
    const [subjectitems, setsubjectItems] = useState([]);

    const [openstudentclass, setOpenstudentclass] = useState(false);
    const [studentclass, setstudentclass] = useState("");
    const [studentclassitems, setstudentclassItems] = useState([]);

    const [studentinfo, setstudentinfo] = useState({});
    const [data, setdata] = useState([]);
    const [quanswers, setquanswers] = useState("");
    const [queid, setqueid] = useState("");
    const [aterm, setaterm] = useState("");
    
    const examloop = [0,1,2,3,4,5,6,7,8,9];
    const [loadresults, setloadresults] = useState([]);
    const [loadquestion, setloadquestion] = useState([]);

    const [grothimp,setgrowthimp] = useState("");
    const [areaneeded,setareaneeded] = useState("");
    const [groupwrk,setgroupwrk] = useState("");
    const [conduct,setconduct] = useState("");

    const [count, setcount] = useState(0);



    useEffect(()=> {
     // setcheckstudent(student);
      loaddata();

    },[]);


   // console.log("student",check);

    function fetchresults() {

        return axios.get(schoolzapi+`/fetch-student-results-normal/${stclass}/${termid}/${student}/${resulttype}`,
        {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
        }
      });

     }

     function getsubjects() {

        return axios.get(schoolzapi+'/subject',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
    }

    function getstudentclass() {

        return axios.get(schoolzapi+'/student-classes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
    }
    
    
    const loaddata = () => {
    setLoading(true);
      
    axios.get(schoolzapi+`/fetch-student-results-sample-two/${stclass}/${termid}/${student}/${resulttype}`,
        {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
        }
      })
    .then(function (response) {

       

       console.log("ans",response.data.ans);
    
        if(response.data.error){

        showMessage({
            message: response.data.error,
            type: "warning",
            position: 'bottom',
        });

        setLoading(false);

    }else{

       // console.log("ansswer",response.data.ans?.answers);
         setdata(response.data.questions);
         loadstclass(response.data.studentclass);
         setstudentinfo(response.data.student);        
        
         if(response.data.ans == null){
            setquanswers("");
         }else{
            setquanswers(response.data.ans);
         }
         setqueid(response.data.queid);
         setaterm(response.data.aterm);

         loadexamresult(response.data.questions);
        

    }

    

   // setLoading(false);
      
      
    }).catch(function(error){
      setLoading(false);
      console.log(error);
    });
  }


  const loadstclass = (data) => {
            
    const mddatas = data;
    
    let mdata = [
        { label: 'No Promotion', value: ''}
    ];

     mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
    
     setstudentclassItems(mdata);

     //setLoading(false);
}


const loadexamresult = (data) => {
            
    const mddatas = data;

    let exam = [];

    mddatas.map((item,index) =>  exam.push({ id: "sub_"+Math.random(), title: item?.title ?? '', answer: '', questions: item?.questions}));
    setloadquestion(exam);
    setLoading(false);
}


function loadquestions(){
    
}


  const saveaddresults = () => {
    

    if(studentclass == null){
      alert("Promoted To cant be empty!");
      return;
    }

    setissubmitting(true);

    const formdata = {
      loadquestion,
      queid: queid,
      genconduct: conduct,
      studentid: studentinfo.id,
      promotedto:  studentclass,
      stclass: stclass,
      term: aterm?.semester,
      sample: resulttype
    }

      
    axios.post(schoolzapi+`/save-results-sample-one`,
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


  const answerquetionnaire = useCallback((index,value) => {
    setloadquestion(
      produce((draft) => {
        const question = draft.find((question) => question.id === index);
        question.answer  = value;
        console.log("draft",draft);
      })
    );
}, []);

const updateanswer = (index,newvalue) => {
  console.log("new value",newvalue);
  const newname = data.map((item,nindex) => {
    if(nindex === index){
      return {...item, answer: newvalue};
    }
    return item;
  });
    
  setData(newname);
}


function updatecount(){

  let mycount = 0;
  
  console.log("count");
   
}



return (
        <>
        {isloading ? <ActivityIndicator size="large" /> : (
            <View style={styles.container}>
                <Text style={{backgroundColor: '#1782b6', color: '#fff', padding: 15, width: '100%'}}>Enter Results For : { studentinfo?.fullname}</Text>
                <ScrollView>
                    <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

                        <Avatar.Image 
                            source={{uri: studentinfo?.pic}}
                            size={50}
                        />

                        <Text>{ studentinfo?.stclass}</Text>

                    </View>

                        {loadquestion.map((item,index) => {
                          let newcount = 0;
                          
                          return (
                            <>
                            <View style={{flexDirection: 'column', justifyContent: 'space-between',marginTop: 20, backgroundColor: '#1782b6', padding: 10}}>
                                 <View style={{flex: 1}}>
                                     <Text style={{color: '#fff',fontSize: 18}}>{item.title.toUpperCase()}</Text>
                                 </View>
                                 <View>
                                 </View>
                            </View>
                            <>
                            
                            {/* {loadsubquestionaire(item.questions)} */}
     
                            {item.questions.map((qitem,qindex) => {
                            
                           // newcount = newcount + 1;

                            console.log("newcount",qitem.question);
                            
                             return (
                               <>
                               <View style={{flexDirection: 'column', justifyContent: 'space-between',padding: 10, border: '#000', borderWidth: 0.5}}>
                                   <View style={{flex: 1}}>
                                       <Text style={{fontSize: 15}}>{qitem.question.toUpperCase()}</Text>
                                   </View>
                                   <View style={{marginTop: 10}}>
     
                                   <RadioButton.Group onValueChange={newValue => updateanswer(qindex,newValue)} value={quanswers !=="" ? quanswers?.answers.split("|")[newcount++] : ''}>
                                         <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
     
                                         
                                             <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                 <RadioButton value="ALWAYS" />
                                                 <Text>ALWAYS</Text>
                                             </View>
     
                                             <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                 <RadioButton value="SOMETMES" />
                                                 <Text>SOMETMES</Text>
                                                 
                                             </View>
     
                                             <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                 <RadioButton value="NOTYET" />
                                                 <Text>NOT YET</Text>
                                             </View>
     
                                         </View>
     
                                       </RadioButton.Group>
     
                                   </View>
                                   
                             </View>
                               </>
                           )
     
                           
                            })}
                            
                            
                            </>
                            </>
                           
                         )
                        })}

                             

                           <Text style={styles.field}>GENERAL REMARKS AND CONDUCT:</Text>
                            <TextInput
                                multiline={true}
                                numberOfLines={4}
                                mode='outlined'
                                value={conduct}
                                onChangeText={(e) => setconduct(e)}
                                />

                              <DropDownPicker
                                searchable
                                open={openstudentclass}
                                value={studentclass}
                                items={studentclassitems}
                                setOpen={setOpenstudentclass}
                                setValue={setstudentclass}
                                setItems={setstudentclassItems}
                                placeholder={"Promoted To"}
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
                                    minHeight: 50,
                                    marginTop: 20,
                                }}
                                />




                          {issubmitting ? <ActivityIndicator style={{marginTop: 20}} size="large" /> : (
                              <Button style={{marginTop: 20}} onPress={saveaddresults}>Save</Button>
                          )}
                            
                    
                </ScrollView>
            </View>

        )}
        

        </>      
      )
}
    
    export default Enterresultsampletwo;
    
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