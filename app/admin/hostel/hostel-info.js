import React, { Component } from 'react'
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert } from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';
import Hostellist from '../../../lists/hostellist';
import Hostelroomslist from '../../../lists/Hostelrooms';

function HostelInfo () {

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
    const [hostelname, sethostelname] = useState("");
    const [hostelid, sethostelid] = useState("");
    const {id} = useSearchParams();

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
        
        axios.get(schoolzapi+'/hostel/show/'+id,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (results) {
            setLoading(false);

            setData(results.data.data.rooms);
            setFilterdata(results.data.data.rooms);
            sethostelname(results.data.data.name);
            sethostelid(results.data.data.id);

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
                    axios.delete(schoolzapi+'/hostel-rooms/'+id,
                    {
                        headers: {Accept: 'application/json',
                        Authorization: "Bearer "+token
                    }
                    })
                        .then(function (response) {
                            const newData = data.filter((item) => item.id != id);
                            setFilterdata(newData);
                            setData(newData);
                           // loaddata();
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
              const itemData = item.floor
                ? item.floor.toUpperCase()
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
        <TouchableOpacity style={{backgroundColor: `${active == item.name ? `#1782b6` : `#fff` }`, borderRadius: 30, marginTop: 10, marginRight: 20}}
        onPress={()=> {
            checkclassselected(item.name);
        }}
        >
        <List.Item
            title={item?.name}
            titleStyle={{color: `${active == item.name ? `#fff` : `#000` }`}}
            titleEllipsizeMode="middle"/>
        </TouchableOpacity>
        </>
    );

    const searchFilterclassFunction = (text) => {
        
        if (text) {
            if(text == "All"){

              setFilterdata(data);

            }else{
              const newData = data.filter(item => item.floor == text);
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
          headerTitle: hostelname,
          headerLeft: () => (
            <>
              <TouchableOpacity onPress={() => router.back()} style={{marginRight: 15}}>
                <Ionicons name="close-circle-outline" size={30} />
              </TouchableOpacity>
            </>
          ),
          headerRight: () => (
            <View>
                 <View style={{flexDirection: 'row',justifyContent: 'flex-end', marginHorizontal: 20}}>
                     <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.push('/admin/hostel/create-edit-hostel-room?hosid='+hostelid)}>
                         <Ionicons name='add-circle' size={22} color="#17a2b8"/>
                         <Text style={{fontSize: 18}}>New</Text> 
                     </TouchableOpacity>
                 </View>
             </View>
        )
         }}
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
                    renderItem={({item})=> <Hostelroomslist item={item} deletedata={deletedata} studentclasslist={studentclass} hostelid={id} /> }
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

export default HostelInfo;

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