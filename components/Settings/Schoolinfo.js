import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import {  Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { ActivityIndicator, Avatar, Button, Card, TextInput, Dialog, Portal, Provider } from 'react-native-paper';
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
import { showMessage } from "react-native-flash-message";


function Schoolinformation() {

    const token = useSelector(selecttoken);
    const [file, setFile] = useState(null);
    const [backfile, setbackFile] = useState(null);
    const [sigfile, setsigfile] = useState(null);
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
    const [plan, setplan] = useState("");
    const [expiry, setexpiry] = useState("");
    const [classscore, setclassscore] = useState("");
    const [examscore, setexamscore] = useState("");
    const [signature, setsignature] = useState("");
    const [initial, setinitial] = useState("");


    const [opennationality, setOpennationality] = useState(false);
    const [nationality, setnationality] = useState("");
    const [nationalityitem, setnationalityitems] = useState([]);

    
    const [trandate, settrandate] = useState("");
    
    const [zipcode, setzipcode] = useState("");
    const [imgfile, setimgFile] = useState(null);

    const [ref, setref] = useState("");
    
    
    
    const [province, setprovince] = useState("");

    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);
    

    const [openschtype, setOpenschtype] = useState(false);
    const [schtype, setschtype] = useState("");
    const [schtypeitems, setschtypeitems] = useState([
      { label: 'Basic School', value: 'Basic School'},
      { label: 'Secondary School', value: 'Secondary School'}
    ]);


    const [opensignaturetype, setOpensignaturetype] = useState(false);
    const [signaturetype, setsignaturetype] = useState("");
    const [signaturetypeitems, setsignaturetypeitems] = useState([
      { label: 'initials', value: 'initials'},
      { label: 'Image', value: 'Image'}
    ]);

    const [opencurrency, setOpencurrency] = useState(false);
    const [currency, setcurrency] = useState("");
    const [currencyitems, setcurrencyitems] = useState([
      {label: "Cedis (Gh¢)", value:"Gh¢"},
      {label: "Dollars (USD)", value:"USD"},
      {label: "Euro (EUR)", value:"EUR"},
      {label: "Nairas (NGN)", value:"NGN"},
      {label: "Pounds (GGP)", value:"GGP"},
      {label: "Yen (JPY)", value:"JPY"}
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

    function schoolinfo() {

      return axios.get(schoolzapi+'/school-information',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      });
  }

  function countries() {

    return axios.get(schoolzapi+'/countries',
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    });
}



    const loaddata = () => {
      setLoading(true);

      Promise.all([schoolinfo(), countries()])
      .then(function (results) {

        // console.log(results.data.data.status);
          setlogo(results[0].data.data.logo);
          setbackdrop(results[0].data.data.backdrop);
          setname(results[0].data.data.name);
          setmoto(results[0].data.data.schoolmoto);
          setschooltype(results[0].data.data.schtype);
          setschtype(results[0].data.data.schtype);
          setphone(results[0].data.data.phonenumber);
          settax(results[0].data.data.fax);
          setemail(results[0].data.data.email);
          setwebsite(results[0].data.data.website);
          setcountry(results[0].data.data.country);
          settowncity(results[0].data.data.towncity);
          setstateprovince(results[0].data.data.stateprovince);
          setaddress(results[0].data.data.address);
          setownersfullname(results[0].data.data.ownersfullname);
          setoemail(results[0].data.data.oemail);
          setophone(results[0].data.data.phone);
          setcurrency(results[0].data.data.name);
          setplan(results[0].data.data.plan);
          setexpiry(results[0].data.data.expiry);
          setclassscore(results[0].data.data.classscore);
          setexamscore(results[0].data.data.examscore);
          setsignaturetype(results[0].data.data.signaturetype);
          setsignature(results[0].data.data.signature);
          setinitial(results[0].data.data.initial);





          
          setemail(results[0].data.data.email);
          setzipcode(results[0].data.data.zipcode);
          setphone(results[0].data.data.phone);
          
          setref(results[0].data.data.ref);
          //settax(results[0].data.data.tax);
         // setaddress(results[0].data.data.address);
        //  setcurrency(results[0].data.data.currency);
        //  settowncity(results[0].data.data.towncity);
         // setcountry(results[0].data.data.country);
          setprovince(results[0].data.data.province);
          setimgFile(results[0].data.data.file);

          loadcountries(results[1].data.data);

      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }


  const loadcountries = (studclass) => {
      
    const mddatas = studclass;
    
    let mdata = [];
  
     mddatas.map(item =>  mdata.push({ label: item, value: item}))
    
     setnationalityitems(mdata);
  
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
            setimgFile(result.uri);
          }
        }
      } catch (err) {
        setFile(null);
        console.warn(err);
        return false;
      }
    }

    async function seletebackdrop() {
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
            setbackFile(result);
            setbackdrop(result.uri);
          }
        }
      } catch (err) {
        setbackFile(null);
        console.warn(err);
        return false;
      }
    }

    async function seletesignature() {
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
            setsigfile(result);
            setsignature(result.uri);
          }
        }
      } catch (err) {
        setsigfile(null);
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
          uri: backfile.uri,
          name: backfile.name,
          type: backfile.mimeType
        });

      }

      if(sigfile != null){

        data.append('signature', {
          uri: sigfile.uri,
          name: sigfile.name,
          type: sigfile.mimeType
        });

      }

      
//1598
      data.append('name',name);
      data.append('schoolmoto',moto);
      data.append('schtype',schtype);
      data.append('phonenumber',phone);
      data.append('fax',tax);
      data.append('email',email);
      data.append('zipcode',zipcode);
      
      data.append('website',website);
      data.append('ref',ref);
      data.append('address',address);
      data.append('currency',currency);
      data.append('towncity',towncity);
      data.append('country',country);
      data.append('stateprovince',stateprovince);
      data.append('postaladd',address);


      data.append('ownersfullname',ownersfullname);
      data.append('oemail',oemail);
      data.append('phone',ophone);
      data.append('classscore',classscore);
      data.append('examscore',examscore);
      data.append('signaturetype',signaturetype);
      data.append('initial',initial);
      

        axios.post(schoolzapi+"/save-school-information",
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
              message: 'Info updated Successfully!',
              type: "success",
              position: 'bottom',
          });
           
            
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
  

        <Button icon="file" onPress={seletebackdrop} uppercase={false} mode="outlined"
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

        {/* <TextInput
        label="School Type"
        style={styles.Forminputhelp}
        mode="outlined"
        value={schooltype}
        onChangeText={(e) => setschooltype(e)}
        /> */}

           <Text>School Type</Text>
                 <DropDownPicker
                        searchable
                         open={openschtype}
                         value={schtype}
                         items={schtypeitems}
                         setOpen={setOpenschtype}
                         setValue={setschtype}
                         setItems={setschtypeitems}
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
                             color: "#456A5A",
                         }}
                         listItemLabelStyle={{
                             color: "#456A5A",
                         }}
                         style={{
                             borderWidth: 1,
                             //backgroundColor: "#F5F7F6",
                             marginTop: 10,
                             marginBottom: 20,
                             minHeight: 40,
                         }}
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

              <Text>Country</Text>
                 <DropDownPicker
                        searchable
                         open={opennationality}
                         value={country}
                         items={nationalityitem}
                         setOpen={setOpennationality}
                         setValue={setcountry}
                         setItems={setnationalityitems}
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
                             color: "#456A5A",
                         }}
                         listItemLabelStyle={{
                             color: "#456A5A",
                         }}
                         style={{
                             borderWidth: 1,
                             //backgroundColor: "#F5F7F6",
                             marginTop: 10,
                             marginBottom: 20,
                             minHeight: 40,
                         }}
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


<Text>Currency</Text>
                 <DropDownPicker
                        searchable
                         open={opencurrency}
                         value={currency}
                         items={currencyitems}
                         setOpen={setOpencurrency}
                         setValue={setcurrency}
                         setItems={setcurrencyitems}
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
                             color: "#456A5A",
                         }}
                         listItemLabelStyle={{
                             color: "#456A5A",
                         }}
                         style={{
                             borderWidth: 1,
                             //backgroundColor: "#F5F7F6",
                             marginTop: 10,
                             marginBottom: 20,
                             minHeight: 40,
                         }}
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
                 <DropDownPicker
                        searchable
                         open={opensignaturetype}
                         value={signaturetype}
                         items={signaturetypeitems}
                         setOpen={setOpensignaturetype}
                         setValue={setsignaturetype}
                         setItems={setsignaturetypeitems}
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
                             color: "#456A5A",
                         }}
                         listItemLabelStyle={{
                             color: "#456A5A",
                         }}
                         style={{
                             borderWidth: 1,
                             //backgroundColor: "#F5F7F6",
                             marginTop: 10,
                             marginBottom: 20,
                             minHeight: 40,
                         }}
                   />
 
 {signaturetype == 'Image' ? (
  <> 
        <Button icon="file" onPress={seletesignature} uppercase={false} mode="outlined"
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