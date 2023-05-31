import React, { Component } from 'react'
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert } from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, Checkbox, ActivityIndicator, Divider } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { showMessage } from "react-native-flash-message";
import { selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';


function Permissions () {

    const token = useSelector(selecttoken);
    const [data, setData] = useState([]);
    const [permission, setpermission] = useState([]);
    const [expanded, setExpanded] =useState(true);

    const [Loading, setLoading] = useState(false);
    const [submitting, setsubmitting] = useState(false);
    const handlePress = () => setExpanded(!expanded);

    const router = useRouter();
    const {userid} = useSearchParams();


    console.log("re redering...............");
    
    useEffect(()=> {

      loaddata();

    },[]);


    const loaddata = () => {
        setLoading(true);
        
        axios.get(schoolzapi+'/staff-permission/'+userid,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (results) {
            setLoading(false);

            setData(results.data.data);
            setpermission(results.data.permission);

        }).catch(function(error){
            setLoading(false);
            console.log(error);
            
        });
    }

    const addpermission =  (data) => {

        if(permission.includes(`${data}`)){
            console.log("removing");
            const Items = permission.filter(item => item !== data);
            setpermission(Items);

        }else{
            console.log("adding");
            setpermission([...permission,data]);
        }

        
        console.log("permission",permission.length);

    }



    const savedata = () => {


        setsubmitting(true);

        const formdata = {
            userid,
            permissions: permission
        }

        axios.post(schoolzapi+'/save-staff-permission',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            setsubmitting(false);

            showMessage({
              message: 'Permissions recorded Successfully!',
              type: "success",
              position: 'bottom',
            });
            
          })
          .catch(function (error) {
            setsubmitting(false);
            console.log(error.response);
          });
    }
   

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
        options={{
            headerTitle: 'Permissions',
            headerLeft: () => (
                    <TouchableOpacity style={{flexDirection: 'row', marginRight: 10}} onPress={()=> router.back()}>
                        <Ionicons name="close-circle" size={30} />
                    </TouchableOpacity>
            )
           }}
        />
        

        <ScrollView
         refreshControl={
            <RefreshControl refreshing={false} onRefresh={loaddata} />
          }
        > 
            <Card>
                <Card.Content>
                    
                    {Loading ? <ActivityIndicator size="large" /> : (
                    <>
                    <View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>V: View</Text>
                            <Text>E: Edit</Text>
                            <Text>C: Create</Text>
                            <Text>D: Delete</Text>
                        </View>
                        {data.map((item,index) => (
                            <>
                            <View style={{marginTop: 20}}>
                                <Text style={{backgroundColor: '#17a2b8',color: '#fff', padding: 10}}>{item.mname}</Text>  
                                <View style={{flexDirection: 'row'}}>
                                    <Checkbox.Item label="V" status={permission.includes(`view${item.name}`) ? `checked` : `unchecked`}  onPress={()=> addpermission(`view${item.name}`)} />
                                    <Checkbox.Item label="E" status={permission.includes(`edit${item.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`edit${item.name}`)} />
                                    <Checkbox.Item label="C"  status={permission.includes(`create${item.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`create${item.name}`)} />
                                    <Checkbox.Item label="D"  status={permission.includes(`delete${item.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`delete${item.name}`)} />
                                </View>
                            </View>

                            <Divider bold={true} style={{marginVertical: 5}} />

                            {item.submenu.map((submenu,submenuindex) => (
                                <>
                                    <View>
                                        <Text style={{marginLeft: 10}}>{submenu.mname}</Text>  
                                        <View style={{flexDirection: 'row'}}>
                                            <Checkbox.Item label="V" status={permission.includes(`view${submenu.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`view${item.name}`)} />
                                            <Checkbox.Item label="E" status={permission.includes(`edit${submenu.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`edit${item.name}`)} />
                                            <Checkbox.Item label="C" status={permission.includes(`create${submenu.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`create${item.name}`)} />
                                            <Checkbox.Item label="D" status={permission.includes(`delete${submenu.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`delete${item.name}`)} />
                                        </View>
                                    </View>

                                    <Divider bold={true} style={{marginVertical: 5}} />


                                    {submenu.subsubmenu.map((subsubmenu,subsubmenuindex) => (
                                <>
                                    <View>
                                        <Text style={{marginLeft: 20}}>{subsubmenu.mname}</Text>  
                                        <View style={{flexDirection: 'row'}}>
                                            <Checkbox.Item label="V"  status={permission.includes(`view${subsubmenu.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`view${item.name}`)} />
                                            <Checkbox.Item label="E"  status={permission.includes(`edit${subsubmenu.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`edit${item.name}`)} />
                                            <Checkbox.Item label="C"  status={permission.includes(`create${subsubmenu.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`create${item.name}`)}  />
                                            <Checkbox.Item label="D"  status={permission.includes(`delete${subsubmenu.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`delete${item.name}`)} />
                                        </View>
                                    </View>
                                    <Divider bold={true} style={{marginVertical: 5}} />
                                </>

                            ))}



                                </>

                            ))}
                            
                            </>
                        ))}

                    {submitting ? <ActivityIndicator size="large" style={{marginVertical: 30}} /> : (
                        <Button style={{marginVertical: 30}} onPress={savedata}>Save</Button>
                    )}
                        
                    </View>
                    
                    
                    </>
                    )}

                    
                </Card.Content>
            </Card> 
        </ScrollView>
      </SafeAreaView>
      </Provider>
    )
}

export default React.memo(Permissions);

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