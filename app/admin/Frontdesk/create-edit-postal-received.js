import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Button, Card, TextInput, Provider, Portal, Dialog  } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { LocaleConfig, Calendar } from "react-native-calendars";
import { showMessage } from "react-native-flash-message";

function Createeditpostalreceived() {

    const token = useSelector(selecttoken);
    const [tottitle, setTotitle] = useState("");
    const [ref, setRef] = useState("");
    const [address, setAddress] = useState("");
    const [fromtitle, setFromtitile] = useState("");
    const [selecteddate, setSelecteddate] = useState('');
    const [file, setFile] = useState(null);
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

    const [docdate,setdocdate] = useState('');
    const [showdialog, setShowdialog] = useState(false);
const hideDialog = () => setShowdialog(false);

    const [showintime, setShowintime] = useState(false);
    const onDismissintime = useCallback(() => {
        setShowintime(false)
    }, [setShowintime]);

    const onConfirmintime = useCallback(
        ({ hours, minutes }) => {
         setShowintime(false);
         setIntime(hours+':'+minutes);
        },
        [setShowintime]
    );


    const [showouttime, setShowouttime] = useState(false);
    const onDismissouttime = useCallback(() => {
        setShowouttime(false)
    }, [setShowouttime]);

    const onConfirmouttime = useCallback(
        ({ hours, minutes }) => {
         setShowouttime(false);
         setOuttime(hours+':'+minutes);
        },
        [setShowouttime]
    );

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Postal Received');
      }else{
        loaddata();
        isCreatedorEdit('Edit Postal Received');
      }

    },[]);

    const loaddata = () => {
      
      setLoading(true);

      axios.get(schoolzapi+'/postal-received/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          setTotitle(response.data.data.to);
          setRef(response.data.data.ref);
          setAddress(response.data.data.address);
          setFromtitile(response.data.data.from);
          setdocdate(response.data.data.docdate);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }

    const createdata = () => {

        if(tottitle == ""){
          alert('To Title cant be empty');
          return;
        }

        if(ref == ""){
            alert('Reference cant be empty');
            return;
        }

        if(fromtitle == ""){
          alert('From Title cant be empty');
          return;
        }

        if(docdate == ""){
          alert('Document Date cant be empty');
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

        data.append('to',tottitle);
        data.append('ref',ref);
        data.append('address',address);
        data.append('from',fromtitle);
        data.append('docdate',docdate);

        axios.post(schoolzapi+'/postal-received',
        data,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            setIssubmitting(false);

            showMessage({
              message: 'Info recorded Successfully!',
              type: "success",
              position: 'bottom',
            });
          
           // DeviceEventEmitter.emit('subject.added', {});
            router.back();
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log(error);
          });
    }

    const updatedata = () => {

      if(tottitle == ""){
        alert('To Title cant be empty');
        return;
      }

      if(ref == ""){
          alert('Reference cant be empty');
          return;
      }

      if(fromtitle == ""){
        alert('From Title cant be empty');
        return;
      }

      if(docdate == ""){
        alert('Document Date cant be empty');
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

      data.append('to',tottitle);
      data.append('ref',ref);
      data.append('address',address);
      data.append('from',fromtitle);
      data.append('docdate',docdate);
    
      axios.post(schoolzapi+'/postal-received/'+id,
      data,
      {
          headers: {Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setIssubmitting(false);
        //  DeviceEventEmitter.emit('subject.added', {});
          router.back();
        })
        .catch(function (error) {
          setIssubmitting(false);
          console.log(error.response);
        });
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

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: creatoredit,
                presentation: 'formSheet',
                // headerRight: () => (
                //   <>
                //     {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : null}
                //   </>
                // )
            }}

        />
        <ScrollView style={{marginBottom: 30}}>
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
            <Card.Content>

            <Text style={{fontSize: 15, fontWeight: 500}}>From Title</Text>
            <TextInput
            style={styles.Forminput}
             mode="outlined"
              onChangeText={(e) => setFromtitile(e)}
              value={fromtitle} />

           <Text style={{fontSize: 15, fontWeight: 500}}>Reference</Text>
            <TextInput
            style={styles.Forminput}
             mode="outlined"
              onChangeText={(e) => setRef(e)}
              value={ref} />

        
         <Text style={{fontSize: 15, fontWeight: 500}}>Address</Text>
          <TextInput
            style={styles.Forminput}
             multiline={true}
             numberOfLines={4}
             mode="outlined"
              onChangeText={(e) => setAddress(e)}
              value={address} />


           <Text style={{fontSize: 15, fontWeight: 500}}>To Title</Text>
            <TextInput
             style={styles.Forminput}
             mode="outlined"
              onChangeText={(e) => setTotitle(e)}
              value={tottitle} />


         
<View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Text>Choose Document Date </Text>
    <Button icon="calendar-range" onPress={() => setShowdialog(true)}> select Date</Button>
</View>
<Portal>
    <Dialog visible={showdialog} onDismiss={hideDialog}>
        <Dialog.Content>
            <Calendar
                visible={true}
                onDayPress={(day) => {
                setSelecteddate(day.dateString);
                setdocdate(day.dateString);
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
style={styles.Forminput}
 mode="outlined"
  onChangeText={(e) => setdocdate(e)}
  value={docdate} />


         <Button icon="file" onPress={selectFile} uppercase={false} mode="outlined" style={{marginTop: 20}}>
          Add Attachment
        </Button>

        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" /> : (
          <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 20}}>
               Save
          </Button>
        )}
            
            </Card.Content>
        </Card>

       )}

        </ScrollView>
      </SafeAreaView>
      </Provider>
    )
}

export default Createeditpostalreceived;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    }
});