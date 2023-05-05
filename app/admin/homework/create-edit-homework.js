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



function Createedithomework() {

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

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Assignment');
        setlink(schoolzapi+'/homework');
      }else{
        loadedit();
        setlink(schoolzapi+'/homework/'+id);
        isCreatedorEdit('Edit Assignment');
      }

      loaddata();

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


    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/homework/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

        // console.log(results.data.data.status);
          settitle(results.data.data.title);
          setstclass(parseInt(results.data.data.stclass));
          setnote(results.data.data.description);
          settrandate(results.data.data.subdate);
          setsubtime(results.data.data.time);
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
    
      axios.post(schoolzapi+'/homework/'+id,
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

        


<Text style={{fontSize: 15, fontWeight: 500}}>Tittle</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={title}
        onChangeText={(e) => settitle(e)}
        />


<Text style={{fontSize: 15, fontWeight: 500}}>Student class</Text>
               <DropDownPicker
                    open={openstclass}
                    value={stclass}
                    items={stclassitems}
                    setOpen={setOpenstclass}
                    setValue={setstclass}
                    setItems={setstclassItems}
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
        mode="outlined"
        multiline={true}
        numberOfLines={5}
        value={note}
        onChangeText={(e) => setnote(e)}
        />

    <Button icon="file" onPress={selectFile} uppercase={false} mode="outlined" style={{marginTop: 20}}>
       Add Attachment (pdf,txt,doc)
    </Button>


    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <Text style={{fontSize: 15, fontWeight: 500}}>Submission Date </Text>
          <Button icon="calendar-range" onPress={() => setShowdialog(true)}> select Date</Button>
      </View>
      <Portal>
    <Dialog visible={showdialog} onDismiss={hideDialog}>
        <Dialog.Content>
            <Calendar
                visible={true}
                onDayPress={(day) => {
                setSelecteddate(day.dateString);
                settrandate(day.dateString);
                setShowdialog(false);
                }}
                markedDates={{
                    [selecteddate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                }}
                    enableSwipeMonths={true}
                />

        </Dialog.Content>
        <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
        </Dialog>
</Portal>

        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={trandate}
        onChangeText={(e) => settrandate(e)}
        />


<TimePickerModal
          visible={showsubtime}
          onDismiss={onDismisssubtime}
          onConfirm={onConfirmsubtime}
          hours={12}
          minutes={14}
        />

         <Text style={{fontSize: 15, fontWeight: 500}}>Submission Time</Text>
         <TextInput
            style={styles.Forminput}
            mode="outlined"
            keyboardType="default"
            onFocus={()=>  setShowsubtime(true)}
            onChangeText={(e) => setsubtime(e)}
            value={subtime} />


       {issubmitting ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 30}}>
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

export default Createedithomework;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});