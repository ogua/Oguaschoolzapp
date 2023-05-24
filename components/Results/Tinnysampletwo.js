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

  
  function Tinnysampletwo ({termid,stclass,resulttype,student}) {
    
    const token = useSelector(selecttoken);
    const role = useSelector(selectroles);
    const user = useSelector(selectuser);
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setissubmitting] = useState(false);
    const router = useRouter();

    const [studentinfo, setstudentinfo] = useState({});
    const [quanswers, setquanswers] = useState("");
    const [aterm, setaterm] = useState("");
    
    const [loadquestion, setloadquestion] = useState([]);

    const [conduct,setconduct] = useState("");

    const [identifyred,setidentifyred] = useState("");
    const [identifyyell,setidentifyyell] = useState("");
    const [identifypink,setidentifypink] = useState("");
    const [identifygreen,setidentifygreen] = useState("");
    const [identifyoran,setidentifyoran] = useState("");
    const [identifypurp,setidentifypurp] = useState("");
    const [identifyblue,setidentifyblue] = useState("");
    const [identifygrey,setidentifygrey] = useState("");
    const [identifyblack,setidentifyblack] = useState("");
    const [identifywhite,setidentifywhite] = useState("");
    const [identifybrown,setidentifybrown] = useState("");

    const [sortred,setsortred] = useState("");
    const [sortyell,setsortyell] = useState("");
    const [sortpink,setsortpink] = useState("");
    const [sortgreen,setsortgreen] = useState("");
    const [sortoran,setsortoran] = useState("");
    const [sortpurp,setsortpurp] = useState("");
    const [sortblue,setsortblue] = useState("");
    const [sortgrey,setsortgrey] = useState("");
    const [sortblack,setsortblack] = useState("");
    const [sortwhite,setsortwhite] = useState("");
    const [sortbrown,setsortbrown] = useState("");


    const [Cancountupto,setCancountupto] = useState("");
    const [Canidentify,setCanidentify] = useState("");
    const [Quantities,setQuantities] = useState("");
    const [Cansortingroups,setCansortingroups] = useState("");
    const [Canwritenum,setCanwritenum] = useState("");
    const [Canadd,setCanadd] = useState("");
    const [Cantakeaway,setCantakeaway] = useState("");


    const [CansayAZ,setCansayAZ] = useState("");
    const [Canidentifyletter,setCanidentifyletter] = useState("");
    const [Canwrite,setCanwrite] = useState("");
    const [Canwritename,setCanwritename] = useState("");
    const [Canassociate,setCanassociate] = useState("");


    const [drawCircle,setdrawCircle] = useState("");
    const [drawSquare,setdrawSquare] = useState("");
    const [drawTriangle,setdrawTriangle] = useState("");
    const [drawOblong,setdrawOblong] = useState("");
    const [drawStar,setdrawStar] = useState("");
    const [drawOval,setdrawOval] = useState("");
    const [drawSemi,setdrawSemi] = useState("");

    const [IdentifyCircle,setIdentifyCircle] = useState("");
    const [IdentifySquare,setIdentifySquare] = useState("");
    const [IdentifyTriangle,setIdentifyTriangle] = useState("");
    const [IdentifyOblong,setIdentifyOblong] = useState("");
    const [IdentifyStar,setIdentifyStar] = useState("");
    const [IdentifyOval,setIdentifyOval] = useState("");
    const [IdentifySemi,setIdentifySemi] = useState("");


    const [Paperwork,setPaperwork] = useState("");
    const [Painting,setPainting] = useState("");
    const [Handeye,setHandeye] = useState("");
    const [LargeMotor,setLargeMotor] = useState("");
    const [listen,setlisten] = useState("");
    const [Workalone,setWorkalone] = useState("");
    const [interaction,setinteraction] = useState("");
    const [Interacts,setInteracts] = useState("");
    const [addinfo,setaddinfo] = useState("");


    















    



    useEffect(()=> {
     // setcheckstudent(student);
      loaddata();

    },[]);
    
    const loaddata = () => {
    setLoading(true);
      
    axios.get(schoolzapi+`/student-results-tiny-sample-two/${stclass}/${termid}/${student}/${resulttype}`,
        {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
        }
      })
    .then(function (response) {
    
        if(response.data.error){

        showMessage({
            message: response.data.error,
            type: "warning",
            position: 'bottom',
        });


    }else{

         setstudentinfo(response.data.student);        
         setquanswers(response.data.ans);
         setaterm(response.data.term);
         setidentifyred(response.data.ans.identifyred);  
         setidentifyyell(response.data.ans.identifyyell);  
         setidentifypink (response.data.ans.identifypink); 
         setidentifygreen (response.data.ans.identifygreen); 
         setidentifyoran  (response.data.ans.identifyoran);
         setidentifypurp (response.data.ans.identifypurp); 
         setidentifyblue (response.data.ans.identifyblue); 
         setidentifygrey (response.data.ans.identifygrey); 
         setidentifyblack (response.data.ans.identifyblack);
         setidentifywhite (response.data.ans.identifywhite); 
         setidentifybrown (response.data.ans.identifybrown); 
         setsortred  (response.data.ans.sortred);
         setsortyell (response.data.ans.sortyell); 
         setsortpink (response.data.ans.sortpink); 
         setsortgreen(response.data.ans.sortgreen);  
         setsortoran (response.data.ans.sortoran); 
         setsortpurp (response.data.ans.sortpurp); 
         setsortblue (response.data.ans.sortblue);
         setsortgrey  (response.data.ans.sortgrey);
         setsortblack (response.data.ans.sortblack); 
         setsortwhite  (response.data.ans.sortwhite);
         setsortbrown  (response.data.ans.sortbrown);
         setCancountupto (response.data.ans.Cancountupto); 
         setCanidentify(response.data.ans.Canidentify);  
         setQuantities (response.data.ans.Quantities); 
         setCansortingroups (response.data.ans.Cansortingroups); 
         setCanwritenum(response.data.ans.Canwritenum);
         setCanadd(response.data.ans.Canadd);
         setCantakeaway(response.data.ans.Cantakeaway);
         setCansayAZ(response.data.ans.CansayAZ);
         setCanidentifyletter (response.data.ans.Canidentifyletter);
         setCanwrite (response.data.ans.Canwrite);
         setCanwritename (response.data.ans.Canwritename);
         setCanassociate (response.data.ans.Canassociate);
         setdrawCircle (response.data.ans.drawCircle);
         setdrawSquare (response.data.ans.drawSquare); 
         setdrawTriangle (response.data.ans.drawTriangle);
         setdrawOblong (response.data.ans.drawOblong); 
         setdrawStar (response.data.ans.drawStar); 
         setdrawOval (response.data.ans.drawOval); 
         setdrawSemi (response.data.ans.drawSemi); 
         setIdentifyCircle (response.data.ans.IdentifyCircle);
         setIdentifySquare(response.data.ans.IdentifySquare);  
         setIdentifyTriangle(response.data.ans.IdentifyTriangle);  
         setIdentifyOblong(response.data.ans.IdentifyOblong);  
         setIdentifyStar(response.data.ans.IdentifyStar); 
         setIdentifyOval (response.data.ans.IdentifyOval); 
         setIdentifySemi (response.data.ans.IdentifySemi); 
         setPaperwork (response.data.ans.Paperwork); 
         setPainting (response.data.ans.Painting); 
         setHandeye(response.data.ans.Handeye);
         setLargeMotor (response.data.ans.LargeMotor); 
         setlisten  (response.data.ans.listen);
         setWorkalone (response.data.ans.Workalone); 
         setinteraction (response.data.ans.interaction); 
         setInteracts (response.data.ans.Interacts); 
         setaddinfo(response.data.ans.addinfo);
    }

    

    setLoading(false);
      
      
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



  const saveaddresults = () => {

    setissubmitting(true);

    const formdata = {
      studentid: studentinfo.student_id,
      term: aterm,
      stclass,
      identifyred,  
            identifyyell,  
            identifypink , 
            identifygreen , 
            identifyoran  ,
            identifypurp , 
            identifyblue , 
            identifygrey , 
            identifyblack ,
            identifywhite , 
            identifybrown , 
            sortred  ,
            sortyell , 
            sortpink , 
            sortgreen,  
            sortoran , 
            sortpurp , 
            sortblue ,
            sortgrey  ,
            sortblack , 
            sortwhite  ,
            sortbrown  ,
            Cancountupto , 
            Canidentify,  
            Quantities , 
            Cansortingroups , 
            Canwritenum,
            Canadd,
            Cantakeaway,
            CansayAZ,
            Canidentifyletter ,
            Canwrite ,
            Canwritename ,
            Canassociate ,
            drawCircle ,
            drawSquare , 
            drawTriangle ,
            drawOblong , 
            drawStar , 
            drawOval , 
            drawSemi , 
            IdentifyCircle ,
            IdentifySquare,  
            IdentifyTriangle,  
            IdentifyOblong,  
            IdentifyStar, 
            IdentifyOval , 
            IdentifySemi , 
            Paperwork , 
            Painting , 
            Handeye,
            LargeMotor , 
            listen  ,
            Workalone , 
            interaction , 
            Interacts , 
            addinfo
    }


   // console.log(formdata);
   // return;

      
    axios.post(schoolzapi+`/tiny-sample-two-result-save`,
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

                       <View style={{marginVertical: 20}}>
                       <Text>Colours Can Identify</Text>
                        <ScrollView
                         horizontal
                         >
                        
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            
                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={identifyred}
                                    status={ identifyred === 'identifyred' ? 'checked' : 'unchecked' }
                                    onPress={() => identifyred === 'identifyred' ? setidentifyred("") : setidentifyred('identifyred')}
                                />
                                <Text>Red</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={identifyyell}
                                  status={ identifyyell === 'identifyyell' ? 'checked' : 'unchecked' }
                                    onPress={() => identifyyell === 'identifyyell' ? setidentifyyell("") : setidentifyyell('identifyyell')}
                                /> 
                                <Text>Yellow</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={identifypink}
                                  status={ identifypink === 'identifypink' ? 'checked' : 'unchecked' }
                                    onPress={() => identifypink === 'identifypink' ? setidentifypink("") : setidentifypink('identifypink')}
                                />
                                <Text>Pink</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={identifygreen}
                                  status={ identifygreen === 'identifygreen' ? 'checked' : 'unchecked' }
                                    onPress={() => identifygreen === 'identifygreen' ? setidentifygreen("") : setidentifygreen('identifygreen')}
                                />
                                <Text>Green</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={identifyoran}
                                  status={ identifyoran === 'identifyoran' ? 'checked' : 'unchecked' }
                                    onPress={() => identifyoran === 'identifyoran' ? setidentifyoran("") : setidentifyoran('identifyoran')}
                                />
                                <Text>Orange</Text>
                            </View>


                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={identifypurp}
                                  status={ identifypurp === 'identifypurp' ? 'checked' : 'unchecked' }
                                    onPress={() => identifypurp === 'identifypurp' ? setidentifypurp("") : setidentifypurp('identifypurp')}
                                />
                                <Text>Purple</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={identifyblue}
                                  status={ identifyblue === 'identifyblue' ? 'checked' : 'unchecked' }
                                    onPress={() => identifyblue === 'identifyblue' ? setidentifyblue("") : setidentifyblue('identifyblue')}
                                />
                                <Text>Blue</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={identifygrey}
                                  status={ identifygrey === 'identifygrey' ? 'checked' : 'unchecked' }
                                    onPress={() => identifygrey === 'identifygrey' ? setidentifygrey("") : setidentifygrey('identifygrey')}
                                />
                                 <Text>Grey</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={identifyblack}
                                  status={ identifyblack === 'identifyblack' ? 'checked' : 'unchecked' }
                                    onPress={() => identifyblack === 'identifyblack' ? setidentifyblack("") : setidentifyblack('identifyblack')}
                                />
                                <Text>Black</Text>
                            </View>


                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={identifywhite}
                                  status={ identifywhite === 'identifywhite' ? 'checked' : 'unchecked' }
                                    onPress={() => identifywhite === 'identifywhite' ? setidentifywhite("") : setidentifywhite('identifywhite')}
                                />
                                <Text>White</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={identifybrown}
                                  status={ identifybrown === 'identifybrown' ? 'checked' : 'unchecked' }
                                    onPress={() => identifybrown === 'identifybrown' ? setidentifybrown("") : setidentifybrown('identifybrown')}
                                />
                                <Text>Brown</Text>
                            </View>

                        </View>
                        </ScrollView>

                        <Text style={{marginTop: 20}}>Can Sort</Text>
                        <ScrollView
                         horizontal
                         >
                        
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            
                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={sortred}
                                    status={ sortred === 'sortred' ? 'checked' : 'unchecked' }
                                    onPress={() => sortred === 'sortred' ? setsortred("") : setsortred('sortred')}
                                />
                                 <Text>Red</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={sortyell}
                                  status={ sortyell === 'sortyell' ? 'checked' : 'unchecked' }
                                    onPress={() => sortyell === 'sortyell' ? setsortyell("") : setsortyell('sortyell')}
                                /> 
                                <Text>Yellow</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={sortpink}
                                  status={ sortpink === 'sortpink' ? 'checked' : 'unchecked' }
                                    onPress={() => sortpink === 'sortpink' ? setsortpink("") : setsortpink('sortpink')}
                                />
                                <Text>Pink</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={sortgreen}
                                  status={ sortgreen === 'sortgreen' ? 'checked' : 'unchecked' }
                                    onPress={() => sortgreen === 'sortgreen' ? setsortgreen("") : setsortgreen('sortgreen')}
                                />
                                <Text>Green</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={sortoran}
                                  status={ sortoran === 'sortoran' ? 'checked' : 'unchecked' }
                                    onPress={() => sortoran === 'sortoran' ? setsortoran("") : setsortoran('sortoran')}
                                />
                                <Text>Orange</Text>
                            </View>


                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={sortpurp}
                                  status={ sortpurp === 'sortpurp' ? 'checked' : 'unchecked' }
                                    onPress={() => sortpurp === 'sortpurp' ? setsortpurp("") : setsortpurp('sortpurp')}
                                />
                                <Text>Purple</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={sortblue}
                                  status={ sortblue === 'sortblue' ? 'checked' : 'unchecked' }
                                    onPress={() => sortblue === 'sortblue' ? setsortblue("") : setsortblue('sortblue')}
                                />
                                <Text>Blue</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={sortgrey}
                                  status={ sortgrey === 'sortgrey' ? 'checked' : 'unchecked' }
                                    onPress={() => sortgrey === 'sortgrey' ? setsortgrey("") : setsortgrey('sortgrey')}
                                />
                                <Text>Grey</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={sortblack}
                                  status={ sortblack === 'sortblack' ? 'checked' : 'unchecked' }
                                    onPress={() => sortblack === 'sortblack' ? setsortblack("") : setsortblack('sortblack')}
                                />
                                <Text>Black</Text>
                            </View>


                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={sortwhite}
                                  status={ sortwhite === 'sortwhite' ? 'checked' : 'unchecked' }
                                    onPress={() => sortwhite === 'sortwhite' ? setsortwhite("") : setsortwhite('sortwhite')}
                                />
                                <Text>White</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={sortbrown}
                                  status={ sortbrown === 'sortbrown' ? 'checked' : 'unchecked' }
                                    onPress={() => sortbrown === 'sortbrown' ? setsortbrown("") : setsortbrown('sortbrown')}
                                />
                                <Text>Brown</Text>
                            </View>

                        </View>
                        </ScrollView>


                        <Text style={{marginTop: 20}}>Numbers</Text>
                        <ScrollView
                         horizontal
                         >
                        
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            
                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={Cancountupto}
                                  status={ Cancountupto === 'Cancountupto' ? 'checked' : 'unchecked' }
                                    onPress={() => Cancountupto === 'Cancountupto' ? setCancountupto("") : setCancountupto('Cancountupto')}
                                /> 
                                <Text>Can count up to</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={Canidentify}
                                  status={ Canidentify === 'Canidentify' ? 'checked' : 'unchecked' }
                                    onPress={() => Canidentify === 'Canidentify' ? setCanidentify("") : setCanidentify('Canidentify')}
                                />
                                <Text>Can identify</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={Quantities}
                                  status={ Quantities === 'Quantities' ? 'checked' : 'unchecked' }
                                    onPress={() => Quantities === 'Quantities' ? setQuantities("") : setQuantities('Quantities')}
                                />
                                <Text>Quantities</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={Cansortingroups}
                                  status={ Cansortingroups === 'Cansortingroups' ? 'checked' : 'unchecked' }
                                    onPress={() => Cansortingroups === 'Cansortingroups' ? setCansortingroups("") : setCansortingroups('Cansortingroups')}
                                /> 
                                <Text>Can sort in groups</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={Canwritenum}
                                  status={ Canwritenum === 'Canwrite' ? 'checked' : 'unchecked' }
                                    onPress={() => Canwritenum === 'Canwrite' ? setCanwritenum("") : setCanwritenum('Canwrite')}
                                />
                                <Text>Can write</Text>
                            </View>


                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={Canadd}
                                  status={ Canadd === 'Canadd' ? 'checked' : 'unchecked' }
                                    onPress={() => Canadd === 'Canadd' ? setCanadd("") : setCanadd('Canadd')}
                                /> 
                                <Text>Can add</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={Cantakeaway}
                                  status={ Cantakeaway === 'Cantakeaway' ? 'checked' : 'unchecked' }
                                    onPress={() => Cantakeaway === 'Cantakeaway' ? setCantakeaway("") : setCantakeaway('Cantakeaway')}
                                /> 
                                <Text>Can take away</Text>
                            </View>

                        </View>
                        </ScrollView>

                        <Text style={{marginTop: 20}}>Letters</Text>
                        
                        <Text style={{marginTop: 20}}>Can say A-Z</Text>
                        <TextInput
                         mode="outlined"
                         value={CansayAZ}
                         onChangeText={(e) => setCansayAZ(e)}
                         />

                         <Text style={{marginTop: 20}}>Can identify</Text>
                        <TextInput
                          mode="outlined"
                         value={Canidentifyletter}
                         onChangeText={(e) => setCanidentifyletter(e)}
                         />

                        <Text style={{marginTop: 20}}>Can write</Text>
                        <TextInput
                          mode="outlined"
                         value={Canwrite}
                         onChangeText={(e) => setCanwrite(e)}
                         />

                        <Text style={{marginTop: 20}}>Can write name</Text>
                        <TextInput
                          mode="outlined"
                         value={Canwritename}
                         onChangeText={(e) => setCanwritename(e)}
                         />

                        <Text style={{marginTop: 20}}>Can associate "a"-apple etc</Text>
                        <TextInput
                          mode="outlined"
                         value={Canassociate}
                         onChangeText={(e) => setCanassociate(e)}
                         />


                       <Text style={{marginTop: 20}}>Shape Can Draw</Text>
                        <ScrollView
                         horizontal
                         >
                        
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            
                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={drawCircle}
                                  status={ drawCircle === 'drawCircle' ? 'checked' : 'unchecked' }
                                    onPress={() => drawCircle === 'drawCircle' ? setdrawCircle("") : setdrawCircle('drawCircle')}
                                /> 
                                <Text>Circle</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={drawSquare}
                                  status={ drawSquare === 'drawSquare' ? 'checked' : 'unchecked' }
                                    onPress={() => drawSquare === 'drawSquare' ? setdrawSquare("") : setdrawSquare('drawSquare')}
                                />
                                <Text>Square</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={drawTriangle}
                                  status={ drawTriangle === 'drawTriangle' ? 'checked' : 'unchecked' }
                                    onPress={() => drawTriangle === 'drawTriangle' ? setdrawTriangle("") : setdrawTriangle('drawTriangle')}
                                />
                                <Text>Triangle</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={drawOblong}
                                  status={ drawOblong === 'drawOblong' ? 'checked' : 'unchecked' }
                                    onPress={() => drawOblong === 'drawOblong' ? setdrawOblong("") : setdrawOblong('drawOblong')}
                                />
                                <Text>Oblong</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={drawStar}
                                  status={ drawStar === 'drawStar' ? 'checked' : 'unchecked' }
                                    onPress={() => drawStar === 'drawStar' ? setdrawStar("") : setdrawStar('drawStar')}
                                />
                                <Text>Star</Text>
                            </View>


                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={drawOval}
                                  status={ drawOval === 'drawOval' ? 'checked' : 'unchecked' }
                                    onPress={() => drawOval === 'drawOval' ? setdrawOval("") : setdrawOval('drawOval')}
                                />
                                 <Text>Oval</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={drawSemi}
                                  status={ drawSemi === 'drawSemi' ? 'checked' : 'unchecked' }
                                    onPress={() => drawSemi === 'drawSemi' ? setdrawSemi("") : setdrawSemi('drawSemi')}
                                />
                                <Text>Semi-circle</Text>
                            </View>

                        </View>
                        </ScrollView>


                        <Text style={{marginTop: 20}}>Shape Can Identify</Text>
                        <ScrollView
                         horizontal
                         >
                        
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            
                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={IdentifyCircle}
                                  status={ IdentifyCircle === 'IdentifyCircle' ? 'checked' : 'unchecked' }
                                    onPress={() => IdentifyCircle === 'IdentifyCircle' ? setIdentifyCircle("") : setIdentifyCircle('IdentifyCircle')}
                                />
                                 <Text>Circle</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={IdentifySquare}
                                  status={ IdentifySquare === 'IdentifySquare' ? 'checked' : 'unchecked' }
                                    onPress={() => IdentifySquare === 'IdentifySquare' ? setIdentifySquare("") : setIdentifySquare('IdentifySquare')}
                                />
                                <Text>Square</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={IdentifyTriangle}
                                  status={ IdentifyTriangle === 'IdentifyTriangle' ? 'checked' : 'unchecked' }
                                    onPress={() => IdentifyTriangle === 'IdentifyTriangle' ? setIdentifyTriangle("") : setIdentifyTriangle('IdentifyTriangle')}
                                /> 
                                <Text>Triangle</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={IdentifyOblong}
                                  status={ IdentifyOblong === 'IdentifyOblong' ? 'checked' : 'unchecked' }
                                    onPress={() => IdentifyOblong === 'IdentifyOblong' ? setIdentifyOblong("") : setIdentifyOblong('IdentifyOblong')}
                                /> 
                                <Text>Oblong</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                               
                                <RadioButton
                                    value={IdentifyStar}
                                  status={ IdentifyStar === 'IdentifyStar' ? 'checked' : 'unchecked' }
                                    onPress={() => IdentifyStar === 'IdentifyStar' ? setIdentifyStar("") : setIdentifyStar('IdentifyStar')}
                                />  
                                <Text>Star</Text>
                            </View>


                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                    value={IdentifyOval}
                                  status={ IdentifyOval === 'IdentifyOval' ? 'checked' : 'unchecked' }
                                    onPress={() => IdentifyOval === 'IdentifyOval' ? setIdentifyOval("") : setIdentifyOval('IdentifyOval')}
                                /> 
                                <Text>Oval</Text>
                            </View>

                            <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <RadioButton
                                  status={ IdentifySemi === 'IdentifySemi' ? 'checked' : 'unchecked' }
                                    onPress={() => IdentifySemi === 'IdentifySemi' ? setIdentifySemi("") : setIdentifySemi('IdentifySemi')}
                                /> 
                                <Text>Semi-circle</Text>
                            </View>

                        </View>
                        </ScrollView>


                        <Text style={{marginTop: 20}}>Paper work</Text>
                        <TextInput
                          mode="outlined"
                         value={Paperwork}
                         onChangeText={(e) => setPaperwork(e)}
                         />

                        <Text style={{marginTop: 20}}>Painting/Art & craft</Text>
                        <TextInput
                          mode="outlined"
                         value={Painting}
                         onChangeText={(e) => setPainting(e)}
                         />

                 <Text style={{marginTop: 20}}>Co-ordination</Text>
                        <TextInput
                        label="Hand eye:"
                          mode="outlined"
                         value={Handeye}
                         onChangeText={(e) => setHandeye(e)}
                         />

                        <TextInput
                         label="Large Motor"
                          mode="outlined"
                         value={LargeMotor}
                         onChangeText={(e) => setLargeMotor(e)}
                         />

                        <Text style={{marginTop: 20}}>How well does he/she listen</Text>
                        <TextInput
                          mode="outlined"
                         value={listen}
                         onChangeText={(e) => setlisten(e)}
                         />

                        <Text style={{marginTop: 20}}>Work alone:</Text>
                        <TextInput
                          mode="outlined"
                         value={Workalone}
                         onChangeText={(e) => setWorkalone(e)}
                         />

                        <Text style={{marginTop: 20}}>Group interaction</Text>
                        <TextInput
                          mode="outlined"
                         value={interaction}
                         onChangeText={(e) => setinteraction(e)}
                         />

                    <Text style={{marginTop: 20}}>Interacts with adults</Text>
                        <TextInput
                          mode="outlined"
                         value={Interacts}
                         onChangeText={(e) => setInteracts(e)}
                         />


                    </View>

                             

                           <Text style={styles.field}>Additional Information:</Text>
                            <TextInput
                                multiline={true}
                                numberOfLines={4}
                                mode='outlined'
                                value={addinfo}
                                onChangeText={(e) => setaddinfo(e)}
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
    
    export default Tinnysampletwo;
    
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