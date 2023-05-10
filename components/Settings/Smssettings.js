import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, FlatList, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar,TextInput } from 'react-native-paper';
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
import { selecttoken } from '../../features/userinfoSlice';
import { schoolzapi } from '../constants';
import { showMessage } from "react-native-flash-message";



function Smssettings() {

    const token = useSelector(selecttoken);
    const [active, setActive] = useState(0);
    const [settings, setsettings] = useState(['Mnotify Settings','Twilio Settings','MSG91 Settings','AfricaTaking Settings']);
    const [mimg, setmimg] = useState("");
    const [msenderid, setmsenderid] = useState("");
    const [mapiv1, setmapiv1] = useState("");
    const [mapiv2, setmapiv2] = useState("");

    const [timg, settimg] = useState("");
    const [tssid, settssid] = useState("");
    const [ttoken, setttoken] = useState("");
    const [tphone, settphone] = useState("");

    const [msgimg, setmsgimg] = useState("");
    const [msgssid, setmsgssid] = useState("");
    const [msgsenderid, setmsgsenderid] = useState("");
    const [msgroute, setmsgroute] = useState("");
    const [msgcode, setmsgcode] = useState("");

    const [afrimg, setafrimg] = useState("");
    const [africaname, setafricaname] = useState("");
    const [africaapi, setafricaapi] = useState("");
    

    const [openmsmservice, setOpenmsmservice] = useState(false);
    const [msmservice, setmsmservice] = useState("");
    const [msmserviceitems, setmsmserviceItems] = useState([
      { label: 'Mnotify', value: 'Mnotify'},
      { label: 'Twilio', value: 'Twilio'},
      { label: 'MSG91', value: 'MSG91'},
      { label: 'AfricaTaking', value: 'AfricaTaking'}
    ]);
    
   
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const [link, setlink] = useState("");
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      loaddata();

    },[]);


    const loaddata = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/sms-settings',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

        // console.log(results.data.data.status);
          setmimg(results.data.data.mimage);
          setmsenderid(results.data.data.senderid);
          setmapiv1(results.data.data.apv1);
          setmapiv2(results.data.data.apv2);
          settimg(results.data.data.timage);
          settssid(results.data.data.twilloaccsid);
          setttoken(results.data.data.twilloacctoken);
          settphone(results.data.data.twilloaccregphone);
          setmsgimg(results.data.data.msgimage);
          setmsgssid(results.data.data.msgauthkey);
          setmsgsenderid(results.data.data.msgsenderid);
          setmsgroute(results.data.data.msgroute);
          setmsgcode(results.data.data.msgcountrycode);
          setafrimg(results.data.data.afrimage);
          setafricaname(results.data.data.afrtknuser);
          setafricaapi(results.data.data.afrtknapikey);

          setmsmservice(results.data.data.status);

          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }

  const updatestatus = () => {
    setIssubmitting(true);

    const formdata = {
      msmservice,
    }

      axios.post(schoolzapi+'/sms-settings-default-update',
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {

          setIssubmitting(false);

          showMessage({
            message: 'Default SMS Service activated Successfully!',
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
        msenderid,
        mapiv1,
        mapiv2,
        tssid,
        ttoken,
        tphone,
        msgssid,
        msgsenderid,
        msgroute,
        msgcode,
        africaname,
        africaapi
      }

        axios.post(schoolzapi+'/sms-settings-update',
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

    const smssetting = (item,index) => (
        <>
        <TouchableOpacity style={{backgroundColor: `${active == index ? `#1782b6` : `#fff` }`, borderRadius: 30, marginTop: 10, marginRight: 20}}
        onPress={()=> {
            checksettingselected(index);
        }}
        >
        <List.Item
            title={item}
            titleStyle={{color: `${active == index ? `#fff` : `#000` }`, fontSize: 12}}
            titleEllipsizeMode="middle"/>
        </TouchableOpacity>
        </>
    );

    const checksettingselected = (id) => {
        setActive(id);
    }


    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'SMS Settings',
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
        <View>
           <FlatList
                data={settings}
                renderItem={({item,index})=> smssetting(item,index) }
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 10,
                }}
                keyExtractor={item => item}
                horizontal
            />
        </View>
        <KeyboardAwareScrollView>
        <ScrollView style={{marginBottom: 30}}
        >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>
        <Text style={{fontSize: 15, fontWeight: 500}}>Activate SMS Service</Text>
               <DropDownPicker
                    open={openmsmservice}
                    value={msmservice}
                    items={msmserviceitems}
                    setOpen={setOpenmsmservice}
                    setValue={setmsmservice}
                    setItems={setmsmserviceItems}
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

      {active === 0 && (
        <>
        <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Mnotify Settings</Text>           
        
        {mimg ? <Image source={{uri: mimg}} style={{width: 200, height: 200}}
         /> : null} 
        
        <TextInput
        label="Sender ID"
        style={[styles.Forminputhelp,{marginTop: 20}]}
        mode="outlined"
        value={msenderid}
        onChangeText={(e) => setmsenderid(e)}
        />


        <TextInput
        label="API V1"
        style={styles.Forminputhelp}
        mode="outlined"
        value={mapiv1}
        onChangeText={(e) => setmapiv1(e)}
        />

        <TextInput
        label="API V2"
        style={styles.Forminputhelp}
        mode="outlined"
        value={mapiv2}
        onChangeText={(e) => setmapiv2(e)}
        />
        </>
  )}    

      
      {active === 1 && (<>
     <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Twilio Settings</Text>
       
     {timg ? <Image source={{uri: timg}} style={{width: `100%`, height: 200}}
         /> : null} 

        <TextInput
        label="Twilio Account SID"
        style={[styles.Forminputhelp,{marginTop: 20}]}
        mode="outlined"
        value={tssid}
        onChangeText={(e) => settssid(e)}
        />


        <TextInput
        label="Authentication Token"
        style={styles.Forminputhelp}
        mode="outlined"
        value={ttoken}
        onChangeText={(e) => setttoken(e)}
        />

        <TextInput
        label="Registered Phone number"
        style={styles.Forminputhelp}
        mode="outlined"
        value={tphone}
        onChangeText={(e) => settphone(e)}
        />

</>)}

{active === 2 && (<>
     <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>MSG91 Settings</Text>
       
       {msgimg ? <Image source={{uri: msgimg}} style={{width: 200, height: 200}}
           /> : null} 


      <TextInput
        label="Authentication Key SID"
        style={[styles.Forminputhelp,{marginTop: 20}]}
        mode="outlined"
        value={msgssid}
        onChangeText={(e) => setmsgssid(e)}
        />


        <TextInput
        label="Sender ID"
        style={styles.Forminputhelp}
        mode="outlined"
        value={msgsenderid}
        onChangeText={(e) => setmsgsenderid(e)}
        />

        <TextInput
        label="Route"
        style={styles.Forminputhelp}
        mode="outlined"
        value={msgroute}
        onChangeText={(e) => setmsgroute(e)}
        />

        <TextInput
        label="Country code"
        style={styles.Forminputhelp}
        mode="outlined"
        keyboardType="phone-pad"
        value={msgcode}
        onChangeText={(e) => setmsgcode(e)}
        />

</>)}


{active === 3 && (<>
<Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>AfricaTaking Settings</Text>
       
       {afrimg ? <Image source={{uri: afrimg}} style={{width: 200, height: 200}}
           /> : null}


    <TextInput
        label="AfricaTaking username"
        style={styles.Forminputhelp}
        mode="outlined"
        value={africaname}
        onChangeText={(e) => setafricaname(e)}
        />

        <TextInput
        label="AfricaTaking API Key"
        style={styles.Forminputhelp}
        mode="outlined"
        keyboardType="phone-pad"
        value={africaapi}
        onChangeText={(e) => setafricaapi(e)}
        />

</>)}
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

export default Smssettings;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});