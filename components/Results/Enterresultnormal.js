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
 // import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { selectroles, selecttoken, selectuser } from '../../features/userinfoSlice';
import { schoolzapi } from '../constants';
import {produce} from "immer";
import Resultenter from './Resultenter';

  
  function Enterresultnormal ({termid,stclass,resulttype,student}) {
    
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
      
    axios.get(schoolzapi+`/fetch-student-results-normal/${stclass}/${termid}/${student}/${resulttype}`,
        {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
        }
      })
    .then(function (response) {

      // console.log("results",results.data.result);
    
        if(response.data.error){

        showMessage({
            message: response.data.error,
            type: "warning",
            position: 'bottom',
        });

    }else{

        loadsubject(response.data.subjects);
        loadstclass(response.data.studentclass);
        setstudentinfo(response.data.student);
       // setresult(response.data.result.results);
        
        setquanswers(response.data.quanswers);
        setclassscore(response.data.classscore);
        setexamscore(response.data.examscore);

        setstudentclass(response.data.quanswers?.promotedto);
        setgrowthimp(response.data.quanswers?.growthnimprove);
        setareaneeded(response.data.quanswers?.areasneedwork);
        setgroupwrk(response.data.quanswers?.groupwork);
        setconduct(response.data.quanswers?.genremarknconduct);


        if(response.data.result?.results == null){
          loadexamresult([])
        }else{
          loadexamresult(response.data.result.results);
        }
      

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

const loadsubject = (data) => {
            
    const mddatas = data;
    
    let mdata = [];

     mddatas.map(item =>  mdata.push({ label: item?.name, value: parseInt(item?.id)}))
    
     setsubjectItems(mdata);

    // setLoading(false);
}

const loadexamresult = (data) => {
            
    const mddatas = data;

    let exam = [];
    
    examloop.map(item =>  exam.push({ examid: mddatas[item]?.id ?? 0, id: "sub_"+Math.random(), subject: mddatas[item]?.subject ?? '', classscore: mddatas[item]?.classtestscore ?? 0, examscore: mddatas[item]?.examscore ?? 0}));

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
                <Text style={{backgroundColor: '#1782b6', color: '#fff', padding: 15, width: '100%'}}>Enter Results For : { studentinfo?.fullname}</Text>
                <ScrollView style={styles.dataWrapper}>
                    <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

                        <Avatar.Image 
                            source={{uri: studentinfo?.pic}}
                            size={50}
                        />

                        <Text>{ studentinfo?.stclass}</Text>

                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20}}>
                        <TouchableOpacity style={{flexDirection: 'row',marginTop: 20}}>
                        <Ionicons name="add-circle" size={35} />
                        </TouchableOpacity>
                    </View>                    

                    {examloop.map((item,index) => (
                        <Resultenter key={index} schclassscore={classscore} schexamscore={examscore} stclass={stclass} termid={termid} examid={parseInt(loadresults[item]?.examid)} studentid={studentinfo?.id} stindex={studentinfo?.student_id} resubjectitems={subjectitems} resubject={parseInt(loadresults[item]?.subject)} id={loadresults[item]?.id} index={index}  classscore={loadresults[item]?.classscore} examscore={loadresults[item]?.examscore} />
                    ))}

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
                                    marginTop: 40,
                                }}
                                />

                            <TextInput
                                style={styles.field}
                                multiline={true}
                                numberOfLines={4}
                                label="Growth & Improvement Observed"
                                mode='outlined'
                                value={grothimp}
                                onChangeText={(e) => setgrowthimp(e)}
                                />

                            <TextInput
                                style={styles.field}
                                multiline={true}
                                numberOfLines={4}
                                label="Areas Needing Additional Work"
                                mode='outlined'
                                value={areaneeded}
                                onChangeText={(e) => setareaneeded(e)}
                                />

                            <TextInput
                                style={styles.field}
                                multiline={true}
                                numberOfLines={4}
                                label="Group Work"
                                mode='outlined'
                                value={groupwrk}
                                onChangeText={(e) => setgroupwrk(e)}
                                />


                            <TextInput
                                style={styles.field}
                                multiline={true}
                                numberOfLines={4}
                                label="Conduct"
                                mode='outlined'
                                value={conduct}
                                onChangeText={(e) => setconduct(e)}
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
    
    export default Enterresultnormal;
    
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