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



function Createedithostel() {

    const token = useSelector(selecttoken);
    const [hostelname, sethostelname] = useState("");
    const [note, setnote] = useState("");    

    const [openhosteltype, setOpenhosteltype] = useState(false);
    const [hosteltype, sethosteltype] = useState("");
    const [hosteltypeitems, sethosteltypeItems] = useState([
      { label: 'Male', value: 'Male'},
      { label: 'Female', value: 'Female'},
      { label: 'Mixed', value: 'Mixed'},
    ]);

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Hostel');
      }else{
        loadedit();
        isCreatedorEdit('Edit Hostel');
      }

    },[]);

    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/hostel/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

          sethostelname(results.data.data.name);
          sethosteltype(results.data.data.hostype);
          setnote(results.data.data.note);
          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }


    const createdata = () => {

        if(hostelname == ""){
          alert('Hostel Name cant be empty');
          return;
        }

        if(hosteltype == ""){
          alert('Hostel Type cant be empty');
          return;
        }

        if(note == ""){
          alert('Note cant be empty');
          return;
        }
        
  
        setIssubmitting(true);

        const formdata = {
            hostelname,
            hosteltype,
            note
        }

        axios.post(schoolzapi+'/hostel',
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
            console.log("error",error);
          });
    }

    const updatedata = () => {

        if(hostelname == ""){
            alert('Hostel Name cant be empty');
            return;
          }
  
          if(hosteltype == ""){
            alert('Hostel Type cant be empty');
            return;
          }
  
          if(note == ""){
            alert('Note cant be empty');
            return;
          }
          
    
          setIssubmitting(true);
  
          const formdata = {
              hostelname,
              hosteltype,
              note
          }
    
      axios.patch(schoolzapi+'/hostel/'+id,
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


<Text style={{fontSize: 15, fontWeight: 500}}>Hostel name</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={hostelname}
        onChangeText={(e) => sethostelname(e)}
        />


            <Text style={{fontSize: 15, fontWeight: 500}}>Hostel Type</Text>
               <DropDownPicker
                    open={openhosteltype}
                    value={hosteltype}
                    items={hosteltypeitems}
                    setOpen={setOpenhosteltype}
                    setValue={sethosteltype}
                    setItems={sethosteltypeItems}
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


<Text style={{fontSize: 15, fontWeight: 500}}>Note</Text>
        <TextInput
        style={styles.Forminputhelp}
        multiline={true}
        numberOfLines={5}
        mode="outlined"
        value={note}
        onChangeText={(e) => setnote(e)}
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

export default Createedithostel;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});