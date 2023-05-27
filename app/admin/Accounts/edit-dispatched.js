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
import { showMessage } from "react-native-flash-message";

function Editdispatched() {

    const token = useSelector(selecttoken);
    const [amount, setamount] = useState("");
    const [year, setYear] = useState("");
    const [ofee, setofee] = useState("");

    const [stname, setstname] = useState("");
    const [paid, setpaid] = useState("");
    const [owe, setowe] = useState("");
    const [arrears, setarrears] = useState("");
    

    

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
        isCreatedorEdit('New Dispatched Fee');
      }else{
        loadedit();
        isCreatedorEdit('Edit Dispatched Fee');
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
      
      axios.get(schoolzapi+'/fees-dispacted/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

          setstname(results.data.data.studentname);
          setstudentclass(parseInt(results.data.data.stclassid));
          setacdemicterm(parseInt(results.data.data.semesterid));
          setfee(parseInt(results.data.data.feeid));

          setamount(results.data.data.feeamount);
          setpaid(results.data.data.paid);
          setowe(results.data.data.owed);
          setarrears(results.data.data.arrears);
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
                message: 'Info recorded Successfully!',
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

          if(paid == ""){
            alert('Paid cant be empty');
            return;
          }


          if(arrears == ""){
            alert('Arrears cant be empty');
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
           paid: paid,
           arrears: arrears,
           year: year
          }
    
      axios.patch(schoolzapi+'/fees-dispacted/'+id,
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setIssubmitting(false);
          
          showMessage({
            message: 'Info recorded Successfully!',
            type: "success",
            position: 'bottom',
          });
        
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

        <Text style={{fontSize: 15, fontWeight: 500}}>Student name</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={stname}
        disabled={true}
        onChangeText={(e) => setstname(e)}
        />


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
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={amount}
        onChangeText={(e) => setamount(e)}
        />


      <Text style={{fontSize: 15, fontWeight: 500}}>Paid</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={paid}
        onChangeText={(e) => setpaid(e)}
        />

      <Text style={{fontSize: 15, fontWeight: 500}}>Owe</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={owe}
        onChangeText={(e) => setowe(e)}
        />


      <Text style={{fontSize: 15, fontWeight: 500}}>Arrears</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={arrears}
        onChangeText={(e) => setarrears(e)}
        />

        <Text style={{fontSize: 15, fontWeight: 500}}>Year</Text>
        <TextInput
         keyboardType="numeric"
         mode="outlined"
         placeholder='eg.2023'
         value={year}
         onChangeText={(e) => setYear(e)}
        />          


        {issubmitting ? <ActivityIndicator style={{marginTop: 30}} size="large" color="#1782b6" /> : (
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

export default Editdispatched;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});