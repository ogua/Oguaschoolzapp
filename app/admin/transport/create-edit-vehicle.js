import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';

function Createeditvehicle() {

    const token = useSelector(selecttoken);
    const [Name, setName] = useState("");
    const [Model, setModel] = useState("");
    const [capacity, setcapacity] = useState("");
    const [Number, setNumber] = useState("");
    const [file, setFile] = useState(null);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Vehicle');
        loadonlystaff();
      }else{
        loaddataedit();
        isCreatedorEdit('Edit Vehicle');
      }

    },[]);


    function getstaffinfo() {

        return axios.get(schoolzapi+'/staff',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
    }
      
      function getvehicleinfo() {

        return axios.get(schoolzapi+'/vehicle/show/'+id,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }


      const loaddataedit = () => {
        setLoading(true);
        
        Promise.all([getstaffinfo(), getvehicleinfo()])
        .then(function (results) {
            setLoading(false);
            const staff = results[0];
            const vehicle = results[1];

            loaddropdown(staff.data.data);

            setName(vehicle.data.data.name);
            setModel(vehicle.data.data.model);
            setNumber(vehicle.data.data.no);
            setcapacity(vehicle.data.data.capacity);
            setValue(vehicle.data.data.assignedto);

        }).catch(function(error){
            setLoading(false);
            const acct = error[0];
            const studeclass = error[1];
            
        });
    }



    const loadonlystaff = () => {
      
      setLoading(true);

      axios.get(schoolzapi+'/staff',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          console.log(response.data.data);
          loaddropdown(response.data.data);
          
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }


    const loaddropdown = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.fullname, value: item?.id}))
        
        setItems(mdata);
  
        //console.log(items);
    }

    const createdata = () => {

        if(Name == ""){
          alert('Name cant be empty');
          return;
        }

        if(Model == ""){
            alert('Model cant be empty');
            return;
        }

        if(capacity == ""){
          alert('Capacity cant be empty');
          return;
        }

        if(Number == ""){
          alert('Vehicle Number cant be empty');
          return;
        }

        if(value == ""){
            alert('Assigned To cant be empty');
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

        data.append('name',Name);
        data.append('model',Model);
        data.append('no',Number);
        data.append('capacity',capacity);
        data.append('assignedto',value);

        axios.post(schoolzapi+'/vehicle',
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

        if(Name == ""){
            alert('Name cant be empty');
            return;
          }
  
          if(Model == ""){
              alert('Model cant be empty');
              return;
          }
  
          if(capacity == ""){
            alert('Capacity cant be empty');
            return;
          }
  
          if(Number == ""){
            alert('Vehicle Number cant be empty');
            return;
          }
  
          if(value == ""){
              alert('Assigned To cant be empty');
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

      data.append('name',Name);
      data.append('model',Model);
      data.append('no',Number);
        data.append('capacity',capacity);
        data.append('assignedto',value);
    
      axios.post(schoolzapi+'/vehicle/'+id,
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

        <View style={{flexDirection: 'row',alignItems: 'center',  marginTop: 20, marginLeft: 10}}>
                    
            {file && <Avatar.Image 
                 source={{ uri: file.uri }}
                 size={100}
            /> }
                    
            <Button mode="text" style={{fontSize: 20}} onPress={selectFile}>Pick Image</Button>
        </View>

        <Text style={{fontSize: 15, fontWeight: 500}}>Name </Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setName(e)}
        value={Name} />


        <Text style={{fontSize: 15, fontWeight: 500}}>Model</Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setModel(e)}
        value={Model} />


        <Text style={{fontSize: 15, fontWeight: 500}}>Number</Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setNumber(e)}
        value={Number} />


        <Text style={{fontSize: 15, fontWeight: 500}}>Capacity</Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setcapacity(e)}
        value={capacity} />


              <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder={"Assign Vehicle To"}
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
                        color: "#456A5A",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 40,
                        marginTop: 20
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


      </SafeAreaView>
    )
}

export default Createeditvehicle;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    }
});