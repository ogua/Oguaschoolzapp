import React, { Component } from 'react'
import { Stack, useRouter } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert } from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, ActivityIndicator } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { schoolzapi } from '../constants';
import { selectstaffrole, selecttoken } from '../../features/userinfoSlice';
import Routelist from '../../lists/Routelist';
import Routetracklist from '../../lists/Routetracklist';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { setDestination, setHeading, setOrigin } from '../../features/examSlice';


function Trackroute () {

    const token = useSelector(selecttoken);
    const role = useSelector(selectstaffrole);
    const dispatch = useDispatch();
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const [showdialog, setShowdialog] = useState(false);
    const showDialog = () => setShowdialog(true);
    const hideDialog = () => setShowdialog(false);
    const [showsnakbar, setShowsnakbar] = useState(false);
    const [location,setLocation] = useState("");
    const [errorMsg,setErrorMsg] = useState("");
    const driver = useSelector(selectstaffrole);
    
    useEffect(() => {

      (async () => {
        
        let { status } = await Location.requestBackgroundPermissionsAsync();

        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
        });

        initail();

      })();

    }, []);

    function initail(){

      TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
          if (error) {
            // Error occurred - check `error.message` for more details.
            alert('Something went wrong with background locations');
            return;
          }
          if (data) {
            const { locations } = data;
           // console.log("locations",locations[0].coords);
           if(role == "Driver"){

              dispatch(setOrigin({latitude: locations[0].coords.latitude,longitude: locations[0].coords.longitude}));

              dispatch(setHeading( locations[0].coords.heading));


           }else{
              dispatch(setDestination({latitude: locations[0].coords.latitude,longitude: locations[0].coords.longitude}));
           }
          }
        });

    }



    useEffect(()=> {
      
      // DeviceEventEmitter.addListener("subject.added", (event)=>{
      //   console.log('how many time');
      //   loaddata();
      //   DeviceEventEmitter.removeAllListeners("event.test");
      // });

       loaddata();

    },[]);

    let text = '';
    if (errorMsg) {
      text = errorMsg;
    }


    const loaddata = () => {

        setLoading(true);
        axios.get(schoolzapi+'/routes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            console.log(response.data.data);
            setData(response.data.data);
            setFilterdata(response.data.data);
            setLoading(false);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error.response);
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
                    axios.delete(schoolzapi+'/routes/'+id,
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
              const itemData = item.name
                ? item.name.toUpperCase()
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

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen options={{
            headerTitle: 'Track School Bus',
            headerRight: () => (
              <>
                <TouchableOpacity onPress={loaddata} style={{marginRight: 20}}>
                  <Ionicons name="refresh" size={30} />
                </TouchableOpacity>
              </>
            )
        }}
        />
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loaddata} />
        }
        >

            <Searchbar
                placeholder='Search....'
                mode="outlined"
                onChangeText={(text) => searchFilterFunction(text)}
                value={search}
            />
            
            <Card>
                <Card.Content>
                  
                  <FlatList
                    data={filterdata}
                    renderItem={({item})=> <Routetracklist item={item} deletedata={deletedata} location={location} driver={driver} /> }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                         marginBottom: 20
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

export default Trackroute;

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