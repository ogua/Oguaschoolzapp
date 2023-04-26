import React, { Component } from 'react'
import { Stack, useRouter } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert } from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { schoolzapi } from '../constants';
import { selecttoken } from '../../features/userinfoSlice';
import Visitorslist from '../../lists/Visitorslist';
import Studentlist from '../../lists/Studentlist';
import Normallist from '../../lists/Normallist';
import Dispatchedfeelist from '../../lists/Dispatchedfeelist';
import Roomsallocatedlist from '../../lists/Roomsallocatedlist';

function Allocatestudent () {

    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const [studentclass, setStudentclass] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const [showdialog, setShowdialog] = useState(false);
    const showDialog = () => setShowdialog(true);
    const hideDialog = () => setShowdialog(false);
    const [showsnakbar, setShowsnakbar] = useState(false);
    const [active, setActive] = useState("");

    useEffect(()=> {
      
      DeviceEventEmitter.addListener("subject.added", (event)=>{
        loaddata();
        DeviceEventEmitter.removeAllListeners("event.test");
      });

       loaddata();

    },[]);

    const loaddata = () => {
        setLoading(true);
        
        axios.get(schoolzapi+'/hostel-allocated',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (results) {
            setLoading(false);
            setData(results.data.data);
            setFilterdata(results.data.data);

        }).catch(function(error){
            setLoading(false);
            console.log(error);
            
        });
    }


    const deletedata = (id,delname) => {

        return Alert.alert(
            "Are your sure?",
            "Are you sure you want to delete "+delname+" info",
            [
              {
                text: "No",
              },
              {
                text: "Yes Delete",
                onPress: () => {
                    setLoading(true);
                    axios.delete(schoolzapi+'/hostel-allocated/'+id,
                    {
                        headers: {Accept: 'application/json',
                        Authorization: "Bearer "+token
                    }
                    })
                        .then(function (response) {
                            const newData = data.filter((item) => item.id != id);
                            setFilterdata(newData);
                            setData(newData);
                            //loaddata();
                            setLoading(false);
                        })
                        .catch(function (error) {
                        setLoading(false);
                        console.log(error);
                        });
                },
              },
            ]
          );

    }



    const releasebed = (id,delname,fullname) => {

        return Alert.alert(
            "Are your sure?",
            "Are you sure you want to release bed "+delname+" allocated to "+fullname,
            [
              {
                text: "No",
              },
              {
                text: "Yes Release",
                onPress: () => {
                    setLoading(true);
                    axios.delete(schoolzapi+'/hostel-allocated/'+id,
                    {
                        headers: {Accept: 'application/json',
                        Authorization: "Bearer "+token
                    }
                    })
                        .then(function (response) {
                            const newData = data.filter((item) => item.id != id);
                            setFilterdata(newData);
                            setData(newData);
                            //loaddata();
                            setLoading(false);
                        })
                        .catch(function (error) {
                        setLoading(false);
                        console.log(error);
                        });
                },
              },
            ]
          );

    }
  
      const searchFilterFunction = (text) => {
  
          if (text) {
              
            const newData = data.filter(function (item) {
              const itemData = item.fullname
                ? item.fullname.toUpperCase()
                : ''.toUpperCase();
              const textData = text.toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            setFilterdata(newData);
            setSearch(text);
          } else {
            setFilterdata(data);
            setSearch(text);
          }
    };


    const checkclassselected = (id) => {

      if(active == id){
        setActive("All");
        searchFilterclassFunction("All");
      }else{
        setActive(id);
        searchFilterclassFunction(id);
      }
    }


    const stclasslist = (item) => (
        <>
        <TouchableOpacity style={{backgroundColor: `${active == item.id ? `#1782b6` : `#fff` }`, borderRadius: 30, marginTop: 10, marginRight: 20}}
        onPress={()=> {
            checkclassselected(item.id);
        }}
        >
        <List.Item
            title={item?.name}
            titleStyle={{color: `${active == item.id ? `#fff` : `#000` }`,fontSize: 15}}
            titleEllipsizeMode="tail"/>
        </TouchableOpacity>
        </>
    );

    const searchFilterclassFunction = (text) => {
        
        if (text) {
            setLoading(true);
            if(text == "All"){

              setFilterdata(data);

            }else{
              const newData = data.filter(item => item.stclassid == text);
              setFilterdata(newData);
            }
          //setSearch(text);
          setLoading(false);
        } else {
            setLoading(true);
          setFilterdata(data);
          //setSearch(text);
          setLoading(false);
        }
  };

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
        options={{
            headerTitle: 'Rooms & Beds Allocated'
           }}
        />

         {isloading ? null : (
           <View style={{marginVertical: 20}}>
                <View style={{flexDirection: 'row',justifyContent: 'flex-end', marginHorizontal: 20}}>
                    
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.push('/admin/hostel/create-edit-allocate-student')}>
                        <Ionicons name='add-circle' size={22} color="#17a2b8"/>
                        <Text style={{fontSize: 18}}>Allocate Student</Text>
                    </TouchableOpacity>
                </View>
            </View>)}

       <Searchbar
            placeholder='Search....'
            mode="outlined"
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
        />

        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loaddata} />
        }
        > 
                <Card>
                <Card.Content>
                <FlatList
                    data={filterdata}
                    renderItem={({item})=> <Roomsallocatedlist item={item} deletedata={deletedata} studentclasslist={studentclass} releasebed={releasebed} /> }
                      contentContainerStyle={{
                        marginBottom: 200
                    }}
                    keyExtractor={item => item.id}
                />
                </Card.Content>
            </Card> 

        </ScrollView>
      </SafeAreaView>
      </Provider>
    )
}

export default Allocatestudent;

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