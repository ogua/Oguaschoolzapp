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
  import { selecttoken } from '../../../features/userinfoSlice';
  import { schoolzapi } from '../../../components/constants';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  import DropDownPicker from 'react-native-dropdown-picker';
  import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
  import {produce} from "immer";

  
  function Studentexamination () {
    
    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [isubmitting, setisubmitting] = useState(false);
    const [data, setData] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const {id} = useSearchParams();
    const scrollViewRef = useRef();
    const questions = [];
    const [examtittle, setexamtittle] = useState({});
    const [duration, setduration] = useState("");
    const [retry, setretry] = useState(false);
    const [answerindex, setanswerindex] = useState("");

    const [openanswer, setOpenanswer] = useState(false);
    const [answer, setanswer] = useState("");
    const [answeritems, setanswerItems] = useState([
        { label: 'Option A', value: 'a'},
        { label: 'Option B', value: 'b'},
        { label: 'Option C', value: 'c'},
        { label: 'Option D', value: 'd'},
    ]);

    const [value, setValue] = useState("");

    const [examtitleid, setexamtitleid] = useState("");

    // useEffect(()=> {

    //   setTimeout(() => {
    //     setanswerindex(`99999`);
    //   }, 1000);
  
    // },[answerindex]);
    
   
    useEffect(()=> {

      loaddata();

      var interval = setInterval(() => {
        get_elapsed_time_string();
      }, 1000);

      return () => {
        clearInterval(interval);
      };

    },[]);

    function get_elapsed_time_string() {

      // sethour(lastTimerCount => {
      //   return lastTimerCount - 1
      // })

      setduration(lastduration => {

       let timer111 = lastduration.split(':');

       let hours = parseInt(timer111[0], 10);
       let minutes = parseInt(timer111[1], 10);
       let seconds = parseInt(timer111[2], 10);
       --seconds;
       minutes = (seconds < 0) ? --minutes : minutes;
       seconds = (seconds < 0) ? 59 : seconds;
       hours = (minutes < 0) ? --hours : hours;
       minutes = (minutes < 0) ? 59 : minutes;

       hours = pretty_time_string(hours);
       minutes = pretty_time_string(minutes);
       seconds = pretty_time_string(seconds);

       if (hours < 0){
        clearInterval(interval);
       }

       if ((seconds <= 0) && (minutes <= 0) && (hours <= 0)) {
         savequestions();
       }

      // duration = hours + ":" + minutes + ":" + seconds;
       let currentTimeString = hours + ":" + minutes + ":" + seconds;
       return currentTimeString;

      })


      
  }

  function pretty_time_string(num) {
    return (num < 10 ? "0" : "") + num;
  }

    
    
    const loaddata = () => {
      setretry(false);
      setLoading(true);
      
      axios.get(schoolzapi+'/exam-questions/'+id,
      {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
      }
    })
    .then(function (results) {
      
     // console.log(results.data.data);
      loadqestions(results.data.data);
      setexamtittle(results.data.examtitle);

      setduration(results.data.examtitle.minutes);
      setexamtitleid(results.data.examtitle.id);

      //console.log(results.data.examtitle.minutes);

      setLoading(false);
      
      
    }).catch(function(error){
      setLoading(false);
      console.log(error);
    });
  }

  const loadqestions = (data) => {
            
    const mddatas = data;
    
    let mdata = [];

     mddatas.map(item =>  mdata.push(
        {id: "que_" + Math.random(),exam_id: item?.exam_id, question: item?.question, optiona: item?.optiona, optionb: item?.optionb, optionc: item?.optionc, optiond: item?.optiond, answer: item?.answer, useranser: '', response: 'Wrong'}
    ))
    
     setData(mdata);
}
  
    
const children = ({ remainingTime }) => {
    const hours = Math.floor(remainingTime / 3600)
    const minutes = Math.floor((remainingTime % 3600) / 60)
    const seconds = remainingTime % 60
  
    return <Text>{`${hours}:${minutes}:${seconds}`}</Text>
}


const savequestions = () => {
  
    const formdata = {
      examid: id,
      data,
      examtitleid
    }


    setLoading(true);
    
    axios.post(schoolzapi+'/save-exams',
    formdata,
    {
      headers: {Accept: 'application/json',
      Authorization: "Bearer "+token
    }
  })
  .then(function (response) {

    //clearInterval(interval);
    
    setLoading(false);

    if(response.data.data == 'Yes'){
      setretry(true);
    }

    showMessage({
      message: 'Saved Successfully!',
      type: "success",
      position: 'bottom',
    });

    //router.back();
    
  })
  .catch(function (error) {
    setLoading(false);
    console.log(error);
  });

}

const aanswerinoput = useCallback((index,newvalue) => {

  const newname = data.map((item,nindex) => {
    if(nindex === index){
      
      return {...item, useranser: newvalue, response: item.answer == newvalue ? `Correct` : `Wrong`};
    }
    return item;
  });

  setData(newname);

},[]);

const answerinoput = (index,newvalue) => {
   // setanswerindex(`${index}`);
    const newname = data.map((item,nindex) => {
      if(nindex === index){
        
        return {...item, useranser: newvalue, response: item.answer == newvalue ? `Correct` : `Wrong`};
      }
      return item;
    });

    setData(newname);
}




return (
  
  <Provider>
  <SafeAreaView>
  <Stack.Screen
  options={{
    headerShown: false
  }}
  />
  
  <StatusBar hidden={true} />

  <View style={{marginHorizontal:20}}>

  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop: 20}}>
    <TouchableOpacity onPress={()=> router.back()}>
       <Ionicons name="close-circle" size={30} />
    </TouchableOpacity>
    <>
    <Text style={{fontWeight: 600}}>Total Questions: {data !== null ? data.length : 0}</Text>
    <Text style={{fontWeight: 600}}>Timer: {duration}</Text>
    </>
    
  
  </View>

   </View>

   

   {/* <View style={{flexDirection: 'row', justifyContent: 'center'}}>
   <CountdownCircleTimer
    isPlaying
    duration={200}
    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
    colorsTime={[7, 5, 2, 0]}
    onComplete={() => {
        console.log("Finished");
    }}
    children={children}
  >

  </CountdownCircleTimer>
   </View> */}


  <KeyboardAwareScrollView>   
  <ScrollView
  ref={scrollViewRef}
  onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
  style={{marginBottom: 250}}
  refreshControl={
    <RefreshControl refreshing={isloading} onRefresh={loaddata} />
  }
  > 
  <Card>
  <Card.Content>
  
    {data !== null && (
        <>
        {data.map((item,index) => (
        <>    
        <View style={{marginBottom: 30, backgroundColor: retry ? (item.response == 'Correct' ? '#17a2b8' : 'red') : '#ccc', padding: 10}} key={item?.id}>
            
            <Text style={{fontSize: 18, marginBottom: 15, color: retry ? '#fff' : '#000'}}>{index+1}:: {item.question}</Text>
              <RadioButton.Group onValueChange={newValue => answerinoput(index,newValue)} value={item?.useranser}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{marginRight: 20, color: retry ? '#fff' : '#000'}}>A</Text>
                  <RadioButton value="a" />
                  <Text style={{color: retry ? '#fff' : '#000'}}>{item.optiona}</Text>
                  
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{marginRight: 20,color: retry ? '#fff' : '#000'}}>B</Text>
                  <RadioButton value="b" />
                  <Text style={{color: retry ? '#fff' : '#000'}}>{item.optionb}</Text>
                  
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{marginRight: 20,color: retry ? '#fff' : '#000'}}>C</Text>
                  <RadioButton value="c" />
                  <Text style={{color: retry ? '#fff' : '#000'}}>{item.optionc}</Text>
                  
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{marginRight: 20,color: retry ? '#fff' : '#000'}}>D</Text>
                  <RadioButton value="d" />
                  <Text style={{color: retry ? '#fff' : '#000'}}>{item.optiond}</Text>
                  
              </View>

              </RadioButton.Group>

             {retry && (
              <>
              <Text style={{marginTop: 20, color: '#fff'}}>Answer:: {item.answer.toUpperCase()}</Text>
              </>
              
             )}   
        </View>
        
        </>
    ))}
    </>
)}
          {retry ? (
            <Button icon="refresh" onPress={() => {
              setretry(false);
              loaddata();
            }} mode="contained" style={{marginVertical: 40}}>Retry Again</Button>
          ) : (
            <>
            {isubmitting ? <ActivityIndicator size="large" /> : (
            <Button onPress={savequestions} mode="contained" style={{marginVertical: 40}}>Submit</Button>
            )}
            </>
          )}
            
      </Card.Content>
      </Card> 
      
      </ScrollView>
      </KeyboardAwareScrollView>
      </SafeAreaView>
      </Provider>
      
      )
    }
    
    export default Studentexamination;
    
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