import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput, Dialog, Portal, Provider } from 'react-native-paper';
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


function Schoolinformation() {

    const token = useSelector(selecttoken);
    const [file, setFile] = useState(null);
    const [backfile, setbackFile] = useState(null);
    const [logo, setlogo] = useState("");
    const [backdrop, setbackdrop] = useState("");
    const [name, setname] = useState("");
    const [moto, setmoto] = useState("");
    const [schooltype, setschooltype] = useState("");
    const [phone, setphone] = useState("");
    const [tax, settax] = useState("");
    const [email, setemail] = useState("");
    const [website, setwebsite] = useState("");
    const [country, setcountry] = useState("");
    const [towncity, settowncity] = useState("");
    const [stateprovince, setstateprovince] = useState("");
    const [address, setaddress] = useState("");
    const [ownersfullname, setownersfullname] = useState("");
    const [oemail, setoemail] = useState("");
    const [ophone, setophone] = useState("");
    const [currency, setcurrency] = useState("");
    const [plan, setplan] = useState("");
    const [expiry, setexpiry] = useState("");
    const [classscore, setclassscore] = useState("");
    const [examscore, setexamscore] = useState("");
    const [signaturetype, setsignaturetype] = useState("");
    const [signature, setsignature] = useState("");
    const [initial, setinitial] = useState("");



    
    const [trandate, settrandate] = useState("");
    
    const [zipcode, setzipcode] = useState("");
    const [imgfile, setimgFile] = useState(null);

    const [ref, setref] = useState("");
    
    
    
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

      loaddata();

    },[]);

    const loaddata = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/school-information',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

        // console.log(results.data.data.status);
          setlogo(results.data.data.logo);
          setbackdrop(results.data.data.backdrop);
          setname(results.data.data.name);
          setmoto(results.data.data.schoolmoto);
          setschooltype(results.data.data.schtype);
          setphone(results.data.data.phonenumber);
          settax(results.data.data.fax);
          setemail(results.data.data.email);
          setwebsite(results.data.data.website);
          setcountry(results.data.data.country);
          settowncity(results.data.data.towncity);
          setstateprovince(results.data.data.stateprovince);
          setaddress(results.data.data.address);
          setownersfullname(results.data.data.ownersfullname);
          setoemail(results.data.data.oemail);
          setophone(results.data.data.phone);
          setcurrency(results.data.data.name);
          setplan(results.data.data.plan);
          setexpiry(results.data.data.expiry);
          setclassscore(results.data.data.classscore);
          setexamscore(results.data.data.examscore);
          setsignaturetype(results.data.data.signaturetype);
          setsignature(results.data.data.signature);
          setinitial(results.data.data.initial);





          
          setemail(results.data.data.email);
          setzipcode(results.data.data.zipcode);
          setphone(results.data.data.phone);
          
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

        data.append('logo', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType
        });

      }

      if(backfile != null){

        data.append('backdrop', {
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


    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'School Information',
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

        <Button icon="file" onPress={selectFile} uppercase={false} mode="outlined"
         style={{marginVertical: 20, width: 200}}>
          Upload Logo
        </Button>

        {logo ? <Image source={{uri: logo}} style={{width: 100, height: 100}}
         /> : null} 
  

        <Button icon="file" onPress={selectFile} uppercase={false} mode="outlined"
         style={{marginVertical: 20}}>
          Terminal Report backdrop (png)
        </Button>

        {backdrop ? <Image source={{uri: backdrop}} style={{width: 100, height: 100}}
         /> : null} 


        <TextInput
        label="School Name"
        style={[styles.Forminputhelp,{marginTop: 20}]}
        mode="outlined"
        value={name}
        onChangeText={(e) => setname(e)}
        />


        <TextInput
        label="School Moto"
        style={styles.Forminputhelp}
        mode="outlined"
        value={moto}
        onChangeText={(e) => setmoto(e)}
        />

        <TextInput
        label="School Type"
        style={styles.Forminputhelp}
        mode="outlined"
        value={schooltype}
        onChangeText={(e) => setschooltype(e)}
        />

        <TextInput
        label="Country code with Phone"
        style={styles.Forminputhelp}
        mode="outlined"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(e) => setphone(e)}
        />


        <TextInput
        label="Tax"
        style={styles.Forminputhelp}
        mode="outlined"
        value={tax}
        onChangeText={(e) => settax(e)}
/>


        <TextInput
        label="Email"
        style={styles.Forminputhelp}
        mode="outlined"
        value={email}
        onChangeText={(e) => setemail(e)}
/>


        <TextInput
        label="Website"
        style={styles.Forminputhelp}
        mode="outlined"
        value={website}
        onChangeText={(e) => setwebsite(e)}
/>


        <TextInput
        label="Country"
        style={styles.Forminputhelp}
        mode="outlined"
        value={country}
        onChangeText={(e) => setcountry(e)}
/>


        <TextInput
        label="Town / City"
        style={styles.Forminputhelp}
        mode="outlined"
        value={towncity}
        onChangeText={(e) => settowncity(e)}
/>

        <TextInput
        label="State / Province"
        style={styles.Forminputhelp}
        mode="outlined"
        value={stateprovince}
        onChangeText={(e) => setstateprovince(e)}
/>


        <TextInput
        label="Address"
        multiline={true}
        numberOfLines={5}
        style={styles.Forminputhelp}
        mode="outlined"
        value={address}
        onChangeText={(e) => setaddress(e)}
/>

        <TextInput
        label="Owners Fullname"
        style={styles.Forminputhelp}
        mode="outlined"
        value={ownersfullname}
        onChangeText={(e) => setownersfullname(e)}
   />

<TextInput
        label="Owners Email"
        style={styles.Forminputhelp}
        mode="outlined"
        value={oemail}
        onChangeText={(e) => setoemail(e)}
   />

<TextInput
        label="Owners Phone number"
        style={styles.Forminputhelp}
        mode="outlined"
        value={ophone}
        onChangeText={(e) => setophone(e)}
   />


<TextInput
        label="Currency"
        style={styles.Forminputhelp}
        mode="outlined"
        value={currency}
        onChangeText={(e) => setcurrency(e)}
   />

<TextInput
        label="Plan"
        style={styles.Forminputhelp}
        mode="outlined"
        disabled={true}
        value={plan}
        onChangeText={(e) => setplan(e)}
   />

   <TextInput
        label="Plan Expires On"
        style={styles.Forminputhelp}
        mode="outlined"
        value={expiry}
        disabled={true}
        onChangeText={(e) => setexpiry(e)}
   />

<Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Examination Settings</Text>
<TextInput
        label="Class score"
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={classscore}
        onChangeText={(e) => setclassscore(e)}
   />

<TextInput
        label="Exams score"
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={examscore}
        onChangeText={(e) => setexamscore(e)}
   />



<Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>School Fees Receipt Signature</Text>
<TextInput
        label="Signature type"
        style={styles.Forminputhelp}
        mode="outlined"
        value={signaturetype}
        onChangeText={(e) => setsignaturetype(e)}
   />
 
 {signaturetype == 'Image' ? (
  <> 
        <Button icon="file" onPress={selectFile} uppercase={false} mode="outlined"
         style={{marginVertical: 20}}>
          Signature (png)
        </Button>

        {signature ? <Image source={{uri: signature}} style={{width: 100, height: 100}}
         /> : null}  
  </>
 ) : (

  <TextInput
        label="Initials"
        style={styles.Forminputhelp}
        mode="outlined"
        value={initial}
        onChangeText={(e) => setinitial(e)}
   />


 )}

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

export default Schoolinformation;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});