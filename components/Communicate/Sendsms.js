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


function Sendsms() {

    const token = useSelector(selecttoken);
    const [file, setFile] = useState(null);
    const [subject, setsubject] = useState(null);
    const [email, setemail] = useState("");

    const [opentemplate, setOpentemplate] = useState(false);
    const [template, settemplate] = useState("");
    const [templateitems, settemplateItems] = useState([]);

    const [opensendto, setOpensendto] = useState(false);
    const [sendto, setsendto] = useState("");
    const [sendtoitems, setsendtoItems] = useState([
        {label: 'All parents', value: 0},
        {label: 'Custom', value: 2},
        {label: 'Individual', value: 5},
        {label: 'Debtors', value: 6},
        {label: 'Student Absent', value: 7}
    ]);


    const [studentsitems, setstudentsitems] = useState([]);
    const [studentItems, setselectedstudentsItems] = useState([]);

    const onstudentItemsChange = selectedItems => {
      setselectedstudentsItems(selectedItems);
    };


    const [studenclass, setstudenclass] = useState([]);
    const [customchecked, setcustomchecked] = useState([]);

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();
    const [stclass, setstclass] = useState(false);


    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);
    const [scheduledate, setscheduledate] = useState("");
  

    useEffect(()=>{
     // DeviceEventEmitter.removeAllListeners("event.test");
      loaddata();

    },[]);


    function loadmessagetemplate(){

      return axios.get(schoolzapi+'/message-template',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });

    }

    function loadclasses(){
      return axios.get(schoolzapi+'/student-classes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });

    }

      
    const loaddata = () => {
      setLoading(true);
      
      Promise.all([loadmessagetemplate(), loadclasses()])
      .then(function (results) {
          
        loadsmstemplate(results[0].data.data);
        loadstclass(results[1].data.data);
        setLoading(false);

      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }

  const loadstclass = (data) => {
            
    const mddatas = data;
    
    let mdata = [];

     mddatas.map(item =>  mdata.push({ id: item?.id, name: item?.name}))
    
     setstudentsitems(mdata);
}

  const loadsmstemplate = (data) => {
            
    const mddatas = data;
    
    let mdata = [];

     mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
    
     settemplateItems(mdata);
}

  const sendsms = () => {

    if(template == ""){
        alert('Template cant be empty');
        return;
    }
      setIssubmitting(true);

      const data = new FormData();

      data.append('sendto',sendto);
      data.append('template',template);

      data.append('pupil',studentItems);
      data.append('eperphone',email);
      data.append('sheduletime',"");
      

    axios.post(schoolzapi+'/send-sms',
    data,
    {
        headers: {Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: "Bearer "+token
    }
    })
      .then(function (response) {
        setIssubmitting(false);

        showMessage({
            message: 'SMS Sent Successfully!',
            type: "success",
            position: 'bottom',
          });

          //setFile(null);
       
        //router.back();
      })
      .catch(function (error) {
        setIssubmitting(false);
        console.log(error);
      });
}
    

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



  const hnadlestclasschecked = (name,id,index) => {

    const newData = customchecked.filter((item) => item.id === id);

    if(newData.length === 0){
      //add item to array
      customchecked.push({
        id,
        name
      });
    }else{
      const newData = customchecked.filter((item) => item.id != id);
      //remove from array
      setcustomchecked(newData);
    }
    
  }


  function checkstatus(id){
    const checked = customchecked.filter(check => check.id === id);
    console.log("checked",checked);
    if(checked.length > 0){
      return `checked`;
    }else{
      return `unchecked`;
    }
  }


    return (
    <Provider>
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Send SMS',
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
                    open={opentemplate}
                    value={template}
                    items={templateitems}
                    setOpen={setOpentemplate}
                    setValue={settemplate}
                    setItems={settemplateItems}
                    placeholder={"Template"}
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
                    open={opensendto}
                    value={sendto}
                    items={sendtoitems}
                    setOpen={setOpensendto}
                    setValue={setsendto}
                    setItems={setsendtoItems}
                    placeholder={"Send To"}
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

        {sendto === 2 && (
          <>
          <Text>Student Classes</Text>
          <MultiSelect
          style={styles.Forminput}
            hideTags
            items={studentsitems}
            uniqueKey="id"
            //ref={(component) => { this.multiSelect = component }}
            onSelectedItemsChange={onstudentItemsChange}
            selectedItems={studentItems}
            selectText=""
            searchInputPlaceholderText="Search Classes..."
            onChangeInput={ (text)=> console.log(text)}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC' }}
            submitButtonColor="#CCC"
            submitButtonText="Submit"
          />
          </>
        )}

                 
        {sendto === 5 && (

          <TextInput
          label="Phone Number"
          mode="outlined"
          keyboardType="phone-pad"
          onChangeText={(e) => setemail(e)}
          value={email} />

        )}


         {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 15, fontWeight: 500}}>Schedule SMS to be sent later </Text>
          <Button icon="calendar-range" onPress={() => setShowdialog(true)}> select Date</Button>
      </View>
      <Portal>
    <Dialog visible={showdialog} onDismiss={hideDialog}>
        <Dialog.Content>
            <Calendar
                visible={true}
                onDayPress={(day) => {
                setSelecteddate(day.dateString);
                setscheduledate(day.dateString);
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
        value={scheduledate}
        onChangeText={(e) => setscheduledate(e)}
        />
        <Text>Make sure the scheduled date and time are more than an hour from now</Text> */}


        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" style={{marginTop: 30}} /> : (
        <Button icon="mail" mode="contained" onPress={sendsms} style={{marginTop: 30}}>
        Send SMS
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

export default Sendsms;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});