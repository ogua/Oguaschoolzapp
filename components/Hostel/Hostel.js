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
import Hostellist from '../../lists/hostellist';

function Hostel () {

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

    const [floor, setfloor] = useState([
        {id: 1, name: 'First Floor'},
        {id: 2, name: 'Second Floor'},
        {id: 3, name: 'Third Floor'},
        {id: 4, name: 'Fourth Floor	'},
        {id: 5, name: 'Fifth Floor'},
    ]);



    useEffect(()=> {
      
      DeviceEventEmitter.addListener("subject.added", (event)=>{
        console.log('how many time');
        loaddata();
        DeviceEventEmitter.removeAllListeners("event.test");
      });

       loaddata();

    },[]);


    const loaddata = () => {
        setLoading(true);
        
        axios.get(schoolzapi+'/student-classes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (results) {
            setLoading(false);

            setData(acct.data.data);
            setFilterdata(acct.data.data);
            

        }).catch(function(error){
            setLoading(false);
            const acct = error[0];
            const studeclass = error[1];
            
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
                    axios.delete(schoolzapi+'/student-info/'+id,
                    {
                        headers: {Accept: 'application/json',
                        Authorization: "Bearer "+token
                    }
                    })
                        .then(function (response) {
                            const newData = data.filter((item) => item.id != id);
                            setFilterdata(newData);
                            setData(newData);
                            loaddata();
                            //setLoading(false);
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


    const hostelfoor = (item) => (
        <>
        <TouchableOpacity style={{backgroundColor: `${active == item.id ? `#1782b6` : `#fff` }`, borderRadius: 30, marginTop: 10, marginRight: 20}}
        onPress={()=> {
            checkclassselected(item.id);
        }}
        >
        <List.Item
            title={item?.name}
            titleStyle={{color: `${active == item.id ? `#fff` : `#000` }`}}
            titleEllipsizeMode="middle"/>
        </TouchableOpacity>
        </>
    );

    const searchFilterclassFunction = (text) => {
        
        if (text) {
            if(text == "All"){

              setFilterdata(data);

            }else{
              const newData = data.filter(item => item.currentlevel == text);
              setFilterdata(newData);
            }
          //setSearch(text);
        } else {
          setFilterdata(data);
          //setSearch(text);
        }
  };

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
         options={{
          headerTitle: 'Hostels'
         }}
        />

       <Searchbar
            placeholder='Search....'
            mode="outlined"
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
        />

        <View>
           <FlatList
                data={floor}
                renderItem={({item})=> hostelfoor(item) }
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 10,
                }}
                keyExtractor={item => item.id}
                horizontal
            />
        </View>

        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loaddata} />
        }
        >
                <Card>
                <Card.Content>
                <FlatList
                    data={filterdata}
                    renderItem={({item})=> <Hostellist item={item} deletedata={deletedata} studentclasslist={studentclass} /> }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
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

export default Hostel;

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