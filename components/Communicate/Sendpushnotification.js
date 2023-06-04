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


function Sendpushnotification() {

    const token = useSelector(selecttoken);
    const [subject, setsubject] = useState("");
    const [message, setmessage] = useState("");


   
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();


  const sendsms = () => {

    if(subject == ""){
        return;
    }

    if(message == ""){
        return;
    }
      setIssubmitting(true);

    const formdata = {
        subject,
        template: message
    }

    axios.post(schoolzapi+'/send-mobile-notification',
    formdata,
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    })
      .then(function (response) {
        setIssubmitting(false);

        showMessage({
            message: 'Notification Sent Successfully!',
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
    



    return (
    <Provider>
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Send Notification',
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
          onChangeText={(e) => setsubject(e)}
          value={subject} />

                
        <TextInput
         style={{marginTop: 20}}
          label="Message"
          multiline={true}
          numberOfLines={10}
          mode="outlined"
          onChangeText={(e) => setmessage(e)}
          value={message} />

        

        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" style={{marginTop: 40}} /> : (
        <Button icon="mail" mode="contained" onPress={sendsms} style={{marginTop: 40}}>
        Send Notification
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

export default Sendpushnotification;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});