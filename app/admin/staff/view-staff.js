import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView,
   StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Image, DeviceEventEmitter, RefreshControl } from 'react-native'
import { Button, Card, Divider, useColorScheme, List, Modal, Portal, Switch, TextInput, Provider, Avatar, Dialog } from 'react-native-paper';
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
import { ScrollView } from 'react-native-gesture-handler';
import MultiSelect from 'react-native-multiple-select';
import { selectschool, selecttoken, selectuser, setRoles } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';
import { TabbedHeaderPager, AvatarHeaderScrollView } from 'react-native-sticky-parallax-header';




function Viewstaff() {

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
  const [assignclassitem, setassignclassitems] = useState([]);
  const setOpenassignclass = selectedItems => {
    setassignclass(selectedItems);
  };


  const [assignsubject, setassignsubject] = useState([]);
  const [assignsubjectitem, setassignsubjectitems] = useState([]);
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


    const {id,userid} = useSearchParams();

    useEffect(()=> {

        setTimeout(() => {
          setisloading(false);
        }, 1000);
    
      },[step]);
    
    
      useEffect(()=> {
        isCreatedorEdit('Staff Information');
        loadedit();
        
       },[]);


       function showstaff() {

        return axios.get(schoolzapi+'/staff/show/'+id,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }

      function showuser() {

        return axios.get(schoolzapi+'/staff',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }

       const loadedit = () => {
        setisloading(true);
        
        Promise.all([showstaff()])
        .then(function (results) {
           // console.log(id);
          //  console.log("data",results[0].data.data.userstclass);
            setPic(results[0].data.data.pic);
            settitle(results[0].data.data.title);
            setsurname(results[0].data.data.surname);
            setfirstname(results[0].data.data.firstnames);
            setothernames(results[0].data.data.othernames);
            setbranch(results[0].data.data.branch);
            setzipcode(results[0].data.data.zipcode);
            setmobile(results[0].data.data.phone);
            setemail(results[0].data.data.email);
            setgender(results[0].data.data.gender);
            setmaritalstatus(results[0].data.data.maritalstatus);
            setDateofbirth(results[0].data.data.dateofbirth);
            setnationality(results[0].data.data.country);
            settowncity((results[0].data.data.towncity));
            setstateprovince((results[0].data.data.stateprovince));
            setaddress(results[0].data.data.address);
            setworkingexp(results[0].data.data.workexperience);
            setqualification(results[0].data.data.qualification);
            setstaffrole(results[0].data.data.role);
            setstaffid(results[0].data.data.eployid);
    
            setfathername(results[0].data.data.fathername);
            setfathernumber((results[0].data.data.fnumber));
            setmothername((results[0].data.data.mothername));
            setmothernumber(results[0].data.data.mnumber);

            setsalarygrade(results[0].data.data.salarygrade);
            setsalary((results[0].data.data.salary));

            setacctitle((results[0].data.data.acctitle));
            setaccnumber(results[0].data.data.accnum);
            setbankname(results[0].data.data.bankname);
            setbankbranch((results[0].data.data.bankbranch));

            loadstclasses(results[0].data.data.userstclass);
            loadstsubjects(results[0].data.data.usersubject);
            
          setisloading(false);
            
        }).catch(function(error){
            setisloading(false);
            console.log(error);
        });
    }


    const loadstclasses = (studclass) => {
      
      const mddatas = studclass;
      
      let mdata = [];
    
       mddatas.map(item =>  mdata.push(item.id));
      
       setassignclass(mdata);
    
       setisloading(false); 
    }

    const loadstsubjects = (stsubject) => {
      
      const mddatas = stsubject;
      
      let mdata = [];
    
       mddatas.map(item =>  mdata.push(item.id));
      
       setassignsubject(mdata);
    
       setisloading(false); 
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
    );
}

export default Viewstaff;

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