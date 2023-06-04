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

  
  function Resultenter ({schexamscore,schclassscore,stindex,stclass,termid,resubjectitems,resubject,id,examid,index,classscore,examscore,studentid}) {
    
    const token = useSelector(selecttoken);
    const role = useSelector(selectroles);
    const user = useSelector(selectuser);
    const [submitting, setsubmitting] = useState(false);
    const router = useRouter();

    const [opensubject, setOpensubject] = useState(false);
    const [subject, setsubject] = useState(resubject);
    const [subjectitems, setsubjectItems] = useState(resubjectitems);

    const [classsmycore, setclassscore] = useState(classscore);
    const [myexamscore, setmyexamscore] = useState(examscore);

    const [saved, setsaved] = useState(false);
    const [deleted, setdeleted] = useState(false);

    const [issaving, setissaving] = useState(false);
    const [isdeleting, setisdeleting] = useState(false);



    //console.log("examid",examid);

    const populateresults = () => {

        setsubmitting(true);
        setsaved(false);
        setdeleted(false);

        const formdata = {
            id: studentid,
            term: termid,
            value: subject,
            stclsdd: stclass,
        }
          
        axios.post(schoolzapi+`/get-student-results`,
        formdata,
            {
              headers: {Accept: 'application/json',
              Authorization: "Bearer "+token
            }
          })
        .then(function (results) {
                  
         setsubmitting(false);
         setclassscore(results.data.classtest);
         setmyexamscore(results.data.examscore);
         console.log(results.data);

        }).catch(function(error){
          setsubmitting(false);
          console.log(error);
        });
    }

    const saveresults = () => {

      setissaving(true);
      setsaved(false);

      const formdata = {
          cid: studentid,
          exams: myexamscore,
          ctest: classsmycore,
          stdindex: stindex,
          term: termid,
          subject: subject,
          stclsdd: stclass
      }
        
      axios.post(schoolzapi+`/save-student-results`,
      formdata,
          {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
          }
        })
      .then(function (results) {
                
        setissaving(false);

       if(results.data.error){

          showMessage({
            message: results.data.error,
            type: "warning",
            position: 'bottom',
        });

        setsaved(false);

       }else{

        showMessage({
          message: results.data.success,
          type: "success",
          position: 'bottom',
         });

         setsaved(true);

       }

      }).catch(function(error){
        setissaving(false);
        setsaved(false);
        console.log(error);
      });
  }


  const deletedata = (id,delname) => {

    return Alert.alert(
        "Are your sure?",
        "You want to delete this record from results",
        [
          {
            text: "No",
          },
          {
            text: "Yes Delete",
            onPress: () => {
              setisdeleting(true);
              setdeleted(false);
                const formdata = {
                  resultid: id
                }
                axios.post(schoolzapi+'/delete-student-result',
                formdata,
                {
                    headers: {Accept: 'application/json',
                    Authorization: "Bearer "+token
                }
                })
                    .then(function (response) {
                        setisdeleting(false);
                        setdeleted(true);

                        showMessage({
                          message: 'Deleted Successfully!',
                          type: "success",
                          position: 'bottom',
                      });
                    })
                    .catch(function (error) {
                      setisdeleting(false);
                      setdeleted(false);
                     console.log(error);
                    });
            },
          },
        ]
      );

}


return (
        <>
        {submitting ? <ActivityIndicator size="large" style={{border: '#000', borderWidth: 0.5, padding: 10, marginTop: 20}} /> : (

                               <View style={{border: deleted ? `red` : `#000`, borderWidth: 0.5, padding: 10, marginTop: 20}}>
                                    <Text>Enter Result {index + 1}</Text>
                                        <DropDownPicker
                                            searchable
                                            open={opensubject}
                                            value={parseInt(subject)}
                                            items={subjectitems}
                                            setOpen={setOpensubject}
                                            setValue={setsubject}                                           
                                            setItems={setsubjectItems}
                                            onChangeValue={populateresults}
                                           placeholder={"Choose Subject"}
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
                                                marginTop: 10,
                                            }}
                                            />
                                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly',marginTop: 10}}>
                                    <View style={{flex: 1}}>
                                            <TextInput
                                                mode='outlined'
                                                keyboardType="numeric"
                                                label={`C.S (`+schclassscore+`%)`}
                                                value={classsmycore}
                                                onChangeText={(e) => setclassscore(e)}
                                                />
                                    </View>
                                        
                                    <View style={{flex: 1, marginLeft: 20}}>
                                            <TextInput
                                            label={`E.S `+schexamscore+`%)`}
                                            keyboardType="numeric"
                                            mode='outlined'
                                            value={myexamscore}
                                            onChangeText={(e) => setmyexamscore(e)}
                                            /> 
                                        </View> 
                                    </View>

                                    <Divider bold={true} style={{marginVertical: 20}} />

                                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                    
                                    {deleted ? (
                                      <Button textColor='red'>Deleted</Button>
                                    ) : (
                                      <>

                                    <View style={{flex: 1}}>
                                            {issaving ? <ActivityIndicator size="small" /> : (
                                              <Button icon={saved ? `check` : `mail`} onPress={saveresults}>{saved ? `Saved` : `Save`}</Button>
                                            )}
                                            
                                    </View>

                                     {examid > 0 && (
                                      <View style={{flex: 1, marginLeft: 20}}>
                                           {isdeleting ? <ActivityIndicator size="small" /> : (
                                            <Button textColor='red' icon="delete-forever-outline" onPress={()=> deletedata(examid,subject)}>Delete</Button>
                                          )}
                                      </View>
                                    )}
                                      
                                      </>
                                    )}        

                                    


                                    </View>
                                    
                                        
                                
                            </View>
                             )}
        

        </>      
      )
}
    
    export default Resultenter;
    
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