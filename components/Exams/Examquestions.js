import React, { Component } from 'react'
import { Stack, useRouter } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert } from 'react-native'
import { useEffect } from 'react';
import { RadioButton, Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { schoolzapi } from '../constants';
import { selecttoken } from '../../features/userinfoSlice';
import { selectexam, setExam } from '../../features/examSlice';

function Examquestions ({item,index,retry}) {

    const exams = useSelector(selectexam);
    const dispatch = useDispatch();


    const answerinoput = (index,newvalue) => {
        // setanswerindex(`${index}`);
         const newname = exams.map((item,nindex) => {
           if(nindex === index){
             
             return {...item, useranser: newvalue, response: item.answer == newvalue ? `Correct` : `Wrong`};
           }
           return item;
         });

         dispatch(setExam(newname));
     
        // setData(newname);
     }




    return (
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
    )
}

export default Examquestions;

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
