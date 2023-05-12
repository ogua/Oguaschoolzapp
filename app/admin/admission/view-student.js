import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView,
   StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Image, DeviceEventEmitter, useColorScheme, StatusBar } from 'react-native'
import { Button, Card, Divider, List, Modal, Portal, Switch, TextInput, Provider, Avatar, Dialog } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { DatePickerInput, DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCallback } from 'react';
import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import AnimatedMultistep from "react-native-animated-multistep";
import * as Imagepicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { LocaleConfig, Calendar } from "react-native-calendars";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showMessage } from "react-native-flash-message";

import { TabbedHeaderPager } from 'react-native-sticky-parallax-header';







import { ScrollView } from 'react-native-gesture-handler';
import { selectschool, selecttoken, selectuser } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';


function Viewstudent() {

  const token = useSelector(selecttoken);
  const user = useSelector(selectuser);
  const school = useSelector(selectschool);
  const [link,setlink] = useState("");
  const isDarkTheme = useColorScheme() === 'dark';
  

  const router = useRouter();
  const navigation = useNavigation();
  const [step,setcurrentstep] = useState(1);
  const [isloading,setisloading] = useState(false);
  const [issubmitting,setIssubmitting] = useState(false);

  const [pic, setPic] = useState("");
  const [file, setfile] = useState(null);
  const [surname, setsurname] = useState("");
  const [firstname, setfirstname] = useState("");
  const [othernames, setothernames] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");

  const [opennationality, setOpennationality] = useState(false);
  const [nationality, setnationality] = useState("");
  const [nationalityitem, setnationalityitems] = useState([]);

    const [openbranch, setOpenbranch] = useState(false);
    const [branch, setbranch] = useState(null);
    const [branchitem, setbranchitems] = useState([
        { label: "Main firdaws", value: "Main Branch"},
        { label: "Annex Branch", value: "Annex Branch"},
    ]);

    const [openuntoma, setOpenuntoma] = useState(false);
    const [untoma, setuntoma] = useState(null);
    const [untomaitem, setuntomaitems] = useState([
        { label: "Second Child", value: 0},
        { label: "Third Child", value: 50},
        { label: "Fourth Child", value: 100},
        { label: "Fifth Child", value: 100},
    ]);

    const [openfirdaws, setOpenfirdaws] = useState(false);
    const [firdaws, setfirdaws] = useState(null);
    const [firdawsitem, setfirdawsitems] = useState([
        { label: "Third Child", value: 50},
        { label: "Fourth Child", value: 75},
        { label: "Fifth Child", value: 100}
    ]);



  const [placeofbirth, setplaceofbirth] = useState("");
  const [religion, setreligion] = useState("");
  const [hometown, sethometown] = useState("");
  const [selecteddate, setSelecteddate] = useState('');


  const [showdialog, setShowdialog] = useState(false);
  const showDialog = () => setShowdialog(true);
  const hideDialog = () => setShowdialog(false);

  const [opendisability, setOpendisability] = useState(false);
  const [disability, setDisability] = useState("");
  const [disabilityitem, setDisabilityitems] = useState([
      { label: "Yes", value: "Yes"},
      { label: "No", value: "No"},
  ]);


  const [opengender, setOpengender] = useState(false);
  const [gender, setgender] = useState("");
  const [genderitem, setgenderitems] = useState([
      { label: "Male", value: "Male"},
      { label: "Female", value: "Female"},
  ]);

  const [studentid, setstudentid] = useState("");
  const [openentrylevel, setOpenentrylevel] = useState(false);
  const [entrylevel, setentrylevel] = useState("");
  const [entrylevelitem, setentrylevelitems] = useState([]);

  const [opencurrentlevel, setOpencurrentlevel] = useState(false);
  const [currentlevel, setcurrentlevel] = useState(null);
  const [currentlevelitem, setcurrentlevelitems] = useState([]);


  const [openpaytype, setOpenpaytype] = useState(false);
  const [paytype, setpaytype] = useState("");
  const [paytypeitem, setpaytypeitems] = useState([
        { label: "", value: ""},
        { label: "Discount Child", value: "Discount Child"},
        { label: "Full Scholarship", value: "Scholarship"},
        { label: "Partial Scholarship", value: "Partial Scholarship"},
  ]);
  const [paydiscount, setpaydiscount] = useState("");
  const [selectedpay, setselectedpay] = useState("");


  const [gfullname, setgfullname] = useState("");
    const [goccupation, setgoccupation] = useState("");
    const [gpostcode, setgpostcode] = useState("");
    const [gmobile, setgmobile] = useState("");
    const [gemail, setgemail] = useState("");

    const [sgfullname, setsgfullname] = useState("");
    const [sgoccupation, setsgoccupation] = useState("");
    const [sgpostcode, setsgpostcode] = useState("");
    const [sgmobile, setsgmobile] = useState("");
    const [sgemail, setsgemail] = useState("");

    const [openrelationship, setOpenrelationship] = useState(false);
    const [relationship, setrelationship] = useState("");
    const [relationshipitem, setrelationshipitems] = useState([
        { label: "Mother", value: "Mother"},
        { label: "Father", value: "Father"},
        { label: "Uncle", value: "Uncle"},
        { label: "Aunt", value: "Aunt"},
        { label: "Brother", value: "Brother"},
        { label: "Sister", value: "Sister"},
    ]);

    const [openemployed, setOpenemployed] = useState(false);
    const [employed, setemployed] = useState("");
    const [employeditem, setemployeditems] = useState([
        { label: "Yes", value: "Yes"},
        { label: "No", value: "No"},
    ]);


    const [opensrelationship, setOpensrelationship] = useState(false);
    const [srelationship, setsrelationship] = useState("");
    const [srelationshipitem, setsrelationshipitems] = useState([
        { label: "Mother", value: "Mother"},
        { label: "Father", value: "Father"},
        { label: "Uncle", value: "Uncle"},
        { label: "Aunt", value: "Aunt"},
        { label: "Brother", value: "Brother"},
        { label: "Sister", value: "Sister"},
    ]);

    const [opensemployed, setOpensemployed] = useState(false);
    const [semployed, setsemployed] = useState("");
    const [semployeditem, setsemployeditems] = useState([
        { label: "Yes", value: "Yes"},
        { label: "No", value: "No"},
    ]);

    const tabs = [
        {title: 'Personal Information'},
        {title: 'Academic Information'},
        {title: 'Guardian Information'},
        {title: 'Payment Information'}
    ];


    const {id} = useSearchParams();


    useEffect(()=> {

        setTimeout(() => {
          setisloading(false);
        }, 1000);
    
      },[step]);
    
    
      useEffect(()=> {
    
        if(id !== undefined){
            loadedit();
            setlink(schoolzapi+"/update-student-info/"+id);
        }else{
            setlink(schoolzapi+"/add-student");
        }
    
         loaddata();
       },[]);




    function checkpayselected(){
        if(user.uniqueid == '23cd37b8-9657-420c-b9d2-6651f5c080ce'){
             setselectedpay(firdaws);
        }else if(user.uniqueid == '5604b40-025d-456a-ba25-69f5f0e2c265'){
            setselectedpay(untoma);
        }else{
            setselectedpay(paydiscount);
        }
    }


    const createdata = () => {

       // navigation.openDrawer();

       // return;

        checkpayselected();

        if(surname == ""){
          alert('Surname cant be empty');
          return;
        }

        if(firstname == ""){
          alert('Firstname cant be empty');
          return;
        }

        if(gender == ""){
          alert('Gender cant be empty');
          return;
        }

        if(nationality == ""){
            alert('Country cant be empty');
            return;
        }

        if(disability == ""){
            alert('Disability cant be empty');
            return;
        }

        if(entrylevel == ""){
            alert('Entry Level cant be empty');
            setupcurrentstep(2);
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

      data.append('surname',surname);
      data.append('firstname',firstname);
      data.append('othernames',othernames);
      data.append('branch',branch);
      data.append('gender',gender);
      data.append('dateofbirth',dateofbirth);
      data.append('nationality',nationality);
      data.append('placeofbirth',placeofbirth);
      data.append('religion',religion);
      data.append('hometown',hometown);
      data.append('disability',disability);
      data.append('student_id',studentid);
      data.append('entrylevel',entrylevel);
      data.append('paydiscount',selectedpay);
      data.append('paytype',paytype);

      data.append('gfullname',gfullname);
      data.append('goccupation',goccupation);
      data.append('gpostcode',gpostcode);
      data.append('gmobile',gmobile);
      data.append('gemail',gemail);
      data.append('relationship',relationship);
      data.append('employed',employed);

      data.append('sgfullname',sgfullname);
      data.append('sgoccupation',sgoccupation);
      data.append('sgpostcode',sgpostcode);
      data.append('sgmobile',sgmobile);
      data.append('sgemail',sgemail);
      data.append('srelationship',srelationship);
      data.append('semployed',semployed);

        axios.post(schoolzapi+"/update-student-info/"+id,
        data,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            setIssubmitting(false);

            console.log(response.data);

            if(response.data.message){

                showMessage({
                    message: 'Student Information Updated Successfully!',
                    type: "success",
                    position: 'bottom',
                });

                DeviceEventEmitter.emit('subject.added', {});
                router.back();
            }

            if(response.data.error){
                
                showMessage({
                    message: response.data.error,
                    type: "danger",
                    position: 'bottom',
                  });
            }
           
            
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log("error",error);
          });
    }



    function checkpaydiscount(){

        if(user.uniqueid == '23cd37b8-9657-420c-b9d2-6651f5c080ce'){
            return (<>
                <DropDownPicker
                         open={openfirdaws}
                         value={firdaws}
                         items={firdawsitem}
                         setOpen={setOpenfirdaws}
                         setValue={setfirdaws}
                         setItems={setfirdawsitems}
                        // placeholder={"Disability"}
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
            
             </>);
        }else if(user.uniqueid == '5604b40-025d-456a-ba25-69f5f0e2c265'){
            return (<>

                    <DropDownPicker
                         open={openuntoma}
                         value={untoma}
                         items={untomaitem}
                         setOpen={setOpenuntoma}
                         setValue={setuntoma}
                         setItems={setuntomaitems}
                        // placeholder={"Disability"}
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
            
            </>);
        }else{
            return (<>
                 <TextInput
                    // style={styles.Forminput}
                    mode="outlined"
                    value={paydiscount}
                    onChangeText={(e) => setpaydiscount(e)}
                    />
            </>);
        }
    }

  

   //console.log(link);

   const loadedit = () => {
    setisloading(true);
    
    axios.get(schoolzapi+'/student-info/show/'+id,
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    }).then(function (results) {

        //console.log("data",results.data.data);
        setPic(results.data.data.pic);
        setsurname(results.data.data.surname);
        setfirstname(results.data.data.firstname);
        setothernames(results.data.data.onames);
        setbranch(results.data.data.branch);
        setgender(results.data.data.gender);
        setDateofbirth(results.data.data.dateofbirth);
        setnationality(results.data.data.nationality);
        setplaceofbirth(results.data.data.placeofbirth);
        setreligion(results.data.data.religion);
        sethometown(results.data.data.hometown);
        setDisability(results.data.data.disability);
        setentrylevel(parseInt(results.data.data.entrylevel));
        setcurrentlevel(parseInt(results.data.data.currentlevel));
        setstudentid(results.data.data.student_id);

        if(results.data.data.gaurdain.length > 0){

            console.log("gurdian",results.data.data.gaurdain);
            setgfullname(results.data.data.gaurdain[0].gurdianname);
            setrelationship(results.data.data.gaurdain[0].relationship);
            setgoccupation(results.data.data.gaurdain[0].occupation);
            setgpostcode(results.data.data.gaurdain[0].postcode);
            setgmobile(results.data.data.gaurdain[0].mobile);
            setgemail(results.data.data.gaurdain[0].email);
            setemployed(results.data.data.gaurdain[0].employed);

            setsgfullname(results.data.data.gaurdain[1]?.gurdianname);
            setsrelationship(results.data.data.gaurdain[1]?.relationship);
            setsgoccupation(results.data.data.gaurdain[1]?.occupation);
            setsgpostcode(results.data.data.gaurdain[1]?.postcode);
            setsgmobile(results.data.data.gaurdain[1]?.mobile);
            setsgemail(results.data.data.gaurdain[1]?.email);
            setsemployed(results.data.data.gaurdain[1]?.employed);
        }

        //console.log(results.data.data.paystatus);

        setpaytype(results.data.data.paystatus);
        setfirdaws(parseInt(results.data.data.paydiscount));
        setuntoma(parseInt(results.data.data.paydiscount));
        setpaydiscount(results.data.data.paydiscount);

        


        

     
        
      setisloading(false);
        
    }).catch(function(error){
        setisloading(false);
        console.log(error);
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

function studentclasses() {

    return axios.get(schoolzapi+'/student-classes',
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    });
}



const loaddata = () => {

    setisloading(true);
    Promise.all([countries(), studentclasses()])
    .then(function (response) {
      loaddropdown(response[1].data.data);
      loadcountries(response[0].data.data);
    })
    .catch(function (error) {
      setisloading(false);
      console.log(error);
    });
}

const loadcountries = (studclass) => {
      
    const mddatas = studclass;
    
    let mdata = [];
  
     mddatas.map(item =>  mdata.push({ label: item, value: item}))
    
     setnationalityitems(mdata);
  
     setisloading(false); 
  }

const loaddropdown = (studclass) => {
      
  const mddatas = studclass;
  
  let mdata = [];

   mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
  
   setentrylevelitems(mdata);
   setcurrentlevelitems(mdata);

   setisloading(false); 
}

  const pickimage = async () => {

    let result =  await Imagepicker.launchImageLibraryAsync({
      mediaTypes: Imagepicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1
    });

    if(!result.canceled){
        console.log('result',result);
        setPic(result.assets[0].uri);
        setfile(result.assets[0].uri);
    }
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
          setfile(result);
          setPic(result.uri);
        }
      }
    } catch (err) {
      setfile(null);
      console.warn(err);
      return false;
    }
  }


  // onNext = () => {
  // };

  // onBack = () => {
  // };


  // finish = (finalState) => {
  //   console.log(finalState);
  // };

  const setupcurrentstep = (number) => {

    if(step === number){

    }else{

      setisloading(true);
      setcurrentstep(number);
    }
    
  }



    return (
        <>
        <TabbedHeaderPager
          contentContainerStyle={[
            isDarkTheme ? screenStyles.darkBackground : screenStyles.lightBackground,
          ]}
          containerStyle={screenStyles.stretchContainer}
          backgroundColor="#1ca75d"
          foregroundImage={{ uri: pic }}
          rememberTabScrollPosition
          //logo={{ uri: pic }}
          title={"Student Information"}
          titleStyle={screenStyles.text}
          tabs={tabs.map((section) => ({
            title: section.title,
          }))}
          tabTextStyle={screenStyles.text}
          showsVerticalScrollIndicator={false}>

          <View style={styles.content}>
            <Text>Personal Information</Text>
          </View>

          <View style={styles.content}>
            <Text>Academic Information</Text>
          </View>

          <View style={styles.content}>
            <Text>gurdian Information</Text>
          </View>

          <View style={styles.content}>
            <Text>Payment Information</Text>
          </View>

          
        
        </TabbedHeaderPager>
        <StatusBar barStyle="light-content" backgroundColor="#1ca75d" translucent />
      </>
    )
}

export default Viewstudent;

const screenStyles = StyleSheet.create({
    content: {
      flex: 1,
      paddingHorizontal: 24,
      alignItems: 'center',
      marginBottom: 25,
    },
    contentText: {
      alignSelf: 'flex-start',
      color: '#000',
      fontFamily: 'AvertaStd-Semibold',
      fontSize: 24,
      letterSpacing: -0.2,
      lineHeight: 28,
      paddingBottom: 20,
      paddingTop: 40,
    },
    darkBackground: {
      backgroundColor: '#000',
    },
    lightBackground: {
      backgroundColor: '#fff',
    },
    screenContainer: {
      alignItems: 'center',
      alignSelf: 'stretch',
      flex: 1,
      justifyContent: 'center',
    },
    stretch: {
      alignSelf: 'stretch',
    },
    stretchContainer: {
      alignSelf: "stretch",
      flex: 1,
    },
    text: {
      fontFamily: 'AvertaStd-Regular',
    },
  });

const styles = StyleSheet.create({

  separator: {
      height: 0.5,
      backgroundColor: 'rgba(0,0,0,0.4)',
  },

    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20,
        color: '#1782b6'
    },
    content: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        paddingHorizontal: 24,
     },


});