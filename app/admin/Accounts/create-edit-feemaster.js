import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import {  Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { ActivityIndicator, Avatar, Button, Card, TextInput } from 'react-native-paper';
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
import { showMessage } from "react-native-flash-message";

function Createeditfeemaster() {

    const token = useSelector(selecttoken);
    const [amount, setamount] = useState("0");
    const [year, setYear] = useState("");
    const [ofee, setofee] = useState("0");

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

      if(id == undefined){
        isCreatedorEdit('New Fee master');
      }else{
        loadedit();
        isCreatedorEdit('Edit Fee master');
      }

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
        
        Promise.all([getstudentclass(), getacademicterm(), getfee()])
        .then(function (results) {
            ///setLoading(false);
            const stclass = results[0];
            const academicterm = results[1];
            const fee = results[2];

            loadstclass(stclass.data.data);
            loadacademicterm(academicterm.data.data);
            loadfee(fee.data.data);

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
    }


    const loadfee = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.title, value: item?.id}))
        
         setfeeItems(mdata);


         if(id == undefined){
              setLoading(false);
          }

         //setLoading(false);
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

        if(fee == ""){
          alert('Fee cant be empty');
          return;
        }

        if(amount == ""){
          alert('Amount cant be empty');
          return;
        }

    
      if(year == ""){
        alert('Year cant be empty');
        return;
    }

        setIssubmitting(true);

        const formdata = {
         studentclass: studentclass,
         acdemicterm: acdemicterm,
         fee: fee,
         amount: amount,
         ofee: ofee,
         year: year
        }

        axios.post(schoolzapi+'/fee-master',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {

            setIssubmitting(false);

            if( response.data.error !== undefined){
                alert('Fee Already Added!');
            }else{
                showMessage({
                  message: 'Info saved Successfully!',
                  type: "success",
                  position: 'bottom',
                });

                DeviceEventEmitter.emit('subject.added', {});
                router.back();
            }
            
           
            
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log("error",error);
          });
    }

    const updatedata = () => {

        if(studentclass == ""){
            alert('student class cant be empty');
            return;
          }
  
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
  
      
        if(year == ""){
          alert('Year cant be empty');
          return;
      }
  
          setIssubmitting(true);
  
          const formdata = {
           studentclass: studentclass,
           acdemicterm: acdemicterm,
           fee: fee,
           amount: amount,
           ofee: ofee,
           year: year
          }
    
      axios.patch(schoolzapi+'/fee-master/'+id,
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setIssubmitting(false);
          DeviceEventEmitter.emit('subject.added', {});
          router.back();
        })
        .catch(function (error) {
          setIssubmitting(false);
          console.log(error.response);
        });
  }

  const refresh = () => {
    loaddata();

    if(id !== undefined){
      loadedit();
    }
    
  }


    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: creatoredit,
                //headerShown: false,
                presentation: "card",
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
            behavior="position"
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
        keyboardType="numeric"
        mode="outlined"
        value={amount}
        onChangeText={(e) => setamount(e)}
        />
        <Text style={styles.Forminputhelp}>Note: You can decide to add up all 
        fees each student is suppose to pay per term here. but in case 
        you have a discount paying student, it is advisable to input only 
        the school fees here, then the other fees total at the otherfees 
        input for the discount calculation to affect the school fees only.
         but incase there are no discount students, you can add up all and
          enter the fees here.</Text>


      <Text style={{fontSize: 15, fontWeight: 500}}>Other Fees Total</Text>
        <TextInput
        keyboardType="numeric"
        mode="outlined"
        value={ofee}
        onChangeText={(e) => setofee(e)}
        />
        <Text style={styles.Forminputhelp}>Note: Enter the sum of other fees if there are discount students. you can as well ignore this and add the Fees separately instead of adding them all together for the discount to affect only the (Tuition fees)</Text>

        <Text style={{fontSize: 15, fontWeight: 500}}>Year</Text>
        <TextInput
         keyboardType="numeric"
         mode="outlined"
         placeholder='eg.2023'
         value={year}
         onChangeText={(e) => setYear(e)}
        />          


        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" style={{marginTop: 30}} /> : (
        <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 30}}>
        Save
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

export default Createeditfeemaster;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});