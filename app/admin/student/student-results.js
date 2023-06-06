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
import { selecttoken,selectroles,selectuser } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';
import Reportsampleone from '../../../components/Terminalreport/Reportsampleone';
import Reportsampletwo from '../../../components/Terminalreport/Reportsampletwo';
import Reportnormal from '../../../components/Terminalreport/Reportnormal';
import Reporttinnytowersampletwo from '../../../components/Terminalreport/Reporttinnytowersampletwo';
import Sampleoneinfo from '../../../components/Studentinfo/Sampleoneinfo';
import Tinysampletwo from '../../../components/Studentinfo/Tinysampletwo';
import Sampletwoinfo from '../../../components/Studentinfo/Sampletwoinfo';
import Normalreportinfo from '../../../components/Studentinfo/Normalreportinfo';

  
  function Studentresulrs () {
    
    const token = useSelector(selecttoken);
    const role = useSelector(selectroles);
    const user = useSelector(selectuser);
    const [isloading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const scrollViewRef = useRef();

    const [monitor, setmonitor] = useState([]);

    const {stndid,fullname,fileimg} = useSearchParams();
  
   
   
    useEffect(()=> {

      loaddata();

    },[]);
    
    
    const loaddata = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/student-results/'+stndid,
      {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
      }
    })
    .then(function (results) {

      console.log("monitor",results.data.data);
      setmonitor(results.data.data);
      setLoading(false);
      
      
    }).catch(function(error){
      setLoading(false);
      console.log(error);
    });
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
       <Ionicons name="close-circle" size={35} />
    </TouchableOpacity>
    
    <Text style={{fontSize: 18}}>End Of Term Results</Text>

    <TouchableOpacity onPress={()=> loaddata()}>
       <Ionicons name="refresh-circle" size={35} />
    </TouchableOpacity>
  
  </View>

   </View>  



   <Text style={{fontSize: 18,textAlign: 'center', marginVertical: 15}}>{fullname.toLocaleUpperCase()}</Text>



  <ScrollView
  ref={scrollViewRef}
  //onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
  style={{marginBottom: 250}}
  refreshControl={
    <RefreshControl refreshing={isloading} onRefresh={loaddata} />
  }
  > 
  <Card>
  <Card.Content>

    
    {monitor.length > 0 && (
        <>
         {monitor.map((item,index)=> (
            <>
            {item.resultstype == 'Sample 1' ? (
                <Sampleoneinfo key={index} stndid={stndid} termid={item.term} stclassid={item.stclassid} term={item.termnama} stclass={item.stclass} from={item.fromdate} to={item.todate} />
            ) : (
                <>
                {item.resultstype == 'Sample 2' ? (
                    <>
                    {user.uniqueid == '3cddf152-0b10-468c-9686-2bc9464019c6' ? (
                        <Tinysampletwo key={index} stndid={stndid} termid={item.term} stclassid={item.stclassid} term={item.termnama} stclass={item.stclass} from={item.fromdate} to={item.todate} />
                    ) : (
                      <Sampletwoinfo key={index} stndid={stndid} termid={item.term} stclassid={item.stclassid} term={item.termnama} stclass={item.stclass} from={item.fromdate} to={item.todate} />
                    )}
                    
                    </>
                ) : (
                    <>
                      <Normalreportinfo key={index} stndid={stndid} termid={item.term} stclassid={item.stclassid} term={item.termnama} stclass={item.stclass}/>
                    </>
                )}
                
                </>
            )}
            </>
         ))}
        
        </>
    )}
  
    
            
  </Card.Content>
   </Card> 
      
      </ScrollView>
      </SafeAreaView>
      </Provider>
      
      )
    }
    
    export default Studentresulrs;
    
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