import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput, Dialog, Portal, Provider } from 'react-native-paper';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LocaleConfig, Calendar } from "react-native-calendars";
import { selecttoken } from '../../features/userinfoSlice';
import { schoolzapi } from '../../components/constants';


function Createeditteacinglog() {

    const token = useSelector(selecttoken);
    const [tranref, settranref] = useState("");
    const [trandate, settrandate] = useState("");
    const [cheque, setcheque] = useState("");
    const [payee, setpayee] = useState("");
    const [currency, setcurrency] = useState("");
    const [amount, setamount] = useState("");
    const [file, setFile] = useState(null);
    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);
    

    const [opensubject, setOpensubject] = useState(false);
    const [subject, setsubject] = useState("");
    const [subjectitems, setsubjectItems] = useState([]);

    const [intime, setIntime] = useState("");
    const [outtime, setOuttime] = useState("");

    const [showintime, setShowintime] = useState(false);
    const onDismissintime = useCallback(() => {
        setShowintime(false)
    }, [setShowintime]);

    const onConfirmintime = useCallback(
        ({ hours, minutes }) => {
         setShowintime(false);
         setIntime(hours+':'+minutes);
        },
        [setShowintime]
    );


    const [showouttime, setShowouttime] = useState(false);
    const onDismissouttime = useCallback(() => {
        setShowouttime(false)
    }, [setShowouttime]);

    const onConfirmouttime = useCallback(
        ({ hours, minutes }) => {
         setShowouttime(false);
         setOuttime(hours+':'+minutes);
        },
        [setShowouttime]
    );


    
    const [openstatus, setOpenstatus] = useState(false);
    const [status, setstatus] = useState(0);
    const [statusitems, setstatusItems] = useState([
      { label: 'Approve Transaction', value: 1},
      { label: 'Pending', value: 0},
    ]);
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const [link, setlink] = useState("");
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('Teaching Log');
        setlink(schoolzapi+'/bank-transactions');
      }else{
        loadedit();
        setlink(schoolzapi+'/bank-transactions/'+id);
        isCreatedorEdit('Edit Teaching Log');
      }

    },[]);


    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/bank-transactions/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

        // console.log(results.data.data.status);
          settrandate(results.data.data.trdate);
          setstatus(parseInt(results.data.data.status));
          settranref(results.data.data.refid);
          setsubject(results.data.data.type);
          setcheque(results.data.data.chequeno);
          setpayee(results.data.data.payee);
          setcurrency(results.data.data.currency);
          setamount(results.data.data.amount);
          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }


    const createdata = () => {

        if(trandate == ""){
          alert('Transaction Date cant be empty');
          return;
        }

        if(subject == ""){
          alert('Transaction Type cant be empty');
          return;
        }

        if(tranref == ""){
          alert('Reference cant be empty');
          return;
        }

        if(payee == ""){
          alert('Payee cant be empty');
          return;
        }

        if(amount == ""){
          alert('Amount cant be empty');
          return;
        }

        if(currency == ""){
          alert('Currency cant be empty');
          return;
        }
  
      setIssubmitting(true);

      const data = new FormData();

      if(file != null){

        data.append('doc', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType
        });

      }
//1598
      data.append('trandate',trandate);
      data.append('subject',subject);
      data.append('cheque',cheque);
      data.append('currency',currency);
      data.append('tranref',tranref);
      data.append('amount',amount);
      data.append('status',status);
      data.append('payee',payee);

        axios.post(link,
        data,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {

            setIssubmitting(false);

            if( response.data.error !== undefined){
                alert(response.data.error);
            }else{
                ToastAndroid.show('info saved successfully!', ToastAndroid.SHORT);
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

      if(trandate == ""){
        alert('Account Title cant be empty');
        return;
      }

      if(subject == ""){
        alert('Account Type cant be empty');
        return;
      }


      setIssubmitting(true);

      const formdata = {
       trandate,
       subject,
       status,
       tranref,
       cheque,
       payee,
       currency,
       amount,
       address,
       phone

      }
    
      axios.post(schoolzapi+'/bank-transactions/'+id,
      formdata,
      {
          headers: {Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setIssubmitting(false);

          if( response.data.error !== undefined){
            alert(response.data.error);
          }else{
              ToastAndroid.show('info saved successfully!', ToastAndroid.SHORT);
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
      <Provider>
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

        <Text style={{fontSize: 15, fontWeight: 500}}>Subject</Text>
               <DropDownPicker
                    open={opensubject}
                    value={subject}
                    items={subjectitems}
                    setOpen={setOpensubject}
                    setValue={setsubject}
                    setItems={setsubjectItems}
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


        <TimePickerModal
          visible={showintime}
          onDismiss={onDismissintime}
          onConfirm={onConfirmintime}
          hours={12}
          minutes={14}
        />

         <Text style={{fontSize: 15, fontWeight: 500}}>From Time</Text>
         <TextInput
            style={styles.Forminput}
            mode="outlined"
            keyboardType="default"
            onFocus={()=>  setShowintime(true)}
            onChangeText={(e) => setIntime(e)}
            value={intime} />



      <TimePickerModal
          visible={showouttime}
          onDismiss={onDismissouttime}
          onConfirm={onConfirmouttime}
          hours={12}
          minutes={14}
        />

<Text style={{fontSize: 15, fontWeight: 500}}>To Time</Text>
       <TextInput
            style={styles.Forminput}
            mode="outlined"
            numberOfLines={5}
            onFocus={()=>  setShowouttime(true)}
            keyboardType="default"
            onChangeText={(e) => setOuttime(e)}
            value={outtime} />




        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 15, fontWeight: 500}}>Date </Text>
          <Button icon="calendar-range" onPress={() => setShowdialog(true)}> select Date</Button>
      </View>
      <Portal>
    <Dialog visible={showdialog} onDismiss={hideDialog}>
        <Dialog.Content>
            <Calendar
                visible={true}
                onDayPress={(day) => {
                setSelecteddate(day.dateString);
                settrandate(day.dateString);
                setShowdialog(false);
                }}
                markedDates={{
                    [selecteddate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                }}
                    enableSwipeMonths={true}
                />

        </Dialog.Content>
        <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
        </Dialog>
</Portal>

        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={trandate}
        onChangeText={(e) => settrandate(e)}
        />


<Text style={{fontSize: 15, fontWeight: 500}}>Note</Text>
        <TextInput
        multiline={true}
        numberOfLines={4}
        style={styles.Forminputhelp}
        mode="outlined"
        value={tranref}
        onChangeText={(e) => settranref(e)}
        />

        {issubmitting ? <ActivityIndicator style={{marginTop: 30}} size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={createdata} style={{marginTop: 30}}>
        Save
        </Button>
        )}

</Card.Content>
        </Card>
        )}
        </ScrollView>
        </KeyboardAwareScrollView>

      </SafeAreaView>
      </Provider>
    )
}

export default Createeditteacinglog;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});