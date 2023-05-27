import React, { Component } from 'react'
import { Stack, useRouter, useSearchParams } from 'expo-router';
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
import { LocaleConfig, Calendar } from "react-native-calendars";
import DropDownPicker from 'react-native-dropdown-picker';
import { selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';
import { showMessage } from "react-native-flash-message";




function Createeditquestiontinyonr () {

    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setissubmitting] = useState(false);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);


    const [order, setorder] = useState("");
    const [question, setquestion] = useState("");

    const [creatoredit, isCreatedorEdit] = useState("");

    const {id,qid} = useSearchParams();


    useEffect(()=>{
        DeviceEventEmitter.removeAllListeners("event.test");
  
        if(id == undefined){
          isCreatedorEdit('Add Question');
          
        }else{
          loaddataedit();
          isCreatedorEdit('Edit Question');
        }
  
      },[]);

      const loaddataedit = () => {
        setLoading(true);
        
        axios.get(schoolzapi+'/questionnaire-one-tinytowers/show/'+id,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (results) {
            setLoading(false);
            setorder((results.data.data.order));
            setquestion((results.data.data.question));
            
        }).catch(function(error){
            setLoading(false);
            console.log(error);
            
        });
    }


    const createdata = () => {

        if(order == ""){
            return;
        }

        if(question == ""){
            return;
        }
        
        setissubmitting(true);

        const formdata = {
            question,
            order,
            queid: qid
        }


        axios.post(schoolzapi+'/questionnaire-one-tinytowers',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
           
            setissubmitting(false);

            showMessage({
                message: 'Info recorded Successfully!',
                type: "success",
                position: 'bottom',
              });

            DeviceEventEmitter.emit('subject.added', {});
            router.back();

          })
          .catch(function (error) {
            setissubmitting(false);
            console.log(error);
          });
    }


    const updatedata = () => {

        if(order == ""){
            return;
        }

        if(question == ""){
            return;
        }
        
        setissubmitting(true);

        const formdata = {
            question,
            order
        }

        axios.patch(schoolzapi+'/questionnaire-one-tinytowers/'+id,
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
           
            setissubmitting(false);

            showMessage({
                message: 'Info updated Successfully!',
                type: "success",
                position: 'bottom',
              });

            DeviceEventEmitter.emit('subject.added', {});
            router.back();

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
            headerTitle: creatoredit
        }}
        />
        <ScrollView>
            <Card>
                <Card.Content>

                {isloading ? null : (
                <>


                <TextInput
                 style={{marginBottom: 20}}
                 mode="outlined"
                    label="Order"
                    value={order}
                    keyboardType="numeric"
                    onChangeText={(e) => setorder(e)}
                />

             <TextInput
              style={{marginBottom: 20}}
              mode="outlined"
                    label="Question"
                    multiline={true}
                    numberOfLines={10}
                    value={question}
                    onChangeText={(e) => setquestion(e)}
                />


                {issubmitting ? <ActivityIndicator size="large"  style={{marginTop: 20}} /> : (
                    <Button onPress={id == undefined ? createdata : updatedata} mode="contained" style={{marginTop: 20}}>Save</Button>
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

export default Createeditquestiontinyonr;

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
