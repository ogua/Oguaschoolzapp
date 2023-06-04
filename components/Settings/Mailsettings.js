import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, FlatList, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar,TextInput, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import MultiSelect from 'react-native-multiple-select';
import { cos } from 'react-native-reanimated';
import { TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LocaleConfig, Calendar } from "react-native-calendars";
import { selecmailebcypt, selecttoken } from '../../features/userinfoSlice';
import { schoolzapi } from '../constants';
import { showMessage } from "react-native-flash-message";



function Mailsettings() {

    const token = useSelector(selecttoken);
    const [maildriver, setmaildriver] = useState("");
    const [mailhost, setmailhost] = useState("");
    const [mailport, setmailport] = useState("");
    const [mailusername, setmailusername] = useState("");
    const [mailpassword, setmailpassword] = useState("");
    const [mailebcypt, setmailebcypt] = useState("");
    const [mailfromadd, setmailfromadd] = useState("");
    const [mailfromname, setmailfromname] = useState("");
       

    const [openmailservice, setOpenmailservice] = useState(false);
    const [mailservice, setmailservice] = useState("");
    const [mailserviceitems, setmailserviceItems] = useState([
      { label: 'System Mail', value: 0},
      { label: 'My Mail', value: 1}
    ]);
    
   
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
  

    useEffect(()=>{
     // DeviceEventEmitter.removeAllListeners("event.test");

     loaddata();

    },[]);


    const loaddata = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/mail-settings',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

          setmaildriver(results.data.data.driver);
          setmailhost(results.data.data.host);
          setmailport(results.data.data.port);
          setmailusername(results.data.data.username);
          setmailpassword(results.data.data.password);
          setmailebcypt(results.data.data.encryption);
          setmailfromadd(results.data.data.fromaddress);
          setmailfromname(results.data.data.fromname);

          setmailservice(parseInt(results.data.data.status));

          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }

  const updatestatus = () => {

    setIssubmitting(true);

    const formdata = {
      mailservice,
    }

      axios.post(schoolzapi+'/mail-settings-default-update',
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {

          setIssubmitting(false);

          showMessage({
            message: 'Default Mail Service activated Successfully!',
            type: "success",
            position: 'bottom',
          });
         
          
        })
        .catch(function (error) {
          setIssubmitting(false);
          console.log("error",error);
        });
}

  
    const updatedata = () => {
  
      setIssubmitting(true);

      const formdata = {
        maildriver,
        mailhost,
        mailport,
        mailusername,
        mailpassword,
        mailebcypt,
        mailfromadd,
        mailfromname
      }

        axios.post(schoolzapi+'/mail-settings-update',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {

            setIssubmitting(false);

            showMessage({
              message: 'Info updated Successfully!',
              type: "success",
              position: 'bottom',
            });
           
            
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log("error",error);
          });
    }


    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Mail Settings',
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

        <Text style={{fontSize: 15, fontWeight: 500}}>Activate Default Mailing Service</Text>
               <DropDownPicker
                    open={openmailservice}
                    value={mailservice}
                    items={mailserviceitems}
                    setOpen={setOpenmailservice}
                    setValue={setmailservice}
                    setItems={setmailserviceItems}
                    onChangeValue={updatestatus}
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

        
        <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Your Mail Settings</Text>           
        <Text>Custom Account Settings</Text>
        <Text>Gmail Steps</Text>
        <Divider bold={true} style={{marginVertical: 10}} />
        <Text>1. Login g-mail account settings.</Text>
        <Text>2. Enable 2-step verification.</Text>
        <Text>3. Generate app-password.</Text>
        <Text>4. Use new-generated password in place of your real g-mail password.</Text>
        
        <TextInput
        label="Mail Driver eg.SMTP"
        style={[styles.Forminputhelp,{marginTop: 20}]}
        mode="outlined"
        value={maildriver}
        onChangeText={(e) => setmaildriver(e)}
        />


        <TextInput
        label="Mail Host eg.smtp.gmail.com"
        style={styles.Forminputhelp}
        mode="outlined"
        value={mailhost}
        onChangeText={(e) => setmailhost(e)}
        />

        <TextInput
        label="Port eg. 587 or 465"
        style={styles.Forminputhelp}
        mode="outlined"
        value={mailport}
        onChangeText={(e) => setmailport(e)}
        />

    <TextInput
        label="username eg. Your Mailing Email(mail@gmail.com)"
        style={styles.Forminputhelp}
        mode="outlined"
        value={mailusername}
        onChangeText={(e) => setmailusername(e)}
        />


    <TextInput
        label="Password eg. Your Mailing Password"
        style={styles.Forminputhelp}
        mode="outlined"
        value={mailpassword}
        onChangeText={(e) => setmailpassword(e)}
        />

    <TextInput
        label="Mail Encryption eg.tls or ssl"
        style={styles.Forminputhelp}
        mode="outlined"
        value={mailebcypt}
        onChangeText={(e) => setmailebcypt(e)}
        />

<TextInput
        label="From Address eg.info@oguaschoolz.com"
        style={styles.Forminputhelp}
        mode="outlined"
        value={mailfromadd}
        onChangeText={(e) => setmailfromadd(e)}
        />

<TextInput
        label="From Name eg.Oguaschoolz"
        style={styles.Forminputhelp}
        mode="outlined"
        value={mailfromname}
        onChangeText={(e) => setmailfromname(e)}
        />

      
        {issubmitting ? <ActivityIndicator style={{marginTop: 30, marginBottom: 50}} size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={updatedata} style={{marginTop: 30, marginBottom: 50}}>
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

export default Mailsettings;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});