import React, { Component } from 'react'
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter, Alert, Dimensions, KeyboardAvoidingView, ToastAndroid, ActivityIndicator } from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, Avatar, Divider, TextInput } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { selectaccstatus, selectcurrency, selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';
import Feemasterlist from '../../../lists/Feemasterlist';
import Payfeelist from '../../../lists/Payfeelist';
import { showMessage } from "react-native-flash-message";

function Recordfee () {

    const token = useSelector(selecttoken);
    const currency = useSelector(selectcurrency);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [ispaying, setpaying] = useState(false);
    const [student, setstudent] = useState(null);
    const [fee, setfee] = useState(null);
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const [showdialog, setShowdialog] = useState(false);
    const showDialog = () => setShowdialog(true);
    const hideDialog = () => setShowdialog(false);
    const [showsnakbar, setShowsnakbar] = useState(false);
    const {studentid,studentname} = useSearchParams();
    const SCREEN_HEIGHT = Dimensions.get("window").height;
    const [feeisloading, setfeeisloading] = useState(false);
    const accnt = useSelector(selectaccstatus);
    const [paynow, setpaynow] = useState("");

    

    useEffect(()=> {

        DeviceEventEmitter.addListener("subject.added", (event)=>{
         loaddata();
         DeviceEventEmitter.removeAllListeners("event.test");
        });

       loaddata();
    },[]);


    function getstudentinfo() {

        return axios.get(schoolzapi+'/student-info-by-studentid/'+studentid,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }

      function getschoolfees() {

        return axios.get(schoolzapi+'/student-schoolfee-info/'+studentid,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }


     const reloadfees = () => {
      loaddata();
     }


    const loaddata = () => {
        setLoading(true);
          Promise.all([getstudentinfo(), getschoolfees()])
          .then(function (response) {

            const student = response[0];
            const fee = response[1];

          
            setstudent(student.data.data);
            setfee(fee.data.data);

            console.log("student",student.data.data);
            console.log("fee",fee.data.data);

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
                    setfeeisloading(true);
                    axios.delete(schoolzapi+'/fees-dispacted/'+id,
                    {
                        headers: {Accept: 'application/json',
                        Authorization: "Bearer "+token
                    }
                    })
                        .then(function (response) {
                            const newData = fee.filter((item) => item.id != id);
                            setfee(newData);
                            setLoading(false);
                            setfeeisloading(false);
                        })
                        .catch(function (error) {
                        setLoading(false);
                        setfeeisloading(false);
                        console.log(error);
                        });
                },
              },
            ]
          );
    }


    const payfees = (id,paying,delname) => {

        if(paying == ""){
            return;
        }

        return Alert.alert(
            "Are your sure?",
            "Pay "+currency+paying+" For "+delname,
            [
              {
                text: "No",
              },
              {
                text: "Yes Pay",
                onPress: () => {
                  setpaying(true);
                    const formdata = {
                        id: id,
                        payfee: paying
                    }
                    axios.post(schoolzapi+'/student-pay-fee',
                    formdata,
                    {
                        headers: {Accept: 'application/json',
                        Authorization: "Bearer "+token
                    }
                    })
                        .then(function (response) {
                            if( response.data.error !== undefined){
                                alert(response.data.error);
                            }else{

                              showMessage({
                                message: response.data.data,
                                type: "success",
                                position: 'bottom',
                              });

                               loaddata();
                            }

                            setpaynow("");
                            setpaying(false);
                        })
                        .catch(function (error) {
                        setpaying(false);
                        console.log(error);
                        });
                },
              },
            ]
          );
    }

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen options={{
            headerTitle: 'Record Fee'
        }}
        />
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loaddata} />
        }
        >
            <Card>
                <Card.Content>

                {isloading ? null : (
                  <>

               
                <View style={{height: SCREEN_HEIGHT/2, alignItems: 'center'}}>

                    <Avatar.Image
                        source={{uri: student?.pic}}
                            size={120}
                    />

                    <Text style={{marginTop: 10}}>{student?.fullname}</Text>
                    <Text style={{marginTop: 10}}>{student?.stclass} - ({student?.student_id}) </Text>
                    {student?.paystatus != null && (
                      <>
                      <Text style={{marginTop: 10, color: '#28a745'}}>{student?.paystatus}</Text>
                      </>
                    )}
                    
                    
                    <View>
                        <Button onPress={()=> router.push(`/admin/Accounts/transaction-per-student?studentid=${student?.student_id}`)}>Transaction</Button>
                        {accnt == '0' && (
                          <>
                          <Button onPress={()=> router.push(`/admin/Accounts/request-student-fee?id=${student?.id}`)}>Request Fee</Button>
                           <Button onPress={()=> router.push(`/admin/Accounts/fetch-termly-fee?id=${student?.id}&studentname=${student?.fullname}`)}>Fetch For This Term</Button>
                          </>
                        )}
                    </View>

                </View>

                {accnt != "0" ? (
                  <>
                  <View style={{backgroundColor: '#fff', padding: 10, marginBottom: 20, borderRadius: 30}}>
                          
                          {/* <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15}}>
                              <TouchableOpacity style={{marginRight: 20}} onPress={()=> router.push(`/admin/Accounts/edit-dispatched?id=${item?.id}`)}>
                                  <Ionicons name="pencil-sharp" size={20} />
                              </TouchableOpacity>

                              <TouchableOpacity onPress={() => deletedata(item?.id,item?.fee)} style={{marginRight: 20}}>
                                  <Ionicons name="trash-bin-sharp" color="red" size={20} />
                              </TouchableOpacity>
                          </View> */}

                            {fee == "" ? (
                              <>
                              <Text style={{fontSize: 25, fontWeight: 500, alignItems: 'center'}}>No Records Found !</Text>
                              </>
                            ) : (
                              <>
                              

                              <View>
                                  <Text style={{fontSize: 13,marginLeft: 30}}> Fee Amount: {fee?.totalamount}</Text>
                                  <Divider bold={true} style={{marginVertical: 10}} />
                                  <Text style={{fontSize: 13,marginLeft: 30}}>Paid: {fee?.paid}</Text>
                                  <Divider bold={true} style={{marginVertical: 10}} />
                                  <Text style={{fontSize: 13,marginLeft: 30}}>Owe: {fee?.owe}</Text>
                              </View>
                              <View style={{marginTop: 10}}>
                                  <TextInput
                                    label="Payable"
                                    keyboardType="numeric"
                                    mode="outlined"
                                      value={paynow}
                                      onChangeText={(e) => setpaynow(e)}
                                  />

                                  {ispaying ? <ActivityIndicator size="large" /> : (
                                      <Button mode="text" onPress={() => payfees(fee?.id,paynow,fee?.fee)} style={{marginTop: 10}}>Pay</Button>
                                  )}
                                  
                              </View>

                              </>
                            )}
                          </View>
                  
                  </>
                ) : (
                  <>

                <FlatList
                    data={fee}
                    renderItem={({item})=> <Payfeelist item={item} reloadfees={reloadfees} deletedata={deletedata} payfees={payfees} feeisloading={feeisloading}/> }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                         marginBottom: 10
                    }}
                    keyExtractor={item => item.id}
                />
                  </>
                )}      
                

             </>
                )}

                </Card.Content>
            </Card> 

        </ScrollView>
      </SafeAreaView>
      </Provider>
    )
}

export default Recordfee;

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
