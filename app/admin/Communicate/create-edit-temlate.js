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


function Createedittemplate() {

    const token = useSelector(selecttoken);
    const [title, settitle] = useState("");
    const [message, setmessage] = useState("");
    const [opennoticefor, setOpennoticefor] = useState(false);
    const [noticefor, setnoticefor] = useState("");
    const [noticeforitems, setnoticeforItems] = useState([
      { label: 'Mail', value: 'Mail'},
      { label: 'Sms', value: 'Sms'}
    ]);

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Template');
      }else{
        loadedit();
        isCreatedorEdit('Edit Template');
      }

    },[]);

      
    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/message-template/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {
          
        //console.log(results.data.data);
        
        settitle(results.data.data.name);
        setmessage(results.data.data.template);
        setnoticefor(results.data.data.smstype);

        setLoading(false);
          

      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
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

    

  const onaddtitle = (title) => {
    setmessage(message+title);
  }


    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: creatoredit,
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
              label="Title"
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
                    placeholder={"Template Type"}
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

            <View style={{flexDirection: 'row'}}>
            <Button onPress={() => onaddtitle("{parentfullname}")}>Parent Fullname</Button>
            <Button onPress={() => onaddtitle("{studentid}")}>Student ID</Button>
            <Button onPress={() => onaddtitle("{studentclass}")}>Student Class</Button>
            </View>
            <View style={{flexDirection: 'row'}}>
            <Button onPress={() => onaddtitle("{studentFullName}")}>Student FullName</Button>
            <Button onPress={() => onaddtitle("{feetitle}")}>Fee title</Button>
            <Button onPress={() => onaddtitle("{feeamount}")}>Fee amount</Button>
            </View>
            <View style={{flexDirection: 'row'}}>
            <Button onPress={() => onaddtitle("{feespaid}")}>Fees paid</Button>
            <Button onPress={() => onaddtitle("{fessowed}")}>Fee owed</Button>
            <Button onPress={() => onaddtitle("{date}")}>Date</Button>
          </View>    

             <TextInput
              label="Message"
              multiline={true}
              mode="outlined"
              numberOfLines={10}
              onChangeText={(e) => setmessage(e)}
              value={message} />


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

export default Createedittemplate;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});