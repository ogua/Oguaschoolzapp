import React, { Component } from 'react'
import { Stack, useRouter } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert, TextInput} from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { schoolzapi } from '../constants';
import { selectcurrency, selecttoken } from '../../features/userinfoSlice';
import Transactionlist from '../../lists/Transactionlist';
import { useRef } from 'react';

function Transactionspermonth () {

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
    const fromdate = useRef();

    const [txtfromdate, settxtfromdate] = useState("");
    const [txttodate, settxttodate] = useState("");

    useEffect(()=> {
       loaddata();
    },[]);


    const loaddata = () => {
        setLoading(true);
        
        axios.get(schoolzapi+'/all-transaction-per-month',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (results) {

            setData(results.data.data);
            setFilterdata(results.data.data);
            const data = results.data.data;
            const total = data.reduce((total,crval) => total = total + crval.amountpaid,0);
            settotal(total);

            setLoading(false);

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


    const revertfee = (id,stdntid,amount) => {

      return Alert.alert(
          "Are your sure?",
          `You want to revert an amount of ${amount}`,
          [
            {
              text: "No",
            },
            {
              text: "Yes Revert",
              onPress: () => {
                  setLoading(true);

                  const formdata = {
                    id,
                    stdntid
                  }

                  axios.post(schoolzapi+'/revert-fees-paid',
                  formdata,
                  {
                      headers: {Accept: 'application/json',
                      Authorization: "Bearer "+token
                  }
                  })
                      .then(function (response) {

                          if(response.data.error){

                            alert(response.data.error);

                          }else{

                            const newData = data.filter((item) => item.id != id);
                            setFilterdata(newData);
                            setData(newData);
                            //loaddata();
                            setLoading(false);

                          }

                          
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


  const refreshdata = () => {
    loaddata();
  }


  const generatetransaction = () => {
    Alert('working');
  }


    return (
      <Provider>
      <SafeAreaView style={{flexGrow: 1}}>
        <Stack.Screen
        options={{
            headerTitle: 'Transactions per month',
            headerRight: () => (
              <TouchableOpacity onPress={refreshdata}>
                    <Ionicons name="refresh" size={30} style={{marginRight: 10}} />
              </TouchableOpacity>
          ),
           }}
        />

        <ScrollView
        style={{marginBottom: 40}}
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
                    renderItem={({item})=> <Transactionlist revertfee={revertfee} item={item} deletedata={deletedata} studentclasslist={studentclass} /> }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                        marginBottom: 200
                    }}
                    keyExtractor={item => item.id}
                />
                </Card.Content>
            </Card> 

        </ScrollView>
        <View style={{position: 'absolute', bottom: 20, left: 20}}>
            <Button mode="contained">Total {currency} {total}.00</Button>       
        </View>
      </SafeAreaView>
      </Provider>
    )
}

export default Transactionspermonth;

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