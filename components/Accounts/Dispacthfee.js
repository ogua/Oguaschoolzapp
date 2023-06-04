import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, Divider, TextInput } from 'react-native-paper';
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
import { selecttoken } from '../../features/userinfoSlice';
import { schoolzapi } from '../constants';
import { LocaleConfig, Calendar } from "react-native-calendars";
import { showMessage } from "react-native-flash-message";

function Dispatchfees() {

    const token = useSelector(selecttoken);
    const [selecteddate, setSelecteddate] = useState('');
    const [year, setYear] = useState("");



    const [amount, setamount] = useState("");
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
    const [isreverting, setisreverting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{

      loaddata();

    },[]);

      
      function getstudentclass() {

        return axios.get(schoolzapi+'/student-classes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }

      function getacademicterm() {

        return axios.get(schoolzapi+'/academicterms',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }


     const loaddata = () => {
        setLoading(true);
        
        Promise.all([getstudentclass(), getacademicterm()])
        .then(function (results) {
            ///setLoading(false);
            const stclass = results[0];
            const academicterm = results[1];

            loadstclass(stclass.data.data);
            loadacademicterm(academicterm.data.data);

            // if(id == undefined){
            //   setLoading(false);
            // }

        }).catch(function(error){
            setLoading(false);
            const acct = error[0];
            const studeclass = error[1];
            
        });
    }



    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/fee-master/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {
          
          setstudentclass(parseInt(results.data.data.classid));
          setacdemicterm(parseInt(results.data.data.semesterid));
          setfee(parseInt(results.data.data.feeid));
          setamount(results.data.data.feeamount);
          setofee(results.data.data.ofeeamount);
          setYear(results.data.data.year);

          setLoading(false);
          

      }).catch(function(error){
          setLoading(false);
          const acct = error[0];
          const studeclass = error[1];
          
      });
  }

    const loadstclass = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setstudentclassItems(mdata);
    }


    const loadacademicterm = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setacdemictermItems(mdata);

         setLoading(false);
    }


    const createdata = () => {

        if(studentclass == ""){
          alert('student class cant be empty');
          return;
        }

        if(acdemicterm == ""){
            alert('Acdemic term cant be empty');
            return;
        }

    
      if(year == ""){
        alert('Year cant be empty');
        return;
      }


      return Alert.alert(
        "Are your sure?",
        "Are you sure you want to dispatch fees",
        [
          {
            text: "No",
          },
          {
            text: "Yes Dispatch",
            onPress: () => {
              setIssubmitting(true);

              const formdata = {
               studentclass: studentclass,
               acdemicterm: acdemicterm,
               year: year
              }
      
              axios.post(schoolzapi+'/dispatch-fees',
              formdata,
              {
                  headers: {Accept: 'application/json',
                  Authorization: "Bearer "+token
              }
              })
                .then(function (response) {
      
                  setIssubmitting(false);
      
                  if(response.data.error !== undefined){
                      alert(response.data.error);
                  }else{

                      showMessage({
                        message: response.data.data,
                        type: "success",
                        position: 'bottom',
                      });
                  }
                  
                })
                .catch(function (error) {
                  setIssubmitting(false);
                  console.log("error",error);
                });
            },
          },
        ]
      );

        
    }

    const revertdispatch = () => {

        if(selecteddate == ""){
            alert('Revert Date cant be empty');
            return;
        }


        return Alert.alert(
          "Are your sure?",
          "Are you sure you want to Revert fees dispatched on "+selecteddate,
          [
            {
              text: "No",
            },
            {
              text: "Yes Revert",
              onPress: () => {

            setisreverting(true);
  
          const formdata = {
            date: selecteddate,
          }
    
      axios.post(schoolzapi+'/revert-dispatch-fees',
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setisreverting(false);

          if(response.data.error !== undefined){
            alert(response.data.error);
          }else{
            
              showMessage({
                message: response.data.data,
                type: "success",
                position: 'bottom',
              });
          }
        })
        .catch(function (error) {
          setisreverting(false);
          console.log(error.response);
        });
                  
              },
            },
          ]
        );
  
  }

  const refresh = () => {

    loaddata();
    
  }


    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Dispatch Fees',
                presentation: 'formSheet',
                headerRight: () => (
                    <>
                      <TouchableOpacity onPress={refresh} style={{marginRight: 20}}>
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


<Text style={{fontSize: 15, fontWeight: 500}}>Student Class</Text>
               <DropDownPicker
                    open={openstudentclass}
                    value={studentclass}
                    items={studentclassitems}
                    setOpen={setOpenstudentclass}
                    setValue={setstudentclass}
                    setItems={setstudentclassItems}
                    placeholder={"Student Class"}
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


        <Text style={{fontSize: 15, fontWeight: 500}}>Year</Text>
        <TextInput
         keyboardType="numeric"
         mode="outlined"
         placeholder='eg.2023'
         value={year}
         onChangeText={(e) => setYear(e)}
        />          


        {issubmitting ? <ActivityIndicator style={{marginTop: 40}} size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={createdata} style={{marginTop: 40}}>
        Dispatch Fees
        </Button>
        )}


        <Divider bold={true} style={{marginTop: 30, borderColor: '#000', borderWidth: 0.5}} />

        <View style={{marginTop: 40}}>
          <View>
          <Text style={{fontSize: 15, fontWeight: 500, marginBottom: 10}}>Choose revert Date</Text>
            <Calendar
               visible={true}
                onDayPress={(day) => {
                    setSelecteddate(day.dateString);
                }}
                markedDates={{
                    [selecteddate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                }}
                enableSwipeMonths={true}
            />
          </View>

          {isreverting ? <ActivityIndicator style={{marginTop: 40}} size="large" color="#1782b6" /> : (

          <Button mode="contained" onPress={revertdispatch} style={{marginTop: 40}}>
              Revert Fees
          </Button>

          )}
        </View>


        

</Card.Content>
        </Card>
        )}
        </KeyboardAvoidingView>
        </ScrollView>


      </SafeAreaView>
    )
}

export default Dispatchfees;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});