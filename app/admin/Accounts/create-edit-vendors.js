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
import { TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LocaleConfig, Calendar } from "react-native-calendars";
import { showMessage } from "react-native-flash-message";



function Createeditvendors() {

    const token = useSelector(selecttoken);
    const [name, setname] = useState("");
    const [trandate, settrandate] = useState("");
    const [email, setemail] = useState("");
    const [zipcode, setzipcode] = useState("");
    const [phone, setphone] = useState("");
    const [website, setwebsite] = useState("");
    const [file, setFile] = useState(null);
    const [imgfile, setimgFile] = useState(null);

    const [ref, setref] = useState("");
    const [tax, settax] = useState("");
    const [address, setaddress] = useState("");
    const [currency, setcurrency] = useState("");
    const [towncity, settowncity] = useState("");
    const [country, setcountry] = useState("");
    const [province, setprovince] = useState("");

    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);
    

    const [opentrantype, setOpentrantype] = useState(false);
    const [trantype, settrantype] = useState("");
    const [trantypeitems, settrantypeItems] = useState([
      { label: 'Diposite', value: 'Diposite'},
      { label: 'Withdraw', value: 'Withdraw'}
    ]);
    
    const [openstatus, setOpenstatus] = useState(false);
    const [status, setstatus] = useState(0);
    const [statusitems, setstatusItems] = useState([
      { label: 'Approve Transaction', value: 1},
      { label: 'Pending', value: 0},
    ]);
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const [link, setlink] = useState("");
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Vendor');
        setlink(schoolzapi+'/vendors');
      }else{
        loadedit();
        setlink(schoolzapi+'/vendors/'+id);
        isCreatedorEdit('Edit Vendor');
      }

    },[]);

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
            setimgFile(result.uri);
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
      
      axios.get(schoolzapi+'/vendors/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

        // console.log(results.data.data.status);
          setname(results.data.data.name);
          setemail(results.data.data.email);
          setzipcode(results.data.data.zipcode);
          setphone(results.data.data.phone);
          setwebsite(results.data.data.website);
          setref(results.data.data.ref);
          settax(results.data.data.tax);
          setaddress(results.data.data.address);
          setcurrency(results.data.data.currency);
          settowncity(results.data.data.towncity);
          setcountry(results.data.data.country);
          setprovince(results.data.data.province);
          setimgFile(results.data.data.file);
          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }


    const createdata = () => {

        if(name == ""){
          alert('Vendor"s name cant be empty');
          return;
        }

        if(towncity == ""){
          alert('TownCity cant be empty');
          return;
        }

        if(country == ""){
          alert('Country cant be empty');
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
//1598
      data.append('name',name);
      data.append('email',email);
      data.append('zipcode',zipcode);
      data.append('phone',phone);
      data.append('website',website);
      data.append('ref',ref);
      data.append('tax',tax);
      data.append('address',address);
      data.append('currency',currency);
      data.append('towncity',towncity);
      data.append('country',country);
      data.append('province',province);

        axios.post(link,
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

      if(trandate == ""){
        alert('Account Title cant be empty');
        return;
      }

      if(trantype == ""){
        alert('Account Type cant be empty');
        return;
      }


      setIssubmitting(true);

      const formdata = {
       name,
       email,
       zipcode,
       phone,
       website,
       ref,
       tax,
       address,
       currency,
       towncity,
       country,
       province

      }
    
      axios.post(schoolzapi+'/bank-transactions/'+id,
      formdata,
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
              ToastAndroid.show('info saved successfully!', ToastAndroid.SHORT);
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
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

        {imgfile ? <Image source={{uri: imgfile}} style={{width: 100, height: 100}}
         /> : null}   

        <Button icon="file" onPress={selectFile} uppercase={false} mode="outlined"
         style={{marginVertical: 20, width: 200}}>
          Upload Logo
        </Button>

        </View>


<Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Vendor name</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={name}
        onChangeText={(e) => setname(e)}
        />


<Text style={{fontSize: 15, fontWeight: 500}}>Email</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={email}
        keyboardType="email-address"
        onChangeText={(e) => setemail(e)}
        />


<Text style={{fontSize: 15, fontWeight: 500}}>Zip code</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={zipcode}
        onChangeText={(e) => setzipcode(e)}
        />

<Text style={{fontSize: 15, fontWeight: 500}}>Phone number</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(e) => setphone(e)}
        />


<Text style={{fontSize: 15, fontWeight: 500}}>website</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={website}
        keyboardType="url"
        onChangeText={(e) => setwebsite(e)}
/>


<Text style={{fontSize: 15, fontWeight: 500}}>Ref</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={ref}
        onChangeText={(e) => setref(e)}
/>


<Text style={{fontSize: 15, fontWeight: 500}}>Tax</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={tax}
        onChangeText={(e) => settax(e)}
/>


<Text style={{fontSize: 15, fontWeight: 500}}>Address</Text>
        <TextInput
        style={styles.Forminputhelp}
        multiline={true}
        numberOfLines={4}
        mode="outlined"
        value={address}
        onChangeText={(e) => setaddress(e)}
/>


<Text style={{fontSize: 15, fontWeight: 500}}>Currency</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={currency}
        onChangeText={(e) => setcurrency(e)}
/>

<Text style={{fontSize: 15, fontWeight: 500}}>Towncity</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={towncity}
        onChangeText={(e) => settowncity(e)}
/>


<Text style={{fontSize: 15, fontWeight: 500}}>Country</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={country}
        onChangeText={(e) => setcountry(e)}
/>

<Text style={{fontSize: 15, fontWeight: 500}}>Province</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={province}
        onChangeText={(e) => setprovince(e)}
/>


        {issubmitting ? <ActivityIndicator style={{marginTop: 30}} size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={createdata} style={{marginTop: 30}}>
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

export default Createeditvendors;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});