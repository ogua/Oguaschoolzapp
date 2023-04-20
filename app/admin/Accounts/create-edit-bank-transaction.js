import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput, Dialog, Portal, Provider } from 'react-native-paper';
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
import { LocaleConfig, Calendar } from "react-native-calendars";



function Createeditbanktransaction() {

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
    

    const [opentrantype, setOpentrantype] = useState(false);
    const [trantype, settrantype] = useState("");
    const [trantypeitems, settrantypeItems] = useState([
      { label: 'Diposite', value: 'Diposite'},
      { label: 'Withdraw', value: 'Withdraw'}
    ]);
    
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
        isCreatedorEdit('New Bank Transaction');
        setlink(schoolzapi+'/bank-transactions');
      }else{
        loadedit();
        setlink(schoolzapi+'/bank-transactions/'+id);
        isCreatedorEdit('Edit Bank Transaction');
      }

    },[]);

    const checkPermissions = async () => {
      try {
        const result = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
  
        if (!result) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title:
                'You need to give storage permission to download and save the file',
              message: 'App needs access to your camera',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
            return true;
          } else {
            Alert.alert('Error', "Camera permission denied");
            console.log('Camera permission denied');
            return false;
          }
        } else {
          return true;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    };
  
  
    async function selectFile() {
      try {
        const result = await checkPermissions();
  
        if (result) {
          const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: false,
          });
  
          if (result.type === 'success') {
            // Printing the log realted to the file
            console.log('res : ' + JSON.stringify(result));
            // Setting the state to show single file attributes
            setFile(result);
          }
        }
      } catch (err) {
        setFile(null);
        console.warn(err);
        return false;
      }
    }


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
          settrantype(results.data.data.type);
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

        if(trantype == ""){
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
      data.append('trantype',trantype);
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

      if(trantype == ""){
        alert('Account Type cant be empty');
        return;
      }


      setIssubmitting(true);

      const formdata = {
       trandate,
       trantype,
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

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 15, fontWeight: 500}}>Transaction Date </Text>
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


<Text style={{fontSize: 15, fontWeight: 500}}>Account Number</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={tranref}
        onChangeText={(e) => settranref(e)}
        />


<Text style={{fontSize: 15, fontWeight: 500}}>Cheque Number</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={cheque}
        onChangeText={(e) => setcheque(e)}
        />


<Text style={{fontSize: 15, fontWeight: 500}}>Payee</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={payee}
        onChangeText={(e) => setpayee(e)}
        />


            <Text style={{fontSize: 15, fontWeight: 500}}>Transaction Type</Text>
               <DropDownPicker
                    open={opentrantype}
                    value={trantype}
                    items={trantypeitems}
                    setOpen={setOpentrantype}
                    setValue={settrantype}
                    setItems={settrantypeItems}
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


<Text style={{fontSize: 15, fontWeight: 500}}>Currency</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={currency}
        onChangeText={(e) => setcurrency(e)}
        />

    


<Text style={{fontSize: 15, fontWeight: 500}}>Amount</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={amount}
        onChangeText={(e) => setamount(e)}
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

    <Button icon="file" onPress={selectFile} uppercase={false} mode="outlined" style={{marginTop: 20}}>
       Add Attachment
    </Button>

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

export default Createeditbanktransaction;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});