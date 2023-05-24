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
import { selecttoken, selectuser } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';
import Reportpersubject from '../../../components/Results/Reportpersubject';



function Reportstudentspersubject () {

    const token = useSelector(selecttoken);
    const user = useSelector(selectuser);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);


  
    const [opensubject, setOpensubject] = useState(false);
    const [subject, setsubject] = useState("");
    const [subjectitems, setsubjectItems] = useState([]);


    const {stclass,termid} = useSearchParams();

    useEffect(()=> {

       loaddata();

    },[]);


    const loaddata = () => {
        setLoading(true);
        axios.get(schoolzapi+`/subject`,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        }).then(function (response) {
            loadsubjects(response.data.data);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }


    const loadsubjects = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setsubjectItems(mdata);

         setLoading(false);
    }


    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen options={{
            headerShown: false
        }}
        />
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loaddata} />
        }
        >
            <Card>
                <Card.Content>

                <TouchableOpacity style={{flexDirection: 'row', marginTop: 20}} onPress={()=> router.back()}>
                    <Ionicons name="close-circle" size={30} />
                </TouchableOpacity>
                

                {isloading ? null : (
                <>

               <DropDownPicker
                    searchable
                    open={opensubject}
                    value={subject}
                    items={subjectitems}
                    setOpen={setOpensubject}
                    setValue={setsubject}
                    setItems={setsubjectItems}
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
                        //backgroundColor: "#F5F7F6",
                        minHeight: 50,
                        marginTop: 10,
                        marginBottom: 20
                    }}
                    />


                    

                    {subject && (
                        <>
                            <Reportpersubject key={subject} termid={termid} stclass={stclass} subject={subject} />            
                        </>
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

export default Reportstudentspersubject;

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
