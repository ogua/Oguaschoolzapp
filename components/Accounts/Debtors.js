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
import { selectcurrency, selecttoken } from '../../features/userinfoSlice';
import Visitorslist from '../../lists/Visitorslist';
import Studentlist from '../../lists/Studentlist';
import Normallist from '../../lists/Normallist';
import Dispatchedfeelist from '../../lists/Dispatchedfeelist';

function Debtors () {

    const token = useSelector(selecttoken);
    const currency = useSelector(selectcurrency);
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
    const [total, settotal] = useState("0.00");

    useEffect(()=> {
      
      // DeviceEventEmitter.addListener("subject.added", (event)=>{
      //   loaddata();
      //   DeviceEventEmitter.removeAllListeners("event.test");
      // });

       loaddata();

    },[]);

    function getUserAccount() {

        return axios.get(schoolzapi+'/students-owing-fees',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }
      
      function getstudentclass() {

        return axios.get(schoolzapi+'/student-classes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }


    const loaddata = () => {
        setLoading(true);
        
        Promise.all([getUserAccount(), getstudentclass()])
        .then(function (results) {
            setLoading(false);
            const acct = results[0];
            const studeclass = results[1];

            setData(acct.data.data);
            setFilterdata(acct.data.data);
            setStudentclass(studeclass.data.data);

            const datas = acct.data.data;
            const owe = datas.reduce((owe,crval) => owe = owe + crval.owed, 0);

            console.log("owe",owe);
            settotal(owe);



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
                    axios.delete(schoolzapi+'/fees-dispacted/'+id,
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
              const itemData = item.studentname
                ? item.studentname.toUpperCase()
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
            titleStyle={{color: `${active == item.id ? `#fff` : `#000` }`}}
            titleEllipsizeMode="middle"/>
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
      <SafeAreaView style={{flexGrow: 1}}>
        <Stack.Screen
        options={{
            headerTitle: 'Debtors',
            // headerRight: () => (
            //   <Text>Owings {currency} {total}.00</Text>
            // )
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
                data={studentclass}
                renderItem={({item})=> stclasslist(item) }
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
                    renderItem={({item})=> <Dispatchedfeelist item={item} deletedata={deletedata} studentclasslist={studentclass} /> }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                        marginBottom: 200
                    }}
                    keyExtractor={item => item.id}
                />
                </Card.Content>
            </Card> 
        </ScrollView>
        {/* <View style={{position: 'absolute', bottom: 40, left: 20,zIndex: 1000}}>
            <Button mode="contained">Total Owings {currency} {total}.00</Button>       
        </View> */}
      </SafeAreaView>
      </Provider>
    )
}

export default Debtors;

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