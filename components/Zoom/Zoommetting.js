import React, { Component, useCallback } from 'react'
import { Stack, useRouter } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert, Dimensions } from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { schoolzapi } from '../constants';
import { selecttoken } from '../../features/userinfoSlice';
import Elearninglist from '../../lists/elearninglist';
import ZoomUs from "react-native-zoom-us";
import Zoom from './Zoom';


function Zoommeetings () {

    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const [showdialog, setShowdialog] = useState(false);
    const showDialog = () => setShowdialog(true);
    const hideDialog = () => setShowdialog(false);
    const [showsnakbar, setShowsnakbar] = useState(false);

    const SCREEN_HEIGHT = Dimensions.get("window").height;
    const SCREEN_WIDTH = Dimensions.get("window").width;
    const [videoid, setvideoid] = useState("");

    

    // useEffect(()=> {
      
    //   DeviceEventEmitter.addListener("subject.added", (event)=>{
    //     console.log('how many time');
    //     loaddata();
    //     DeviceEventEmitter.removeAllListeners("event.test");
    //   });

    // },[]);


    const loaddata = () => {
        setLoading(true);
        axios.get(schoolzapi+'/online-learning',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            console.log(response.data.data);
            setData(response.data.data);
            setFilterdata(response.data.data);
            setvideoid(data[0].linkid);
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
                    axios.delete(schoolzapi+'/online-learning/'+id,
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



        const [playing, setPlaying] = useState(false);

        const onStateChange = useCallback((state) => {
            if (state === "ended") {
            setPlaying(false);
             alert("video has finished playing!");
            }
        }, []);

        const togglePlaying = useCallback(() => {
            setPlaying((prev) => !prev);
        }, []);


        const setplayervideoid = (vid) => {
            setvideoid(vid);
            console.log(vid);
        }

        // https://us04web.zoom.us/j/73982275063?pwd=VVuxLevqmy73bJTO0Gv9RQF9rmD9D6.1

        const joinAMeeting = async() => {
            const meeting = await ZoomUs.joinMeeting({
              userName: 'Ogua Ahmed',
              meetingNumber: 73982275063,
              password: VVuxLevqmy73bJTO0Gv9RQF9rmD9D6
            });
          
            console.log('meetng joined ', meeting);
          };

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen options={{
            headerTitle: 'Zoom Meetings',
            headerRight: () => (
                <View>
                     <View style={{flexDirection: 'row',justifyContent: 'flex-end', marginHorizontal: 20}}>
                         <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.push('/admin/transport/create-edit-routes')}>
                             <Ionicons name='add-circle' size={22} color="#17a2b8"/>
                             <Text style={{fontSize: 18}}>New</Text> 
                         </TouchableOpacity>
                     </View>
                 </View>
            )
        }}
        />

        


        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loaddata} />
        }
        >
            <View style={{flex: 1, justifyContent: 'center'}}>
               <Zoom />
            </View>
            
            <Card>
                <Card.Content>
                <FlatList
                    data={filterdata}
                    renderItem={({item})=> <Elearninglist item={item} deletedata={deletedata} setvideoid={setplayervideoid} /> }
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

export default Zoommeetings;

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