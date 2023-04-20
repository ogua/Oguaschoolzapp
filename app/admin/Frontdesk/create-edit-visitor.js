import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Button, Card, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';

function Createeditvisitor() {

    const token = useSelector(selecttoken);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [idcard, setIDcard] = useState("");
    const [numberperson, setNumper] = useState("");
    const [purpose, setPurpose] = useState("");
    const [note, setNote] = useState("");
    const [intime, setIntime] = useState("");
    const [outtime, setOuttime] = useState("");
    const [file, setFile] = useState(null);
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();


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
        isCreatedorEdit('New Visitor');
      }else{
        loaddata();
        isCreatedorEdit('Edit Visitor');
      }

    },[]);

    const loaddata = () => {
      
      setLoading(true);

      axios.get(schoolzapi+'/visitors/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          setName(response.data.data.fullname);
          setPhone(response.data.data.phone);
          setIDcard(response.data.data.idcard);
          setNumper(response.data.data.numofpersons);
          setPurpose(response.data.data.purpose);
          setIntime(response.data.data.intime);
          setOuttime(response.data.data.outtime);
          setNote(response.data.data.note);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }

    const createdata = () => {

        if(name == ""){
          alert('Subject cant be empty');
          return;
        }

        if(purpose == ""){
            alert('Purpose cant be empty');
            return;
        }

        if(intime == ""){
          alert('Purpose cant be empty');
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

        data.append('fullname',name);
        data.append('phone',phone);
        data.append('idcard',idcard);
        data.append('numofpersons',numberperson);
        data.append('purpose',purpose);
        data.append('intime',intime);
        data.append('outtime',outtime);
        data.append('note',note);

        console.log("enties",data);

        axios.post(schoolzapi+'/visitors',
        data,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            ToastAndroid.show('info saved successfully!', ToastAndroid.SHORT);
            setIssubmitting(false);
            DeviceEventEmitter.emit('subject.added', {});
            router.back();
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log(error);
          });
    }

    const updatedata = () => {

      if(name == ""){
        alert('Subject cant be empty');
        return;
      }

      if(purpose == ""){
          alert('Purpose cant be empty');
          return;
      }

      if(intime == ""){
        alert('Purpose cant be empty');
        return;
    }

      const data = new FormData();

      if(file != null){

        data.append('doc', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType
        });

      }

      data.append('fullname',name);
      data.append('phone',phone);
      data.append('idcard',idcard);
      data.append('numofpersons',numberperson);
      data.append('purpose',purpose);
      data.append('intime',intime);
      data.append('outtime',outtime);
      data.append('note',note);

      console.log(data);

      //return;
    
      setIssubmitting(true);

      axios.post(schoolzapi+'/visitors/'+id,
      data,
      {
          headers: {Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setIssubmitting(false);
          DeviceEventEmitter.emit('subject.added', {});
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

            <Text style={{fontSize: 15, fontWeight: 500}}>Full name</Text>
            <TextInput
             style={styles.Forminput}
             mode="outlined"
              onChangeText={(e) => setName(e)}
              value={name} />

<Text style={{fontSize: 15, fontWeight: 500}}>Phone number</Text>
            <TextInput
            style={styles.Forminput}
             mode="outlined"
             keyboardType="phone-pad"
              onChangeText={(e) => setPhone(e)}
              value={phone} />

<Text style={{fontSize: 15, fontWeight: 500}}>ID Card Number</Text>
          <TextInput
            style={styles.Forminput}
             mode="outlined"
             keyboardType="numeric"
              onChangeText={(e) => setIDcard(e)}
              value={idcard} />


<Text style={{fontSize: 15, fontWeight: 500}}>Number of persons</Text>
         <TextInput
            style={styles.Forminput}
             mode="outlined"
             keyboardType="numeric"
              onChangeText={(e) => setNumper(e)}
              value={numberperson} />

<Text style={{fontSize: 15, fontWeight: 500}}>Purpose</Text>
          <TextInput
            style={styles.Forminput}
            mode="outlined"
            multiline={true}
            numberOfLines={5}
            keyboardType="default"
            onChangeText={(e) => setPurpose(e)}
            value={purpose} />

        <TimePickerModal
          visible={showintime}
          onDismiss={onDismissintime}
          onConfirm={onConfirmintime}
          hours={12}
          minutes={14}
        />

         <Text style={{fontSize: 15, fontWeight: 500}}>In Time</Text>
         <TextInput
            style={styles.Forminput}
            mode="outlined"
            keyboardType="default"
            onFocus={()=>  setShowintime(true)}
            onChangeText={(e) => setIntime(e)}
            value={intime} />



      <TimePickerModal
          visible={showouttime}
          onDismiss={onDismissouttime}
          onConfirm={onConfirmouttime}
          hours={12}
          minutes={14}
        />

<Text style={{fontSize: 15, fontWeight: 500}}>Out Time</Text>
       <TextInput
            style={styles.Forminput}
            mode="outlined"
            numberOfLines={5}
            onFocus={()=>  setShowouttime(true)}
            keyboardType="default"
            onChangeText={(e) => setOuttime(e)}
            value={outtime} />

      <Text style={{fontSize: 15, fontWeight: 500}}>Note</Text>
        <TextInput
            style={styles.Forminput}
            mode="outlined"
            multiline={true}
            numberOfLines={5}
            keyboardType="default"
            onChangeText={(e) => setNote(e)}
            value={note} />


         <Button icon="file" onPress={selectFile} uppercase={false} mode="outlined">
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
    )
}

export default Createeditvisitor;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    }
});