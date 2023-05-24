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
import Enterresultnormal from '../../../components/Results/Enterresultnormal';
import Enterresultsampleone from '../../../components/Results/Enterresultsampleone';
import Enterresultsampletwo from '../../../components/Results/Enterresultsampletwo';
import Tinnysampletwo from '../../../components/Results/Tinnysampletwo';



function Resultreport () {

    const token = useSelector(selecttoken);
    const user = useSelector(selectuser);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);


  
    const [openstudent, setOpenstudent] = useState(false);
    const [student, setstudent] = useState("");
    const [studentitems, setstudentItems] = useState([]);


    const {stclass,termid,resulttype} = useSearchParams();

    useEffect(()=> {

       loaddata();

    },[]);


    const loaddata = () => {
        setLoading(true);
        axios.get(schoolzapi+`/active-students-info-by-class/${stclass}`,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        }).then(function (response) {
            loadstudents(response.data.data);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }


    const loadstudents = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.fullname, value: item?.id}))
        
         setstudentItems(mdata);

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
                    open={openstudent}
                    value={student}
                    items={studentitems}
                    setOpen={setOpenstudent}
                    setValue={setstudent}
                    setItems={setstudentItems}
                    placeholder={"Choose Student"}
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


                    

                    {student && (
                        <>

                        {resulttype == "Normal Report" ? (
                            <>
                            <Enterresultnormal key={student} termid={termid} stclass={stclass} resulttype={resulttype} student={student} />
                            </>
                        ) : (
                            <>
                            {resulttype == 'Sample 1' ? (
                                <>
                                <Enterresultsampleone key={student} termid={termid} stclass={stclass} resulttype={resulttype} student={student} />
                                </>
                            ) : (
                                <>
                                {user.uniqueid == '3cddf152-0b10-468c-9686-2bc9464019c6' ? (
                                    <>
                                    <Tinnysampletwo key={student} termid={termid} stclass={stclass} resulttype={resulttype} student={student} />
                                    </>
                                ): (
                                    <>
                                      
                                     {/* <Enterresultsampletwo key={student} termid={termid} stclass={stclass} resulttype={resulttype} student={student} />    */}
                                     <Text>Coming Soon. Loading...</Text>
                                     <ActivityIndicator size="large" />
                                    </>
                                )}
                                
                                </>
                            )}
                            </>
                        )}
                        
                       

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

export default Resultreport;

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
