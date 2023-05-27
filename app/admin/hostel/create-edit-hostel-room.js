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
import { showMessage } from "react-native-flash-message";



function Createedithostelroom() {

    const token = useSelector(selecttoken);
    const [hostelid, sethostelid] = useState("");
    const [roomno, setroomno] = useState("");
    const [bedavailable, setbedavailable] = useState("");    

    const [openfloor, setOpenfloor] = useState(false);
    const [floor, setfloor] = useState("");
    const [flooritems, setfloorItems] = useState([
      { label: 'First Floor', value: 'First Floor'},
      { label: 'Second Floor', value: 'Second Floor'},
      { label: 'Third Floor', value: 'Third Floor'},
      { label: 'Fourth Floor', value: 'Fourth Floor'},
      { label: 'Fifth Floor', value: 'Fifth Floor'}
    ]);

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id,hosid} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('Hostel Rooms');
      }else{
        loadedit();
        isCreatedorEdit('Edit Hostel Room');
      }

    },[]);

    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/hostel-rooms/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {
          setroomno(results.data.data.roomno);
          setfloor(results.data.data.floor);
          setbedavailable(results.data.data.nobeds);
          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }


    const createdata = () => {

        if(roomno == ""){
          alert('Room Number cant be empty');
          return;
        }

        if(floor == ""){
          alert('Hostel Floor cant be empty');
          return;
        }

        if(bedavailable == ""){
          alert('Bed available cant be empty');
          return;
        }

        console.log('creating...');
        
  
        setIssubmitting(true);

        const formdata = {
            hosid,
            roomno,
            floor,
            bedavailable
        }

        axios.post(schoolzapi+'/hostel-rooms',
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

        if(roomno == ""){
            alert('Hostel Name cant be empty');
            return;
          }
  
          if(floor == ""){
            alert('Hostel Type cant be empty');
            return;
          }
  
          if(bedavailable == ""){
            alert('bedavailable cant be empty');
            return;
          }
          
    
          setIssubmitting(true);
  
          const formdata = {
              hosid,
              roomno,
              floor,
              bedavailable
          }
    
      axios.post(schoolzapi+'/hostel-rooms/'+id,
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


            <Text style={{fontSize: 15, fontWeight: 500}}>Hostel Floor</Text>
               <DropDownPicker
                    open={openfloor}
                    value={floor}
                    items={flooritems}
                    setOpen={setOpenfloor}
                    setValue={setfloor}
                    setItems={setfloorItems}
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


<Text style={{fontSize: 15, fontWeight: 500}}>Room number</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={roomno}
        onChangeText={(e) => setroomno(e)}
        />


     <Text style={{fontSize: 15, fontWeight: 500}}>Beds available</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={bedavailable}
        onChangeText={(e) => setbedavailable(e)}
        />    
            


     {issubmitting ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 20}}>
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

export default Createedithostelroom;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});