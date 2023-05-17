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




function Createeditquestionbank() {

    const token = useSelector(selecttoken);
    const [title, settitle] = useState("");
    

    const [openbankfor, setOpenbankfor] = useState(false);
    const [bankfor, setbankfor] = useState("");
    const [bankforitems, setbankforItems] = useState([]);
    
    const [opensubject, setOpensubject] = useState(false);
    const [subject, setsubject] = useState(0);
    const [subjectitems, setsubjectItems] = useState([]);
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const [link, setlink] = useState("");
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Question Bank');
      }else{
        loadedit();
        isCreatedorEdit('Edit Question Bank');
      }

      loaddata();

    },[]);

    function getstudentclass() {

        return axios.get(schoolzapi+'/student-classes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }

      function getsubject() {

        return axios.get(schoolzapi+'/subject',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }


     const loaddata = () => {
        setLoading(true);
        
        Promise.all([getstudentclass(), getsubject()])
        .then(function (results) {
            ///setLoading(false);
            const stclass = results[0];
            const academicterm = results[1];

            loadstclass(stclass.data.data);
            loadsubject(academicterm.data.data);


        }).catch(function(error){
            setLoading(false);
            const stclass = error[0];
            const stsubject = error[1];
            
        });
    }

    const loadstclass = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setbankforItems(mdata);
    }

    const loadsubject = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setsubjectItems(mdata);

         setLoading(false);
    }



    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/questions-bank/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

        // console.log(results.data.data.subject);
          settitle(results.data.data.title);
          setbankfor(parseInt(results.data.data.stclassid));
          setsubject(parseInt(results.data.data.subjectid));
          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }


    const createdata = () => {

        if(title == ""){
          alert('Title Date cant be empty');
          return;
        }

        if(bankfor == ""){
          alert('Bank For cant be empty');
          return;
        }

        if(subject == ""){
          alert('Subject cant be empty');
          return;
        }

        
  
      setIssubmitting(true);

        const data = {
            title,
            bankfor,
            subject
        }

        axios.post(schoolzapi+'/questions-bank',
        data,
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
                    message: 'Saved Successfully!',
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

        if(title == ""){
            alert('Title Date cant be empty');
            return;
          }
  
          if(bankfor == ""){
            alert('Bank For cant be empty');
            return;
          }
  
          if(subject == ""){
            alert('Subject cant be empty');
            return;
          }
  
          
    
        setIssubmitting(true);
  
          const data = {
              title,
              bankfor,
              subject
          }
    
      axios.patch(schoolzapi+'/questions-bank/'+id,
      data,
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
                    message: 'Saved Successfully!',
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

        


<Text style={{fontSize: 15, fontWeight: 500}}>Title</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={title}
        onChangeText={(e) => settitle(e)}
        />


            <Text style={{fontSize: 15, fontWeight: 500}}>Bank For</Text>
               <DropDownPicker
                    open={openbankfor}
                    value={bankfor}
                    items={bankforitems}
                    setOpen={setOpenbankfor}
                    setValue={setbankfor}
                    setItems={setbankforItems}
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

            
            <Text style={{fontSize: 15, fontWeight: 500}}>Subject</Text>
              <DropDownPicker
                    open={opensubject}
                    value={subject}
                    items={subjectitems}
                    setOpen={setOpensubject}
                    setValue={setsubject}
                    setItems={setsubjectItems}
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
                        marginBottom: 20
                    }}
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

export default Createeditquestionbank;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});