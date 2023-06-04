import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, FlatList, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar,TextInput, Switch, Divider } from 'react-native-paper';
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



function Notificationsettings() {

    const token = useSelector(selecttoken);
    const [active, setActive] = useState(0);
    const [settings, setsettings] = useState(['Oguaschoolz Notification','System Notification']);
    
    const [isfeesreceivesms, setisfeesreceivesms] = useState(0);
    const [isstudentaddsms, setisstudentaddsms] = useState(0);
    const [isstaffaddsms, setisstaffaddsms] = useState(0);

    const [isfeesreceivemail, setisfeesreceivemail] = useState(0);
    const [isstudentaddmail, setisstudentaddmail] = useState(0);
    const [isstaffaddmail, setisstaffaddmail] = useState(0);
    

    const [openmsmservice, setOpenmsmservice] = useState(false);
    const [msmservice, setmsmservice] = useState("");
    const [msmserviceitems, setmsmserviceItems] = useState([
      { label: 'Send to All Parent', value: 1},
      { label: 'Send to only one Parent', value: 0},
    ]);
    
   
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
  

    useEffect(()=>{
      //DeviceEventEmitter.removeAllListeners("event.test");

      loaddata();

    },[]);


    const loaddata = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/notification-settings',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

        // console.log(results.data.data.status);
        setisfeesreceivesms(parseInt(results.data.data.smsfeealert));
        setisstudentaddsms(parseInt(results.data.data.smsstudentalert));
        setisstaffaddsms(parseInt(results.data.data.smsstaffalert));
        setisfeesreceivemail(parseInt(results.data.data.emailfeealert));
        setisstudentaddmail(parseInt(results.data.data.emailstudentalert));
        setisstaffaddmail(parseInt(results.data.data.emailstaffalert));

        setmsmservice(parseInt(results.data.data.numofsms));

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

      axios.post(schoolzapi+'/notification-settings-default-update',
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {

          setIssubmitting(false);

          showMessage({
            message: 'Default Notification Service activated Successfully!',
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
        isfeesreceivesms,
        isstudentaddsms,
        isstaffaddsms,
        isfeesreceivemail,
        isstudentaddmail,
        isstaffaddmail
      }

        axios.post(schoolzapi+'/notification-settings-update',
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

    const onToggleIsfeesreceivesms = () => {

        if(isfeesreceivesms === 1){
            setisfeesreceivesms(0);
        }else{
            setisfeesreceivesms(1);
        }
    };

    const onTogglestudentaddsms = () => {

        if(isstudentaddsms === 1){
            setisstudentaddsms(0);
        }else{
            setisstudentaddsms(1);
        }
    };

    const onTogglestaffaddsms = () => {

        if(isstaffaddsms === 1){
            setisstaffaddsms(0);
        }else{
            setisstaffaddsms(1);
        }
    };

    const onToggleIsfeesreceivemail = () => {

        if(isfeesreceivemail === 1){
            setisfeesreceivemail(0);
        }else{
            setisfeesreceivemail(1);
        }
    };

    const onTogglestudentaddmail = () => {

        if(isstudentaddmail === 1){
            setisstudentaddmail(0);
        }else{
            setisstudentaddmail(1);
        }
    };

    const onTogglestaffaddmail = () => {

        if(isstaffaddmail === 1){
            setisstaffaddmail(0);
        }else{
            setisstaffaddmail(1);
        }
    };


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
                headerTitle: 'Notification Settings',
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
        <Text style={{fontSize: 15, fontWeight: 500}}>Number of parent to send SMS to</Text>
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
        <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>OguaSchoolz Notification</Text>           
        
        <Divider bold={true} style={{marginVertical: 20}} />

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
           <Text>Send SMS when you receive fees</Text>
           <Switch value={isfeesreceivesms === 1 ? true : false} onValueChange={onToggleIsfeesreceivesms} />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
           <Text>Send SMS when you add a student</Text>
           <Switch value={isstudentaddsms === 1 ? true : false} onValueChange={onTogglestudentaddsms} />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
           <Text>Send SMS when you add a staff</Text>
           <Switch value={isstaffaddsms === 1 ? true : false} onValueChange={onTogglestaffaddsms} />
        </View>


        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
           <Text>Send mail when you receive fees</Text>
           <Switch value={isfeesreceivemail === 1 ? true : false} onValueChange={onToggleIsfeesreceivemail} />
        </View>


        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
           <Text>Send mail when you add a student</Text>
           <Switch value={isstudentaddmail === 1 ? true : false} onValueChange={onTogglestudentaddmail} />
        </View>


        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
           <Text>Send mail when you add a staff</Text>
           <Switch value={isstaffaddmail === 1 ? true : false} onValueChange={onTogglestaffaddmail} />
        </View>

        {issubmitting ? <ActivityIndicator style={{marginTop: 30, marginBottom: 50}} size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={updatedata} style={{marginTop: 30, marginBottom: 50}}>
        Save
        </Button>
        )}

        
        </>
  )}    

      
    {active === 1 && (<>
     <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>System Notification</Text>
        

        

    </>)}


</Card.Content>
        </Card>
        )}
        </ScrollView>
        </KeyboardAwareScrollView>

      </SafeAreaView>
      </Provider>
    )
}

export default Notificationsettings;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});