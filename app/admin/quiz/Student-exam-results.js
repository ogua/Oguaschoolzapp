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
  import {produce} from "immer";
  import { selectexam, setExam } from '../../../features/examSlice'; 
import Examquestions from '../../../components/Exams/Examquestions';
import Studentexamslist from '../../../lists/Studentexamslist';

  
  function Studentexamresults () {
    
    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(false);
    const [isubmitting, setisubmitting] = useState(false);
    const [data, setData] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const {id} = useSearchParams();
    const scrollViewRef = useRef();
    const questions = [];
    const [examtittle, setexamtittle] = useState({});
    const [duration, setduration] = useState("");
    const [retry, setretry] = useState(true);
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


    useEffect(()=> {
  
        var interval = setInterval(() => {
          get_elapsed_time_string();
        }, 1000);
  
        clearInterval(interval);
  
      },[]);



const savequestions = () => {

  clearInterval();
  
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
    {/* <Text style={{fontWeight: 600}}>Timer: {duration}</Text> */}
    </>
    
  
  </View>

   </View>




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
                    data={exams}
                    renderItem={({item,index})=> <Studentexamslist index={index} answerinoput={answerinoput} item={item} retry={retry}  /> }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                         marginBottom: 10
                    }}
                    keyExtractor={item => item.id}
                />

        <Button icon="refresh" onPress={() => router.back() } mode="contained" style={{marginVertical: 40}}>Retry Again</Button>

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
    
    export default React.memo(Studentexamresults);
    
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