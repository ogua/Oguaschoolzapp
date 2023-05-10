import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, Checkbox, TextInput } from 'react-native-paper';
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


function Sendmail() {

    const token = useSelector(selecttoken);
    const [file, setFile] = useState(null);
    const [title, settitle] = useState("");
    const [message, setmessage] = useState("");

    const [opennoticefor, setOpennoticefor] = useState(false);
    const [noticefor, setnoticefor] = useState("");
    const [noticeforitems, setnoticeforItems] = useState([]);

    const [opensendto, setOpensendto] = useState(false);
    const [sendto, setsendto] = useState("");
    const [sendtoitems, setsendtoItems] = useState([
        {label: 'allparents', value: 0},
        {label: 'custom', value: 2},
        {label: 'individual', value: 5},
        {label: 'debtors', value: 6},
        {label: 'absent', value: 7}
    ]);

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();
    const [stclass, setstclass] = useState(false);
  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");
      loaddata();

    },[]);

      
    const loaddata = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/message-template',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {
          
        loadsmstemplate(results.data.data);
        setLoading(false);

      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }

  const loadsmstemplate = (data) => {
            
    const mddatas = data;
    
    let mdata = [];

     mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
    
     setnoticeforItems(mdata);
}

  const createdata = () => {

    if(title == ""){
      alert('Title cant be empty');
      return;
    }

    if(message == ""){
        alert('Message cant be empty');
        return;
      }

      if(noticefor == ""){
        alert('Notice For cant be empty');
        return;
      }

      setIssubmitting(true);

    const formdata = {
        title,
        noticefor,
        message
    }

    axios.post(schoolzapi+'/message-template',
    formdata,
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    })
      .then(function (response) {
        setIssubmitting(false);

        DeviceEventEmitter.emit('subject.added', {});

        showMessage({
            message: 'Updated Successfully!',
            type: "success",
            position: 'bottom',
          });

       
        router.back();
      })
      .catch(function (error) {
        setIssubmitting(false);
        console.log(error);
      });
}

const updatedata = () => {

    if(title == ""){
        alert('Title cant be empty');
        return;
      }

      if(message == ""){
          alert('Message cant be empty');
          return;
        }

        if(noticefor == ""){
          alert('Notice For cant be empty');
          return;
        }   

        setIssubmitting(true);

  const formdata = {
    title,
    noticefor,
    message
}

  axios.patch(schoolzapi+'/message-template/'+id,
  formdata,
  {
      headers: {Accept: 'application/json',
      Authorization: "Bearer "+token
  }
  })
    .then(function (response) {

      setIssubmitting(false);
        
      showMessage({
        message: 'Updated Successfully!',
        type: "success",
        position: 'bottom',
      });

      DeviceEventEmitter.emit('subject.added', {});
      
      router.back();
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


    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Send Mail',
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
          

        <TextInput
              label="Subject"
              mode="outlined"
              onChangeText={(e) => settitle(e)}
              value={title} />


                  <DropDownPicker
                    open={opennoticefor}
                    value={noticefor}
                    items={noticeforitems}
                    setOpen={setOpennoticefor}
                    setValue={setnoticefor}
                    setItems={setnoticeforItems}
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
        <Checkbox
        status={stclass ? 'checked' : 'unchecked'}
        onPress={() => setstclass(!stclass)}

        />

<Button icon="file" onPress={selectFile} uppercase={false} mode="outlined" style={{marginTop: 20}}>
       Add Attachment
    </Button>            


        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" /> : (
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

export default Sendmail;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});