import React, { Component } from 'react'
import { Stack, useRouter } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert, Dimensions} from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, Divider } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import Incomeexpenslist from '../../../lists/Incomeexpenselist';
import Incomeexpensetypelist from '../../../lists/incomeexpensetype';

function Incomeexpensecategory () {

    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [exsearch, setexSearch] = useState();
    
    const [isloading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const [showdialog, setShowdialog] = useState(false);
    const showDialog = () => setShowdialog(true);
    const hideDialog = () => setShowdialog(false);
    const [showsnakbar, setShowsnakbar] = useState(false);

    const [exdata, setexData] = useState([]);
    const [filterexdata, setexFilterdata] = useState([]);

    const SCREEN_HEIGHT = Dimensions.get("window").height;

    useEffect(()=> {
      
      DeviceEventEmitter.addListener("subject.added", (event)=>{
        console.log('how many time');
        loaddata();
        DeviceEventEmitter.removeAllListeners("event.test");
      });

       loaddata();

    },[]);

    function getincome() {
      return axios.get(schoolzapi+'/income',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      });
   }

   function getexpense() {
    return axios.get(schoolzapi+'/expense',
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    });
 }


    const loaddata = () => {
        setLoading(true);
          Promise.all([getincome(), getexpense()])
          .then(function (response) {

            const inc = response[0];
            const exp = response[1];
           
            setData(inc.data.data);
            setFilterdata(inc.data.data);

            setexData(exp.data.data);
            setexFilterdata(exp.data.data);


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
                    axios.delete(schoolzapi+'/expense/'+id,
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


    const deletedataex = (id,delname) => {

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
                  axios.delete(schoolzapi+'/expense/'+id,
                  {
                      headers: {Accept: 'application/json',
                      Authorization: "Bearer "+token
                  }
                  })
                      .then(function (response) {
                          const newData = exdata.filter((item) => item.id != id);
                          setexFilterdata(newData);
                          setexData(newData);
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
              const itemData = item.title
                ? item.title.toUpperCase()
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


      const searchExFilterFunction = (text) => {
  
        if (text) {
            
          const newData = exdata.filter(function (item) {
            const itemData = item.title
              ? item.title.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setexFilterdata(newData);
          setexSearch(text);
        } else {
          setexFilterdata(exdata);
          setexSearch(text);
        }
    };

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen options={{
            headerTitle: 'Category',
            headerLeft: () => (
              <>
                <TouchableOpacity onPress={() => router.back()} style={{marginHorizontal: 10}}>
                  <Ionicons name="close-circle" size={30} />
                </TouchableOpacity>
              </>
            )
        }}/>
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loaddata} />
        }
        >
        {isloading ? null : (
           <View style={{marginVertical: 10}}>
                <View style={{flexDirection: 'row',justifyContent: "flex-end", alignItems: 'center'}}>
                    <Ionicons name='add-circle' size={22} color="#17a2b8"/>
                    <Button onPress={() => router.push('/admin/Accounts/income-expense-cat')}>Income Expense Category</Button>
                </View>
            </View>)}

            
            
            <Card>
                <Card.Content>

                <View style={{height: SCREEN_HEIGHT/2}}>

                 <Searchbar
                    placeholder='Search Expenses'
                    mode="view"
                    onChangeText={(text) => searchExFilterFunction(text)}
                    value={exsearch}
                />
                <FlatList
                    data={filterexdata}
                    renderItem={({item})=> <Incomeexpensetypelist item={item} deletedata={deletedataex} /> }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                         marginBottom: 10
                    }}
                    keyExtractor={item => item.id}
                />
                </View>

                <Divider bold={true} style={{marginVertical: 30}} />

                <Searchbar
                    placeholder='Search Income'
                    mode="view"
                    onChangeText={(text) => searchFilterFunction(text)}
                    value={search}
                />
                <FlatList
                    data={filterdata}
                    renderItem={({item})=> <Incomeexpensetypelist item={item} deletedata={deletedata} /> }
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

export default Incomeexpensecategory;

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
