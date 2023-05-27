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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showMessage } from "react-native-flash-message";

function Createeditchartofaccount() {

    const token = useSelector(selecttoken);
    const [accnumber, setaccnumber] = useState("");
    const [acctitle, setacctitle] = useState("");
    const [currency, setcurrency] = useState("");
    const [openbal, setopenbal] = useState("");
    const [bname, setbname] = useState("");
    const [branch, setbranch] = useState("");
    const [phone, setphone] = useState("");
    const [address, setaddress] = useState("");
    

    const [opencalltype, setOpencalltype] = useState(false);
    const [calltype, setcalltype] = useState("");
    const [calltypeitems, setcalltypeItems] = useState([
      { label: 'Bank', value: 'Bank'},
      { label: 'Credit Card', value: 'Credit Card'}
    ]);
    
    const [openstatus, setOpenstatus] = useState(false);
    const [status, setstatus] = useState("");
    const [statusitems, setstatusItems] = useState([
      { label: 'Default Account', value: 1},
      { label: 'Normal Account', value: 0},
    ]);
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Chart Of Account');
      }else{
        loadedit();
        isCreatedorEdit('Edit Chart Of Account');
      }

    },[]);


    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/chart-of-accounts/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

          setacctitle(results.data.data.title);
          setstatus(parseInt(results.data.data.status));
          setaccnumber(results.data.data.number);
          setcalltype(results.data.data.type);
          setcurrency(results.data.data.currency);
          setopenbal(results.data.data.openingbal);
          setbname(results.data.data.bname);
          setbranch(results.data.data.branch);
          setaddress(results.data.data.address);
          setphone(results.data.data.bphone);
          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          const acct = error[0];
          const studeclass = error[1];
          
      });
  }


    const createdata = () => {

        if(acctitle == ""){
          alert('Account Title cant be empty');
          return;
        }

        if(calltype == ""){
          alert('Account Type cant be empty');
          return;
        }

  
        setIssubmitting(true);

        const formdata = {
         acctitle,
         calltype,
         status,
         accnumber,
         currency,
         openbal,
         bname,
         branch,
         address,
         phone

        }

        axios.post(schoolzapi+'/chart-of-accounts',
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

      if(acctitle == ""){
        alert('Account Title cant be empty');
        return;
      }

      if(calltype == ""){
        alert('Account Type cant be empty');
        return;
      }


      setIssubmitting(true);

      const formdata = {
       acctitle,
       calltype,
       status,
       accnumber,
       currency,
       openbal,
       bname,
       branch,
       address,
       phone

      }
    
      axios.patch(schoolzapi+'/chart-of-accounts/'+id,
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
                // headerRight: () => (
                //     <>
                //       <TouchableOpacity onPress={refresh}>
                //         <Ionicons name="refresh" size={30} />
                //       </TouchableOpacity>
                //     </>
                //   )
            }}

        />
        <KeyboardAwareScrollView>
        <ScrollView style={{marginBottom: 30}}
        >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>

        <Text style={{fontSize: 15, fontWeight: 500}}>Account Title</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={acctitle}
        onChangeText={(e) => setacctitle(e)}
        />


            <Text style={{fontSize: 15, fontWeight: 500}}>Account Type</Text>
               <DropDownPicker
                    open={opencalltype}
                    value={calltype}
                    items={calltypeitems}
                    setOpen={setOpencalltype}
                    setValue={setcalltype}
                    setItems={setcalltypeItems}
                    placeholder={"Account Type"}
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

       <Text style={{fontSize: 15, fontWeight: 500}}>Account Number</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={accnumber}
        onChangeText={(e) => setaccnumber(e)}
        />


      <Text style={{fontSize: 15, fontWeight: 500}}>Currency</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={currency}
        onChangeText={(e) => setcurrency(e)}
        />


    <Text style={{fontSize: 15, fontWeight: 500}}>Opening Balance</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={openbal}
        onChangeText={(e) => setopenbal(e)}
        />


<Text style={{fontSize: 15, fontWeight: 500}}>Bank Name</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={bname}
        onChangeText={(e) => setbname(e)}
        />


<Text style={{fontSize: 15, fontWeight: 500}}>Branch</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={branch}
        onChangeText={(e) => setbranch(e)}
/>


<Text style={{fontSize: 15, fontWeight: 500}}>Phone</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={phone}
        onChangeText={(e) => setphone(e)}
        />


<Text style={{fontSize: 15, fontWeight: 500}}>Address</Text>
        <TextInput
        style={styles.Forminputhelp}
        numberOfLines={3}
        multiline={true}
        mode="outlined"
        value={address}
        onChangeText={(e) => setaddress(e)}
        />
            
            <Text style={{fontSize: 15, fontWeight: 500}}>Status</Text>
              <DropDownPicker
                    open={openstatus}
                    value={status}
                    items={statusitems}
                    setOpen={setOpenstatus}
                    setValue={setstatus}
                    setItems={setstatusItems}
                    placeholder={"Choose Status"}
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

        {issubmitting ? <ActivityIndicator style={{marginTop: 30}} size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 30}}>
        Save
        </Button>
        )}

</Card.Content>
        </Card>
        )}
        </ScrollView>
        </KeyboardAwareScrollView>

      </SafeAreaView>
    )
}

export default Createeditchartofaccount;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});