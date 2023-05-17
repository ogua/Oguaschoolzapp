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



function Submitassignment() {

    const token = useSelector(selecttoken);
    const [title, settitle] = useState("");
    const [trandate, settrandate] = useState("");
    const [note, setnote] = useState("");
    const [payee, setpayee] = useState("");
    const [currency, setcurrency] = useState("");
    const [amount, setamount] = useState("");
    const [file, setFile] = useState(null);
    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);


    const [subtime, setsubtime] = useState("");
    const [showsubtime, setShowsubtime] = useState(false);
    const onDismisssubtime = useCallback(() => {
        setShowsubtime(false)
    }, [setShowsubtime]);

    const onConfirmsubtime = useCallback(
        ({ hours, minutes }) => {
         setShowsubtime(false);
         setsubtime(hours+':'+minutes);
        },
        [setShowsubtime]
    );


    const [openstclass, setOpenstclass] = useState(false);
    const [stclass, setstclass] = useState("");
    const [stclassitems, setstclassItems] = useState([]);

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const [link, setlink] = useState("");
    const router = useRouter();
    const {id} = useSearchParams();
    const [submitted, setsubmitted] = useState(null);

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('Submit Assignment');
        setlink(schoolzapi+'/homework');
      }else{
        loadedit();
        setlink(schoolzapi+'/homework/'+id);
        isCreatedorEdit('Submit Assignment');
      }

    },[]);

   


    const loaddata = () => {
        setLoading(true);
        
        axios.get(schoolzapi+'/student-classes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (results) {
            ///setLoading(false);
            loadstclass(results.data.data);
        }).catch(function(error){
            setLoading(false);
            console.log(error);
            
        });
    }


    const loadstclass = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setstclassItems(mdata);

         setLoading(false);
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


    function fetchhomework() {

        return axios.get(schoolzapi+'/homework/show/'+id,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }

     function checkifsumitted() {

        return axios.get(schoolzapi+'/check-submitted-assignment/'+id,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }


    const loadedit = () => {
      setLoading(true);
      Promise.all([fetchhomework(), checkifsumitted()])
      .then(function (results) {

        // console.log(results.data.data.status);
          settitle(results[0].data.data.title);
          setstclass(parseInt(results[0].data.data.stclass));
          setnote(results[0].data.data.description);
          settrandate(results[0].data.data.subdate);
          setsubtime(results[0].data.data.time);
        
          console.log("submitted",results[1].data.data);
          setsubmitted(results[1].data.data);

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

        if(stclass == ""){
          alert('Student Class cant be empty');
          return;
        }

        if(note == ""){
          alert('Note cant be empty');
          return;
        }

        if(file == null){
          alert('File cant be empty');
          return;
        }

        if(trandate == ""){
          alert('Submission date cant be empty');
          return;
        }

        if(subtime == ""){
          alert('Submission time cant be empty');
          return;
        }
  
      setIssubmitting(true);

      const data = new FormData();

      if(file != null){

        data.append('doc', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType
        });

      }

      data.append('title',title);
      data.append('stclass',stclass);
      data.append('description',note);
      data.append('subdate',trandate);
      data.append('time',subtime);

        axios.post(schoolzapi+'/homework',
        data,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
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
  
          if(file == null){
            return;
          }
    
        setIssubmitting(true);
  
        const data = new FormData();
  
        if(file != null){
  
          data.append('doc', {
            uri: file.uri,
            name: file.name,
            type: file.mimeType
          });
  
        }
  
       data.append('id',id);
    
      axios.post(schoolzapi+'/submit-assignment',
      data,
      {
          headers: {Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setIssubmitting(false);

          if( response.data.error !== undefined){
            alert(response.data.error);
          }else{
              showMessage({
                message: 'Assigment Submitted Successfully!',
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
                headerLeft: () => (
                    <>
                      <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close-outline" size={30} />
                      </TouchableOpacity>
                    </>
                  )
            }}

        />
        <KeyboardAwareScrollView>
        <ScrollView style={{marginBottom: 30}}
        >
            
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>
        
        {submitted == undefined ? (
        <>
        <Text>{note}</Text>

    <Button icon="file" onPress={selectFile} uppercase={false} mode="outlined" style={{marginTop: 20}}>
     Upload Assignment (pdf,txt,doc)
    </Button>

    
            {issubmitting ? <ActivityIndicator size="large" color="#1782b6" /> : (
            <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 30}}>
            Submit
            </Button>
            )}
        </>
    ) : (
        <Text style={{fontSize: 20, color: 'red'}}>Assignment Already Submitted!</Text>
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

export default Submitassignment;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});