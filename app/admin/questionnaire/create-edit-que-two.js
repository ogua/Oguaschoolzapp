import React, { Component, useCallback } from 'react'
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert, ActivityIndicator } from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, TextInput, Divider } from 'react-native-paper';
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
//import {produce} from "immer";
import { useImmer } from "use-immer";




function Createeditquestiontwo () {

    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setissubmitting] = useState(false);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);


    const [order, setorder] = useState("");
    const [title, settitle] = useState("");

   // const [question, setquestion] = useState([]);

    const [question, setquestion] = useImmer([]);



    const [creatoredit, isCreatedorEdit] = useState("");

    const {id,qid,term,stclass} = useSearchParams();


    useEffect(()=>{
        DeviceEventEmitter.removeAllListeners("event.test");

        //loaddata();
  
        if(id == undefined){
          isCreatedorEdit('Add Question');
          
        }else{
          loaddataedit();
          isCreatedorEdit('Question');
        }

  
      },[]);

      const loaddataedit = () => {
        setLoading(true);
        
        axios.get(schoolzapi+'/questionnaire-two-questions/show/'+id,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (results) {
            setLoading(false);
            //console.log("rr",results.data.data.qorder);
            setorder(""+results.data.data.qorder);
            settitle((results.data.data.title));

            loadquestions(results.data.data.questions);
            
        }).catch(function(error){
            setLoading(false);
            console.log(error);
            
        });
    }

    const loadquestions = (data) => {
            
      const mddatas = data;
      
      let mdata = [];
  
       mddatas.map(item =>  mdata.push(
          {id: "que_" + Math.random(),order: item?.order, question: item?.question, que_id: qid}
      ));


     // console.log("mddatas",mddatas);
      
      setquestion(mdata);
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
            title,
            queid: id,
            term,
            stclass,
            reportttitleid: qid
        }


        axios.post(schoolzapi+'/questionnaire-two-questions',
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

        if(title == ""){
            return;
        }
        
        setissubmitting(true);

        const formdata = {
          question,
          order,
          title,
          queid: id,
          term,
          stclass,
          reportttitleid: qid
        }

        console.log("formdata",formdata);

        axios.patch(schoolzapi+'/questionnaire-two-questions/'+id,
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


    const addmore = useCallback(()=>{

      // setquestion(
      //   produce((draft) => {
      //     draft.push(
      //       {id: "que_" + Math.random(),
      //       order: `0`,
      //       question: '',
      //       que_id: id
      //     });
      //   })
      // );
      

      setquestion(draft => {
        draft.push(
          {id: "que_" + Math.random(),
          order: `0`,
          question: '',
          que_id: id
        });
      });
    
    
    },[]);

    const remove = (index) => {
      const Items = question.filter(item => item.id !== index);
      setquestion(Items);
    }

    const updateorder = (index,newvalue) => {

      const newname = question.map((item,nindex) => {
        if(nindex === index){
          return {...item, order: newvalue};
        }
        return item;
      });
        
      setquestion(newname);

    }

    const updatequestion = (index,newvalue) => {

      const newname = question.map((item,nindex) => {
        if(nindex === index){
          return {...item, question: newvalue};
        }
        return item;
      });
        
      setquestion(newname);

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

                {isloading ? <ActivityIndicator size="large" /> : (
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
                    label="Title"
                    value={title}
                    onChangeText={(e) => settitle(e)}
                />

  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
    <Text style={{fontSize: 18}}>Add Questions</Text>
    <TouchableOpacity style={{flexDirection: 'row',marginTop: 20}} onPress={()=> addmore()}>
    <Ionicons name="add-circle" size={35} />
    </TouchableOpacity>
  </View>

  <View style={{marginTop: 10}}>

    {question.map((item,index) => (

        <View key={index}>

        <TextInput
          style={{marginVertical: 20}}
              mode="outlined"
              label="Order"
              value={item.order}
              keyboardType="numeric"
              onChangeText={(e) => updateorder(index,e)}
          />

          <TextInput
          style={{marginBottom: 20}}
          multiline
          numberOfLines={5}
          mode="outlined"
              label="Question ?"
              value={item.question}
              onChangeText={(e) => updatequestion(index,e)}
          />

         <Button onPress={() => remove(item.id)} textColor='red'>Remove</Button>

        <Divider bold={true} />

        </View>

    ))}

       

  </View>

  


                {issubmitting ? <ActivityIndicator size="large"  style={{marginTop: 40}} /> : (
                    <Button onPress={id == undefined ? createdata : updatedata} mode="contained" style={{marginTop: 40}}>Save</Button>
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

export default Createeditquestiontwo;

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
