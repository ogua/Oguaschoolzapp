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
import * as Imagepicker from 'expo-image-picker';
import { showMessage } from "react-native-flash-message";
import { selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';
import Staffleavelist from '../../../lists/Staffleavelist';
import Payrollgeneratelist from '../../../lists/Payrollgeneratelist';

function Recordpayroll () {

    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const [staffleavestatus, setstaffleavestatus] = useState([
        {id: 'Part Time Teacher', value: 'Part Time Teacher'},
        {id: 'Full Time Teacher', value: 'Full Time Teacher'},
        {id: 'Co-ordinator', value: 'Co-ordinator'},
        {id: 'Head Teacher', value: 'Head Teacher'},
        {id: 'Supporting Staff - Office Attendance', value: 'Supporting Staff - Office Attendance'},
        {id: 'Supporting Staff - Cook', value: 'Supporting Staff - Cook'},
        {id: 'Supporting Staff - Cleaner', value: 'Supporting Staff - Cleaner'},
        {id: 'Security', value: 'Security'},
        {id: 'Supervisor', value: 'Supervisor'},
        {id: 'Counselor', value: 'Counselor'},
        {id: 'Driver', value: 'Driver'},
        {id: 'Others', value: 'Others'},
        {id: 'Owner', value: 'Owner'}
    ]);

    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const [showdialog, setShowdialog] = useState(false);
    const showDialog = () => setShowdialog(true);
    const hideDialog = () => setShowdialog(false);
    const [showsnakbar, setShowsnakbar] = useState(false);
    const [active, setActive] = useState("0");
    const {month,year} = useSearchParams();

    useEffect(()=> {
      
      DeviceEventEmitter.addListener("subject.added", (event)=>{
        loaddata();
        DeviceEventEmitter.removeAllListeners("event.test");
      });

       loaddata();

    },[]);


    const loaddata = () => {
        setLoading(true);
        
        axios.get(schoolzapi+'/record-staff-payroll/'+month+"/"+year,
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
                    axios.delete(schoolzapi+'/staff-leave/'+id,
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


    const leaveapproval = (id,leavetatus,note) => {

      return Alert.alert(
          "Are your sure?",
          "Are you sure you want to proceed",
          [
            {
              text: "No",
            },
            {
              text: "Yes Proceed",
              onPress: () => {
                  setLoading(true);

                  const formdata = {
                    id,leavetatus,note
                  }
                  axios.post(schoolzapi+'/staff-approve-leave',
                  formdata,
                  {
                      headers: {Accept: 'application/json',
                      Authorization: "Bearer "+token
                  }
                  })
                      .then(function (response) {
                          
                          setLoading(false);

                          showMessage({
                            message: 'Info updated Successfully!',
                            type: "success",
                            position: 'bottom',
                          });

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


    const checkstatusselected = (id) => {

      if(active == id){
        setActive("All");
        searchFilterclassFunction("All");
      }else{
        setActive(id);
        searchFilterclassFunction(id);
      }
    }


    const searchFilterclassFunction = (text) => {
        
      if (text) {
          setLoading(true);
          if(text == "All"){

            setFilterdata(data);

          }else{
            const newData = data.filter(item => item.role == text);
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

    const leavestatus = (item) => (
        <>
        <TouchableOpacity style={{backgroundColor: `${active == item.id ? `#1782b6` : `#fff` }`, borderRadius: 30, marginTop: 10, marginRight: 20}}
        onPress={()=> {
            checkstatusselected(item.id);
        }}
        >
        <List.Item
            title={item?.value}
            titleStyle={{color: `${active == item.id ? `#fff` : `#000` }`,fontSize: 12}}
            titleEllipsizeMode="tail"/>
        </TouchableOpacity>
        </>
    );

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
        options={{
            headerTitle: 'Generate Payroll',
            headerLeft: () => (
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.back()}>
                        <Ionicons name="close-circle" size={30} />
                    </TouchableOpacity>
            )
           }}
        />

        <View>
           <FlatList
                data={staffleavestatus}
                renderItem={({item})=> leavestatus(item) }
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 10,
                }}
                keyExtractor={item => item.id}
                horizontal
            />
        </View>

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
                    renderItem={({item})=> <Payrollgeneratelist item={item} month={month} year={year} /> }
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

export default Recordpayroll;

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