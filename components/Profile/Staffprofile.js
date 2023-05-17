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


function Staffprofile({userid}) {

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
  const [document, setdocument] = useState(null);
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
        { label: "Main Branch", value: "Main Branch"},
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

    const [opentitle, setOpentitle] = useState(false);
    const [title, settitle] = useState(null);
    const [titleitem, settitleitems] = useState([
        { label: "Mr", value: "Mr"},
        { label: "Mrs", value: "Mrs"},
        { label: "Miss", value: "Miss"},
        { label: "Ms", value: "Ms"},
    ]);

  const [towncity, settowncity] = useState("");
  const [stateprovince, setstateprovince] = useState("");
  const [address, setaddress] = useState("");
  const [selecteddate, setSelecteddate] = useState('');


  const [showdialog, setShowdialog] = useState(false);
  const showDialog = () => setShowdialog(true);
  const hideDialog = () => setShowdialog(false);

  const [openmaritalstatus, setOpenmaritalstatus] = useState(false);
  const [maritalstatus, setmaritalstatus] = useState("");
  const [maritalstatusitem, setmaritalstatusitems] = useState([
      { label: "Married", value: "Married"},
      { label: "Unmarried", value: "Unmarried"},
      { label: "Single", value: "Single"},
      { label: "Divorced", value: "Divorced"},
  ]);


  const [opengender, setOpengender] = useState(false);
  const [gender, setgender] = useState("");
  const [genderitem, setgenderitems] = useState([
      { label: "Male", value: "Male"},
      { label: "Female", value: "Female"},
  ]);

  const [fathername, setfathername] = useState("");
  const [openmothername, setOpenmothername] = useState(false);
  const [mothername, setmothername] = useState("");
  const [mothernameitem, setmothernameitems] = useState([]);

  const [openmothernumber, setOpenmothernumber] = useState(false);
  const [mothernumber, setmothernumber] = useState(null);
  const [mothernumberitem, setmothernumberitems] = useState([]);


  const [assignclass, setassignclass] = useState([]);
  const setOpenassignclass = selectedItems => {
    setassignclass(selectedItems);
  };

  const [assignsubjectitem, setassignsubjectitems] = useState([]);
  const [assignclassitem, setassignclassitems] = useState([]);

  const [resume, setresume] = useState("");

  

  const [assignsubject, setassignsubject] = useState([]);
  const setOpenassignsubject = selectedItems => {
    setassignsubject(selectedItems);
  };



  const [paydiscount, setpaydiscount] = useState("");
  const [selectedpay, setselectedpay] = useState("");


  const [fathernumber, setfathernumber] = useState("");
    const [salary, setsalary] = useState("");
    const [zipcode, setzipcode] = useState("");
    const [mobile, setmobile] = useState("");
    const [email, setemail] = useState("");

    const [workingexp, setworkingexp] = useState("");
    const [staffid, setstaffid] = useState("");
    const [acctitle, setacctitle] = useState("");
    const [accnumber, setaccnumber] = useState("");
    const [bankname, setbankname] = useState("");

    const [opensalarygrade, setOpensalarygrade] = useState(false);
    const [salarygrade, setsalarygrade] = useState("");
    const [salarygradeitem, setsalarygradeitems] = useState([
        { label: "Grade 1", value: "Grade 1"},
        { label: "Grade 2", value: "Grade 2"},
        { label: "Grade 3", value: "Grade 3"},
        { label: "Grade 4", value: "Grade 4"},
        { label: "Grade 5", value: "Grade 5"},
        { label: "Grade 6", value: "Grade 6"},
    ]);

    const [openqualification, setOpenqualification] = useState(false);
    const [qualification, setqualification] = useState(null);
    const [qualificationitem, setqualificationitems] = useState([
        { label: "Bachelors Degree", value: "Bachelors Degree"},
        { label: "econdary Education", value: "econdary Education"},
        { label: "Doctorate", value: "Doctorate"},
        { label: "Professional Degree", value: "Professional Degree"},
        { label: "Basic Education", value: "Basic Education"},
        { label: "Apprenticeship", value: "Apprenticeship"},
        { label: "International Baccalaureate", value: "International Baccalaureate"},
        { label: "PHD", value: "PHD"},
        { label: "PROFESSOR", value: "PROFESSOR"},
        { label: "Diploma", value: "Diploma"},
        { label: "Others", value: "Others"},
    ]);


    const [openstaffrole, setOpenstaffrole] = useState(false);
    const [staffrole, setstaffrole] = useState("");
    const [staffroleitem, setstaffroleitems] = useState([
        { label: "Part Time Teacher", value: "Part Time Teacher"},
        { label: "Full Time Teacher", value: "Full Time Teacher"},
        { label: "Co-ordinator", value: "Co-ordinator"},
        { label: "Head Teacher", value: "Head Teacher"},
        { label: "Assistant Head Teacher", value: "Assistant Head Teacher"},
        { label: "Supporting Staff - Office Attendance", value: "Supporting Staff - Office Attendance"},
        { label: "Supporting Staff - Office Attendance", value: "Supporting Staff - Office Attendance"},
        { label: "Supporting Staff - Cook", value: "Supporting Staff - Cook"},
        { label: "Supporting Staff - Cleaner", value: "Supporting Staff - Cleaner"},
        { label: "Supporting Staff - Office Attendance", value: "Supporting Staff - Office Attendance"},
        { label: "Security", value: "Security"},
        { label: "Supervisor", value: "Supervisor"},
        { label: "Counselor", value: "Counselor"},
        { label: "Driver", value: "Driver"},
        { label: "Others", value: "Others"},
        { label: "Owner", value: "Owner"}
    ]);

    const [openbankbranch, setOpenbankbranch] = useState(false);
    const [bankbranch, setbankbranch] = useState(null);
    const [bankbranchitem, setbankbranchitems] = useState([
        { label: "Yes", value: "Yes"},
        { label: "No", value: "No"},
    ]);

    const [creatoredit, isCreatedorEdit] = useState("");

    const tabs = [
      {title: 'Personal Information'},
      {title: 'Contact Persons Information'},
      {title: 'Payroll Information'},
      {title: 'Bank Account Information'},
      {title: 'Assigned Classes Information'},
      {title: 'Assigned Subjects Information'},
      {title: 'Document'},
  ];
    
      useEffect(()=> {
    
        loaddata();
    
       },[]);


   const loaddata = () => {
    setisloading(true);
    
    axios.get(schoolzapi+'/staff-profile/'+userid,
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    }).then(function (results) {

      setPic(results.data.data.pic);
      settitle(results.data.data.title);
      setsurname(results.data.data.fullname);
      setfirstname(results.data.data.firstnames);
      setothernames(results.data.data.othernames);
      setbranch(results.data.data.branch);
      setzipcode(results.data.data.zipcode);
      setmobile(results.data.data.phone);
      setemail(results.data.data.email);
      setgender(results.data.data.gender);
      setmaritalstatus(results.data.data.maritalstatus);
      setDateofbirth(results.data.data.dateofbirth);
      setnationality(results.data.data.country);
      settowncity((results.data.data.towncity));
      setstateprovince((results.data.data.stateprovince));
      setaddress(results.data.data.address);
      setworkingexp(results.data.data.workexperience);
      setqualification(results.data.data.qualification);
      setstaffrole(results.data.data.role);
      setstaffid(results.data.data.eployid);

      setfathername(results.data.data.fathername);
      setfathernumber((results.data.data.fnumber));
      setmothername((results.data.data.mothername));
      setmothernumber(results.data.data.mnumber);

      setsalarygrade(results.data.data.salarygrade);
      setsalary((results.data.data.salary));

      setacctitle((results.data.data.acctitle));
      setaccnumber(results.data.data.accnum);
      setbankname(results.data.data.bankname);
      setbankbranch((results.data.data.bankbranch));
      setresume(results.data.data.resumedoc);

      setassignclassitems(results.data.data.userstclass);
      setassignsubjectitems(results.data.data.usersubject);
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
            headerTitle: 'Profile'
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
          title={surname}
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
                          <Text style={{textAlign: 'left',fontSize: 16}}>{surname}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Staff ID</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{staffid}</Text>
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
                      <Text style={{textAlign: 'left',fontSize: 16}}>Town / City</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{towncity}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>State / Province</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{stateprovince}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Marital Status</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{maritalstatus}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Contact</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>({zipcode}) {mobile}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />



              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Role</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{staffrole}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />



              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Qualification</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{qualification}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />



              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Address</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{address}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />



              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Working Experience</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{workingexp}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

          </View>

          <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 250}}>

          <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Fathers Name</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{fathername}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Fathers Number</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{fathername}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />



              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Mothers Name</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{mothername}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />



              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Mothers Number</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{mothernumber}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

            
          </View>



          <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 250}}>

          <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Salary Grade</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{salarygrade}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Salary</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{salary}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

          </View>


          <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 250}}>

          <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Account Title</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{acctitle}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Account Number</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{accnumber}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />

              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Bank Name</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{bankname}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


              <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>Bank Branch</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{bankbranch}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />


          </View>

          


          <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 250}}>

            {assignclassitem.map(((item,index )=> (
              <>
                <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>{index}</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{item?.name}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />
              
              </>

            )))}



          </View>

          <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 250}}>

          {assignsubjectitem.map(((item,index )=> (
              <>
                <TouchableOpacity>
                  <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                      <Text style={{textAlign: 'left',fontSize: 16}}>{index}</Text>
                        <View>
                          <Text style={{textAlign: 'left',fontSize: 16}}>{item?.name}</Text>
                          </View>
                        </View>
              </TouchableOpacity>

              <Divider bold={true} style={{marginVertical: 10}} />
              
              </>

            )))}



          </View>

          <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 250}}>

            {resume !=="" ? <Button icon="download">Download</Button> : (
              <Text>No File Available</Text>
            )}

          </View>

        
        </TabbedHeaderPager>
         )}
        </>
        // <StatusBar barStyle="light-content" backgroundColor="#1ca75d" translucent />
    )
}

export default Staffprofile;

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