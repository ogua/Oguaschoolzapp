import React, { Component } from 'react'
import { Stack, useRouter } from 'expo-router';
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
import { schoolzapi } from '../constants';
import { selecttoken } from '../../features/userinfoSlice';
import Bookissuedlist from '../../lists/Bookissedlist';
import { LocaleConfig, Calendar } from "react-native-calendars";
import DropDownPicker from 'react-native-dropdown-picker';
import Recordattendancelist from '../../lists/Recordattendancelist';
import Recordstaffattendancelist from '../../lists/Recordstaffattendancelist';
import Allstaffattendancelist from '../../lists/Allstaffattendancelist';
import Payrolllist from '../../lists/Payrolllist';



function Allpayroll () {

    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);


    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);
    const [attdate, setattdate] = useState("");

    const [openstudentclass, setOpenstudentclass] = useState(false);
    const [studentclass, setstudentclass] = useState("");
    const [studentclassitems, setstudentclassItems] = useState([]);

    const [apiresponse, setapiresponse] = useState("");

    const [staffrole, setstaffrole] = useState([
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
    const [active, setActive] = useState("0");
    
    

    useEffect(()=> {

       loaddata();

    },[]);


    const loaddata = () => {
        setLoading(true);
        axios.get(schoolzapi+'/staff-payroll',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            setFilterdata(response.data.data);
            setData(response.data.data);
            setLoading(false);
           
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }


    const searchFilterFunction = (text) => {
  
        if (text) {
            
          const newData = data.filter(function (item) {
            const itemData = item.paymentdate
              ? item.paymentdate.toUpperCase()
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


    const Staffleavelist = (item) => (
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
          const newData = data.filter(item => item?.role == text);
          setFilterdata(newData);
        }
      setLoading(false);
    } else {
        setLoading(true);
      setFilterdata(data);
      setLoading(false);
    }
};

   


    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen options={{
            headerTitle: 'All Payroll'
        }}
        />
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loaddata} />
        }
        >

        <View>
           <FlatList
                data={staffrole}
                renderItem={({item})=> Staffleavelist(item) }
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 10,
                }}
                keyExtractor={item => item.id}
                horizontal
            />
        </View>

             <View style={{flexDirection: 'row',justifyContent: 'flex-end', marginVertical: 20, marginRight: 20}}>
                     <Button  onPress={()=> router.push('/admin/staff/record-staff-payroll')}>Record Payroll</Button>
              </View>


            <Searchbar
                placeholder='Search by date'
                mode="outlined"
                onChangeText={(text) => searchFilterFunction(text)}
                value={search}
            />
            <Card>
                <Card.Content>
                <FlatList
                    data={filterdata}
                    renderItem={({item})=> <Payrolllist item={item}  /> }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                         marginBottom: 10
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

export default Allpayroll;

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
