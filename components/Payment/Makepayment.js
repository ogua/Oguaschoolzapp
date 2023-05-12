import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, Checkbox, TextInput, Dialog, Portal, Provider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import MultiSelect from 'react-native-multiple-select';
import { cos } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { showMessage } from "react-native-flash-message";
import { selecttoken } from '../../features/userinfoSlice';
import { schoolzapi } from '../constants';
import { LocaleConfig, Calendar } from "react-native-calendars";


function Makepayment() {

    const token = useSelector(selecttoken);

    const [openplan, setOpenplan] = useState(false);
    const [plan, setplan] = useState("");
    const [planitems, setplanItems] = useState([]);

    const [openmonth, setOpenmonth] = useState(false);
    const [month, setmonth] = useState("");
    const [monthitems, setmonthItems] = useState([
        {label: '1 month', value: '1month'},
        {label: '2 month', value: '2month'},
        {label: '3 month', value: '3month'},
        {label: '4 month', value: '4month'},
        {label: '5 month', value: '5month'},
        {label: '6 month', value: '6month'},
        {label: '7 month', value: '7month'},
        {label: '8 month', value: '8month'},
        {label: '9 month', value: '9month'},
        {label: '10 month', value: '10month'},
        {label: '11 month', value: '11month'},
        {label: '1 year', value: '1year'},
        {label: '2 years', value: '2years'},
        {label: '3 years', value: '3year'},

    ]);

    
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");
      loaddata();

    },[]);


      
    const loaddata = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/plan',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
      })
      .then(function (results) {
          
        loadplan(results.data.data);
        setLoading(false);

      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }

  const loadplan = (data) => {
            
    const mddatas = data;
    
    let mdata = [];

     mddatas.map(item =>  mdata.push({ label: item?.planpx, value: item?.name}))
    
     setplanItems(mdata);
}

  const oguaschoolzpayment = () => {

    if(plan == ""){
        alert('plan cant be empty');
        return;
    }

    if(month == ""){
        alert('Number Of Months cant be empty');
        return;
    }
      setIssubmitting(true);

      const data = {
        plan,
        months: month
      }

    axios.post(schoolzapi+'/make-payment',
    data,
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    })
      .then(function (response) {
        setIssubmitting(false);

        
        router.push(`/admin/Settings/confirm-payment?current=${response.data.current}&expiry=${response.data.expiry}&month=${response.data.month}&now=${response.data.now}&paying=${response.data.paying}&splan=${response.data.splan}&monthly=${response.data.plan.amount}`);

        // paylink=${response.data.paylink}
        // &paystack=${response.data.paystack}


      })
      .catch(function (error) {
        setIssubmitting(false);
        console.log(error);
      });
}


    return (
    <Provider>
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Make Payment',
                presentation: 'formSheet',
            }}

        />
        <ScrollView style={{marginBottom: 30}}
        >
        <KeyboardAvoidingView
            behavior="height"
            >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>

             <DropDownPicker
                    open={openplan}
                    value={plan}
                    items={planitems}
                    setOpen={setOpenplan}
                    setValue={setplan}
                    setItems={setplanItems}
                    placeholder={"Choose Plan"}
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
                        color: "#000",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 50,
                        marginTop: 10,
                        marginBottom: 20
                    }}
                    />


                <DropDownPicker
                    open={openmonth}
                    value={month}
                    items={monthitems}
                    setOpen={setOpenmonth}
                    setValue={setmonth}
                    setItems={setmonthItems}
                    placeholder={"Number of Months"}
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
                        color: "#000",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 50,
                        marginTop: 10,
                        marginBottom: 20
                    }}
                    />


        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" style={{marginTop: 30}} /> : (
        <Button icon="mail" mode="contained" onPress={oguaschoolzpayment} style={{marginTop: 30}}>
        Make Payment
        </Button>
        )}

       </Card.Content>
        </Card>
        )}
        </KeyboardAvoidingView>
        </ScrollView>


      </SafeAreaView>
      </Provider>
    )
}

export default Makepayment;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});