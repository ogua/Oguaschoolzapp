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
import { LocaleConfig, Calendar } from "react-native-calendars";
import DropDownPicker from 'react-native-dropdown-picker';
import { selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';
import Recordstaffattendancelist from '../../../lists/Recordstaffattendancelist';



function Staffpayroll () {

    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);


    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);
    const [attdate, setattdate] = useState("");


    const [openmonth, setOpenmonth] = useState(false);
    const [month, setmonth] = useState("");
    const [listmonth, setlistmonth] = useState([
        {label: 'January', value: 1},
        {label: 'February', value: 2},
        {label: 'March', value: 3},
        {label: 'April', value:4},
        {label: 'May', value: 5},
        {label: 'June', value: 6},
        {label: 'July', value: 7},
        {label: 'August', value: 8},
        {label: 'September', value: 9},
        {label: 'October', value: 10},
        {label: 'November', value: 11},
        {label: 'December', value: 12}
    ]);

    

    const [openstaffrole, setOpenstaffrole] = useState(false);
    const [staffrole, setstaffrole] = useState(null);
    const [liststaffrole, setliststaffrole] = useState([
        {label: 'January', value: 1},
        {label: 'February', value: 2},
        {label: 'March', value: 3},
        {label: 'April', value:4},
        {label: 'May', value: 5},
        {label: 'June', value: 6},
        {label: 'July', value: 7},
        {label: 'August', value: 8},
        {label: 'September', value: 9},
        {label: 'October', value: 10},
        {label: 'November', value: 11},
        {label: 'December', value: 12},
        
    ]);

    const [payyear, setpayyear] = useState("");

    const recordpayroll = () => {

        if(payyear == ""){
            return;
        }

        if(month == ""){
            return;
        }

        router.push('/admin/staff/record-payroll?month='+month+"&year="+payyear);
    }


    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen options={{
            headerTitle: 'Record Payroll'
        }}
        />
        <ScrollView>
            <Card>
                <Card.Content>

                

       <Text style={{fontSize: 15, fontWeight: 500}}>Pay Month</Text>
              <DropDownPicker
                    open={openmonth}
                    value={month}
                    items={listmonth}
                    setOpen={setOpenmonth}
                    setValue={setmonth}
                    setItems={setlistmonth}
                    placeholder={""}
                    placeholderStyle={{
                        color: "#456A5A",
                    }}
                    listMode="MODAL"
                    dropDownContainerStyle={{
                        borderWidth: 0,
                        borderRadius: 30,
                        backgroundColor: "#fff"
                    }}
                    labelStyle={{
                        color: "#456A5A",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 40,
                        marginBottom: 20
                    }}
                    /> 


     <Text style={{fontSize: 15, fontWeight: 500}}>Payment Year eg.2023</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={payyear}
        onChangeText={(e) => setpayyear(e)}
        />

        <Button mode="contained" onPress={recordpayroll} style={{marginTop: 20}}>Record Payroll</Button>
                

                </Card.Content>
            </Card> 

        </ScrollView>
      </SafeAreaView>
      </Provider>
    )
}

export default Staffpayroll;

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
