import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import MultiSelect from 'react-native-multiple-select';
import { cos } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

function Requestfees() {

    const token = useSelector(selecttoken);
    const [amount, setamount] = useState("");
    const [year, setYear] = useState("");
    const [ofee, setofee] = useState("");

    const [openstudentclass, setOpenstudentclass] = useState(false);
    const [studentclass, setstudentclass] = useState("");
    const [studentclassitems, setstudentclassItems] = useState([]);
    
    const [openacdemicterm, setOpenacdemicterm] = useState(false);
    const [acdemicterm, setacdemicterm] = useState("");
    const [acdemictermitems, setacdemictermItems] = useState([]);


    const [openfee, setOpenfee] = useState(false);
    const [fee, setfee] = useState("");
    const [feeitems, setfeeItems] = useState([]);

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      loaddata();

    },[]);

      

      function getacademicterm() {

        return axios.get(schoolzapi+'/academicterms',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }

     function getfee() {

        return axios.get(schoolzapi+'/schoolfees',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }


     const loaddata = () => {
        setLoading(true);
        
        Promise.all([getacademicterm(), getfee()])
        .then(function (results) {
            ///setLoading(false);
            const academicterm = results[0];
            const fee = results[1];

            loadacademicterm(academicterm.data.data);
            loadfee(fee.data.data);

        }).catch(function(error){
          
            setLoading(false);
            const acct = error[0];
            const studeclass = error[1];
            
        });
    }

    const loadacademicterm = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setacdemictermItems(mdata);
    }


    const loadfee = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.title, value: item?.id}))
        
         setfeeItems(mdata);

        setLoading(false);
    }


    const createdata = () => {

        if(acdemicterm == ""){
            alert('Acdemic term cant be empty');
            return;
        }

        if(fee == ""){
          alert('Fee cant be empty');
          return;
        }

        if(amount == ""){
          alert('Amount cant be empty');
          return;
        }

        setIssubmitting(true);

        const formdata = {
         id: id,
         feeid: fee,
         feeamount: amount,
         term: acdemicterm,
        }

        axios.post(schoolzapi+'/request-fee-for-student',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {

            setIssubmitting(false);

            if( response.data.error !== undefined){
                alert(response.data.error);
            }else{
                ToastAndroid.show(response.data.data, ToastAndroid.SHORT);
                DeviceEventEmitter.emit('subject.added', {});
                router.back();
            }
            
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log("error",error);
          });
    }


  const refresh = () => {
    loaddata();
  }


    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Request Fee',
                presentation: 'formSheet',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                          <Ionicons name="close-circle" size={30} style={{marginRight: 10}} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <>
                      <TouchableOpacity onPress={refresh}>
                        <Ionicons name="refresh" size={30} />
                      </TouchableOpacity>
                    </>
                  )
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

            
            <Text style={{fontSize: 15, fontWeight: 500}}>Academic Term</Text>
              <DropDownPicker
                    open={openacdemicterm}
                    value={acdemicterm}
                    items={acdemictermitems}
                    setOpen={setOpenacdemicterm}
                    setValue={setacdemicterm}
                    setItems={setacdemictermItems}
                    placeholder={"Choose Academic Term"}
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
                        marginBottom: 20
                    }}
                    />



             <Text style={{fontSize: 15, fontWeight: 500}}>Fee</Text>
              <DropDownPicker
                    open={openfee}
                    value={fee}
                    items={feeitems}
                    setOpen={setOpenfee}
                    setValue={setfee}
                    setItems={setfeeItems}
                    placeholder={"Choose Fee"}
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
                        marginBottom: 20
                    }}
                    />

      <Text style={{fontSize: 15, fontWeight: 500}}>School Fees Amount</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={amount}
        onChangeText={(e) => setamount(e)}
        />

        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={createdata} style={{marginTop: 30}}>
           Request
        </Button>
        )}

</Card.Content>
        </Card>
        )}
        </KeyboardAvoidingView>
        </ScrollView>


      </SafeAreaView>
    )
}

export default Requestfees;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});