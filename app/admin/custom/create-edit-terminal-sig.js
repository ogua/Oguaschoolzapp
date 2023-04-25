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
import { selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';


function Createeditsignatures() {

    const token = useSelector(selecttoken);
    const [note, setnote] = useState("");
    const [trandate, settrandate] = useState("");
    const [initials, setinitials] = useState("");
    const [payee, setpayee] = useState("");
    const [currency, setcurrency] = useState("");
    const [amount, setamount] = useState("");
    const [file, setFile] = useState(null);
    const [imgfile, setimgFile] = useState(null);
    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);
    

    const [openstclass, setOpenstclass] = useState(false);
    const [stclass, setstclass] = useState("");
    const [stclassitems, setstclassItems] = useState([]);

    
    const [opensignaturetype, setOpensignaturetype] = useState(false);
    const [signaturetype, setsignaturetype] = useState("");
    const [signaturetypeitems, setsignaturetypeItems] = useState([
      { label: 'initials', value: 'initials'},
      { label: 'Image', value: 'Image'},
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

      if(id == undefined){
        isCreatedorEdit('Terminal Signature');
        setlink(schoolzapi+'/terminal-report-signatures');
      }else{
        loadedit();
        isCreatedorEdit('Edit Terminal Signature');
        setlink(schoolzapi+'/terminal-report-signatures/'+id);
      }

    },[]);


    const loaddata = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/student-classes',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

        /// console.log(results.data.data);
        loasstclasss(results.data.data);
          
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }

  const loasstclasss = (data) => {
            
    const mddatas = data;
    
    let mdata = [];

     mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
    
     setstclassItems(mdata);

     setLoading(false);
}

    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/terminal-report-signatures/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

          //console.log(results.data.data);
          setstclass(parseInt(results.data.data.stclassid));
          setsignaturetype(results.data.data.type);
          setinitials(results.data.data.initial);
         
          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }


    const createdata = () => {

        if(stclass == ""){
          alert('Class cant be empty');
          return;
        }

        if(signaturetype == ""){
          alert('Signature Type cant be empty');
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

        data.append('stclass',stclass);
        data.append('signaturetype',signaturetype);
        data.append('initials',initials);

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
                DeviceEventEmitter.emit('stclass.added', {});
                router.back();
            }
           
            
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log("error",error);
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

        <Text style={{fontSize: 15, fontWeight: 500}}>Class </Text>
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

              <Text style={{fontSize: 15, fontWeight: 500}}>Signature Type</Text>
               <DropDownPicker
                    open={opensignaturetype}
                    value={signaturetype}
                    items={signaturetypeitems}
                    setOpen={setOpensignaturetype}
                    setValue={setsignaturetype}
                    setItems={setsignaturetypeItems}
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


       {signaturetype == 'initials' && (
        <>
        <Text style={{fontSize: 15, fontWeight: 500}}>initials</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={initials}
        onChangeText={(e) => setinitials(e)}
        />
        
        </>
       )}

   {signaturetype == 'Image' && (
        <>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

            {imgfile ? <Image source={{uri: imgfile}} style={{width: 100, height: 100}}
            /> : null}   

            <Button icon="file" onPress={selectFile} uppercase={false} mode="outlined"
            style={{marginVertical: 20}}>
            Upload Signature (150x30 transparent)
            </Button>

            </View>
        
        </>
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

export default Createeditsignatures;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});