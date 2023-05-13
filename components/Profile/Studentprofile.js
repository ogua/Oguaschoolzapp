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

import { TabbedHeaderPager, AvatarHeaderScrollView } from 'react-native-sticky-parallax-header';

import { ScrollView } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
import { selectschool, selecttoken, selectuser } from '../../features/userinfoSlice';
import { schoolzapi } from '../constants';


function Studentprofile({userid}) {

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

    
    const [stclass, setstclass] = useState("");

    const tabs = [
        {title: 'Personal Information'},
        {title: 'Academic Information'},
        {title: 'Guardian Information'},
        {title: 'Payment Information'}
    ];


    const {id} = useSearchParams();
    
      useEffect(()=> {
            loaddata();
       },[]);

   //console.log(link);

   const loaddata = () => {
    setisloading(true);


    
    axios.get(schoolzapi+'/student-profile/'+userid,
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    }).then(function (results) {

        console.log("data",results.data.data);
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

        setstclass(results.data.data.stclass);

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
          <Stack.Screen  options={{
            headerTitle: 'Student Information'
           }} />
    {isloading ? <ActivityIndicator size="large" style={{marginTop: 30}} /> : (

     <TabbedHeaderPager
          contentContainerStyle={[
            isDarkTheme ? screenStyles.darkBackground : screenStyles.lightBackground,
          ]}
          containerStyle={[screenStyles.stretchContainer]}
          backgroundColor="#1ca75d"
          foregroundImage={{ uri: pic }}
          rememberTabScrollPosition
          //logo={{ uri: pic }}
          title={surname+" "+firstname+" "+othernames}
          titleStyle={screenStyles.text}
          tabs={tabs.map((section) => ({
            title: section.title,
          }))}
          tabTextStyle={[screenStyles.text]}
          showsVerticalScrollIndicator={false}>

          <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 250}}>

              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Full name</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{surname} {firstname} {othernames}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Gender</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{gender}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Branch</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{branch}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Date of Birth</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{dateofbirth}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Country</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{nationality}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Place of Birth</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{placeofbirth}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>City / Region State</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{hometown}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Disabled ?</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{disability}</Text>
                          </View>
                        </View>
              </TouchableOpacity>



          </View>

          <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 250}}>

               <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Student Class</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{stclass}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Student ID</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{studentid}</Text>
                          </View>
                        </View>
              </TouchableOpacity>


          </View>

          <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 250}}>

            {gfullname !== "" && (
              <>

              <Text style={{fontWeight: 500}}>First Guardian Information</Text>
              <Divider bold={true} style={{marginVertical: 10}} />

                <TouchableOpacity style={{marginTop: 30}}>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Guardian Fullname</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{gfullname}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

      
              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Relationship</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{relationship}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Occupation</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{goccupation}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Email</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{gemail}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Post Code</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{gpostcode}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Mobile</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{gmobile}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Employed</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{employed}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

    




              </>
            )}


        {sgfullname !== "undefined" && (
              <>

              <Text style={{fontWeight: 500, marginTop: 50}}>Second Guardian Information</Text>
              <Divider bold={true} style={{marginVertical: 10}} />

                <TouchableOpacity style={{marginTop: 30}}>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Guardian Fullname</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{sgfullname}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

      
              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Relationship</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{srelationship}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Occupation</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{sgoccupation}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Email</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{sgemail}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Post Code</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{sgpostcode}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Mobile</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{sgmobile}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Employed</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{semployed}</Text>
                          </View>
                        </View>
              </TouchableOpacity>
              </>
            )}




            
          </View>

          <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 250}}>
              
              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Payment Type</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{paytype}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Payment Discount</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{paydiscount}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />



          </View>

        
        </TabbedHeaderPager>
         )}
        </>
        // <StatusBar barStyle="light-content" backgroundColor="#1ca75d" translucent />
    )
}

export default Studentprofile;

const screenStyles = StyleSheet.create({
    content: {
     marginHorizontal: 20
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
    }

});