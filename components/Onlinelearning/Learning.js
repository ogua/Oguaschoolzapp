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
import Routelist from '../../lists/Routelist';
import YoutubeIframe from 'react-native-youtube-iframe';
import Elearninglist from '../../lists/elearninglist';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


function Onlinelearning () {

    const token = useSelector(selecttoken);
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

    const SCREEN_HEIGHT = Dimensions.get("window").height;
    const SCREEN_WIDTH = Dimensions.get("window").width;
    const [videoid, setvideoid] = useState("");
    

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
                           // loaddata();
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

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen options={{
            headerTitle: 'Online Learning',
            headerRight: () => (
                <View>
                     <View style={{flexDirection: 'row',justifyContent: 'flex-end', marginHorizontal: 20}}>
                         <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.push('/admin/elearning/create-edit-e-learning')}>
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


            {videoid && (

            <YoutubeIframe
            height={200}
            width={SCREEN_WIDTH}
            play={playing}
            videoId={videoid}
            onChangeState={onStateChange}
            style={{backgroundColor: '#000'}}
            />

            )}

        
            </View>
            
            <Card>
                <Card.Content>
            
                <FlatList
                    data={filterdata}
                    renderItem={({item})=> <Elearninglist item={item} deletedata={deletedata} setvideoid={setplayervideoid} /> }
                    //ItemSeparatorComponent={()=> <View style={styles.separator} />}
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

export default Onlinelearning;

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
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ccc',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30
  },
});