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
  import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { selectroles, selecttoken, selectuser } from '../../features/userinfoSlice';
import { schoolzapi } from '../constants';
import Reportnormal from './Reportnormal';
import Reportsampleone from './Reportsampleone';
import Reportsampletwo from './Reportsampletwo';
import Reporttinnytowersampletwo from './Reporttinnytowersampletwo';

  
  function Myresults () {
    
    const token = useSelector(selecttoken);
    const role = useSelector(selectroles);
    const user = useSelector(selectuser);
    const [isloading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const scrollViewRef = useRef();

    const [monitor, setmonitor] = useState([]);
  
   
   
    useEffect(()=> {

      loaddata();

    },[]);
    
    
    const loaddata = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/student-results',
      {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
      }
    })
    .then(function (results) {

      //console.log(results.data.data);
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

    
    {monitor.length > 0 && (
        <>
         {monitor.map((item,index)=> (
            <>
            {item.resultstype == 'Sample 1' ? (
                <Reportsampleone termid={item.term} stclassid={item.stclassid} term={item.termnama} stclass={item.stclass} from={item.fromdate} to={item.todate} />
            ) : (
                <>
                {item.resultstype == 'Sample 2' ? (
                    <>
                    {user.uniqueid == '3cddf152-0b10-468c-9686-2bc9464019c6' ? (
                        <Reporttinnytowersampletwo termid={item.term} stclassid={item.stclassid} term={item.termnama} stclass={item.stclass} from={item.fromdate} to={item.todate} />
                    ) : (
                      <Reportsampletwo termid={item.term} stclassid={item.stclassid} term={item.termnama} stclass={item.stclass} from={item.fromdate} to={item.todate} />
                    )}
                    
                    </>
                ) : (
                    <>
                      <Reportnormal termid={item.term} stclassid={item.stclassid} term={item.termnama} stclass={item.stclass}/>
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
      </KeyboardAwareScrollView>
      </SafeAreaView>
      </Provider>
      
      )
    }
    
    export default Myresults;
    
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