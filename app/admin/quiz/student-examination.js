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
  import { useDispatch, useSelector } from 'react-redux';
  import * as Imagepicker from 'expo-image-picker';
  import { showMessage } from "react-native-flash-message";
  import { selecttoken } from '../../../features/userinfoSlice';
  import { schoolzapi } from '../../../components/constants';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  import DropDownPicker from 'react-native-dropdown-picker';
  //import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
  //import {produce} from "immer";
  import { useImmer } from "use-immer";
  import { selectexam, setExam } from '../../../features/examSlice'; 
import Examquestions from '../../../components/Exams/Examquestions';
import Studentexamslist from '../../../lists/Studentexamslist';

  
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

    const dispatch = useDispatch();
    const exams = useSelector(selectexam);

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

       if ((seconds <= 0) && (minutes <= 0) && (hours <= 0)) {
        savequestion();
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
      
      setexamtittle(results.data.examtitle);

      setduration(results.data.examtitle.minutes);
      setexamtitleid(results.data.examtitle.id);

      //console.log(results.data.examtitle.minutes);
      loadqestions(results.data.data);

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

   // dispatch(setExam(mdata));
    
    setData(mdata);
}
  
    
const children = ({ remainingTime }) => {
    const hours = Math.floor(remainingTime / 3600)
    const minutes = Math.floor((remainingTime % 3600) / 60)
    const seconds = remainingTime % 60
  
    return <Text>{`${hours}:${minutes}:${seconds}`}</Text>
}


function savequestion(){

  setLoading(true);
  
  const formdata = {
      examid: id,
      data,
      examtitleid
  }
  
    axios.post(schoolzapi+'/save-exams',
    formdata,
    {
      headers: {Accept: 'application/json',
      Authorization: "Bearer "+token
    }
  })
  .then(function (response) {
    
    setLoading(true);

    showMessage({
      message: 'Saved Successfully!',
      type: "success",
      position: 'bottom',
    });


    if(response.data.data == 'Yes'){
      //setretry(true);
      dispatch(setExam(data));
      router.push("/admin/quiz/Student-exam-results");
    }else{
      router.back();
    }

    //router.back();
    
  })
  .catch(function (error) {
    setLoading(false);
    console.log(error);
  });


}


const savequestions = () => {

  //clearInterval();
  
  setisubmitting(true);
  
  const formdata = {
      examid: id,
      data,
      examtitleid
    }

    
    axios.post(schoolzapi+'/save-exams',
    formdata,
    {
      headers: {Accept: 'application/json',
      Authorization: "Bearer "+token
    }
  })
  .then(function (response) {
    
    setisubmitting(true);

    showMessage({
      message: 'Saved Successfully!',
      type: "success",
      position: 'bottom',
    });


    if(response.data.data == 'Yes'){
      //setretry(true);
      dispatch(setExam(data));
      router.push("/admin/quiz/Student-exam-results");
    }else{
      router.back();
    }

    //router.back();
    
  })
  .catch(function (error) {
    setLoading(false);
    console.log(error);
  });

}

const aanswerinoput = useCallback((index,newvalue) => {

  console.log("working",newname);

  const newname = data.map((item,nindex) => {
    if(nindex === index){
      
      return {...item, useranser: newvalue, response: item.answer == newvalue ? `Correct` : `Wrong`};
    }
    return item;
  });

  setData(newname);

},[]);

const answerinoput = (index,newvalue) => {

    const newname = data.map((item,nindex) => {
      if(nindex === index){
        
        return {...item, useranser: newvalue, response: item.answer == newvalue ? `Correct` : `Wrong`};
      }
      return item;
    });

    setData(newname);

}

console.log("rending...");


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
    {/* <Text style={{fontWeight: 600}}>Total Questions: {exams !== null ? exams.length : 0}</Text> */}
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
  > 
  <Card>
  <Card.Content>

    {isloading ? <ActivityIndicator size="large" /> : (
      <>
                <FlatList
                    data={data}
                    renderItem={({item,index})=> <Studentexamslist index={index} answerinoput={answerinoput} item={item} retry={retry}  /> }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                         marginBottom: 10
                    }}
                    keyExtractor={item => item.id}
                />

  
    {/* {exams !== null && (
        <>
        {exams.map((item,index) => (
        <>    
        <Examquestions key={index} item={item} index={index} retry={retry}/>
        
        </>
        ))}
      </>
    )} */}
          {retry ? (
            <Button icon="refresh" onPress={() => {
              setretry(false);
              loaddata();
            }} mode="contained" style={{marginVertical: 40}}>Retry Again</Button>
          ) : (
            <>
            {isubmitting ? <ActivityIndicator size="large" style={{marginVertical: 40}} /> : (
            <Button onPress={savequestions} mode="contained" style={{marginVertical: 40}}>Submit</Button>
            )}
            </>
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
    
    export default React.memo(Studentexamination);
    
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