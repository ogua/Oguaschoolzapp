import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView,
   StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Image, DeviceEventEmitter } from 'react-native'
import { Button, Card, Divider, List, Modal, Portal, Switch, TextInput, Provider, Avatar, Dialog } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { DatePickerInput, DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCallback } from 'react';
import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import { selectschool, selecttoken, selectuser } from '../../features/userinfoSlice';
import { schoolzapi } from '../constants';
import AnimatedMultistep from "react-native-animated-multistep";
import * as Imagepicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { LocaleConfig, Calendar } from "react-native-calendars";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showMessage } from "react-native-flash-message";
import { ScrollView } from 'react-native-gesture-handler';
import MultiSelect from 'react-native-multiple-select';




function AddStaff() {

  const token = useSelector(selecttoken);
  const user = useSelector(selectuser);
  const school = useSelector(selectschool);
  const [link,setlink] = useState("");

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
    const [ssnit, setssnit] = useState("");
    
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


    const {id} = useSearchParams();


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

        if(title == ""){
          alert('Title cant be empty');
          return;
        }

        if(surname == ""){
          alert('Surname cant be empty');
          return;
        }

        if(firstname == ""){
          alert('Firstname cant be empty');
          return;
        }

        if(email == ""){
          alert('Email cant be empty');
          return;
        }

        if(gender == ""){
          alert('Gender cant be empty');
          return;
        }

        if(maritalstatus == ""){
          alert('Marital status cant be empty');
          return;
        }

        if(nationality == ""){
            alert('Country cant be empty');
            return;
        }

        if(maritalstatus == ""){
            alert('maritalstatus cant be empty');
            return;
        }

        if(staffrole == ""){
            alert('Staff role cant be empty');
            return;
        }

        if(salarygrade == ""){
          alert('Salary grade cant be empty');
          setupcurrentstep(3);
          return;
      }

      if(salary == ""){
        alert('Salary cant be empty');
        setupcurrentstep(3);
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

      if(document != null){

        data.append('document', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType
        });

      }

      data.append('title',title);
      data.append('surname',surname);
      data.append('firstname',firstname);
      data.append('othernames',othernames);
      data.append('branch',branch);
      data.append('zipcode',zipcode);
      data.append('mobile',mobile);
      data.append('email',email);
      data.append('gender',gender);
      data.append('maritalstatus',maritalstatus);
      data.append('dateofbirth',dateofbirth);
      data.append('nationality',nationality);
      data.append('towncity',towncity);
      data.append('stateprovince',stateprovince);
      data.append('address',address);
      data.append('workingexp',workingexp);
      data.append('qualification',qualification);
      data.append('staffrole',staffrole);
      data.append('staffid',staffid);

      data.append('fathername',fathername);
      data.append('fathernumber',fathernumber);
      data.append('mothername',mothername);
      data.append('mothernumber',mothernumber);

      data.append('salarygrade',salarygrade);
      data.append('salary',salary);
      data.append('ssnit',ssnit);

      data.append('acctitle',acctitle);
      data.append('accnumber',accnumber);
      data.append('bankname',bankname);
      data.append('bankbranch',bankbranch);

      data.append('assignclass',assignclass);
      data.append('assignsubject',assignsubject);

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

            console.log(response.data);

            if(response.data.message){

                showMessage({
                    message: 'Staff Added Successfully!',
                    type: "success",
                    position: 'bottom',
                });

                DeviceEventEmitter.emit('subject.added', {});
                //navigation.navigate("AddStaff");
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

  

  useEffect(()=> {

    setTimeout(() => {
      setisloading(false);
    }, 1000);

  },[step]);


  useEffect(()=> {

    setlink(schoolzapi+"/staff");
    setIssubmitting(false);
     loaddata();
   },[]);


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

function studentsubjects() {

    return axios.get(schoolzapi+'/subject',
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    });
}



const loaddata = () => {

    setisloading(true);
    Promise.all([countries(), studentclasses(), studentsubjects()])
    .then(function (response) {
      loaddropdown(response[1].data.data);
      loadcountries(response[0].data.data);
      loadsubject(response[2].data.data);

      console.log(response[2].data.data);

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

   mddatas.map(item =>  mdata.push({ name: item?.name, id: item?.id}))
  
   setassignclassitems(mdata);

   setisloading(false); 
}

const loadsubject = (subject) => {
      
    const mddatas = subject;
    
    let mdata = [];
  
     mddatas.map(item =>  mdata.push({ name: item?.name, id: item?.id}))
    
     setassignsubjectitems(mdata);
  
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

  async function documentfile() {
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
          setdocument(result);
        }
      }
    } catch (err) {
      setdocument(null);
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
    <Provider>
        <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen  options={{
            headerTitle: 'New Staff'
        }} />

        <View>
            <ScrollView
            horizontal
            >
              <Button style={{marginRight: 20}} mode="elevated" textColor={step === 1 ? `blue` : `#000`} onPress={() => setupcurrentstep(1)}>Personal Information</Button>
              <Button style={{marginRight: 20}} mode="elevated" textColor={step === 2 ? `blue` : `#000`} onPress={() => setupcurrentstep(2)}>Contact Persons Information</Button>
              <Button style={{marginRight: 20}} mode="elevated" textColor={step === 3 ? `blue` : `#000`} onPress={() => setupcurrentstep(3)}>Payroll Information</Button>
              <Button style={{marginRight: 20}} mode="elevated" textColor={step === 4 ? `blue` : `#000`} onPress={() => setupcurrentstep(4)}>Bank Information</Button>
              <Button style={{marginRight: 20}} mode="elevated" textColor={step === 5 ? `blue` : `#000`} onPress={() => setupcurrentstep(5)}>Assign Classes and Subjects</Button>
              <Button style={{marginRight: 50}} mode="elevated" textColor={step === 6 ? `blue` : `#000`} onPress={() => setupcurrentstep(6)}>Document</Button>  
            </ScrollView>
        </View>

        {isloading ? <ActivityIndicator size="large"  style={{marginTop: 30}} /> : (
          <KeyboardAwareScrollView>
          <ScrollView>
            {/* IF STATE IS ONE SHOW PERSONAL INFORMATION */}
            {step === 1 && (
              <>
                 <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10}}>

                    {pic ? <Image source={{uri: pic}} style={{width: 100, height: 100}}
                    /> : null}   

                    <Button icon="file" onPress={selectFile} uppercase={false} mode="outlined"
                    style={{marginVertical: 20, width: 200}}>
                    Upload Image
                    </Button>

                </View>

                
 
                 <View style={{marginHorizontal: 10, marginTop: 20}}>

                 <Text>Title</Text>
                <DropDownPicker
                         open={opentitle}
                         value={title}
                         items={titleitem}
                         setOpen={setOpentitle}
                         setValue={settitle}
                         setItems={settitleitems}
                        // placeholder={"maritalstatus"}
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


                     <Text>Surname</Text>
                     <TextInput
                      style={styles.Forminput}
                      mode="outlined"
                      value={surname}
                      onChangeText={(e) => setsurname(e)}
                     />
 
                     <Text>Firstname</Text>
                     <TextInput
                      style={styles.Forminput}
                      mode="outlined"
                      value={firstname}
                      onChangeText={(e) => setfirstname(e)}
                     />
 
                     <Text>Other names</Text>
                     <TextInput
                      style={styles.Forminput}
                      mode="outlined"
                      value={othernames}
                      onChangeText={(e) => setothernames(e)}
                     />

           <Text>Zip code</Text>
              <TextInput
              style={styles.Forminput}
              mode="outlined"
              value={zipcode}
              onChangeText={(e) => setzipcode(e)}
              />

              <Text>Phone number</Text>
              <TextInput
              keyboardType="name-phone-pad"
              style={styles.Forminput}
              mode="outlined"
              value={mobile}
              onChangeText={(e) => setmobile(e)}
              />

              <Text>Email</Text>
              <TextInput
              keyboardType="email-address"
              style={styles.Forminput}
              mode="outlined"
              value={email}
              onChangeText={(e) => setemail(e)}
              />

                {/* CHECK IF ITS UNTOMA SCHOOL */}
                {user.uniqueid == 'd5604b40-025d-456a-ba25-69f5f0e2c265' && (
                    <>
                    <Text>Branch</Text>
                     <DropDownPicker
                         open={openbranch}
                         value={branch}
                         items={branchitem}
                         setOpen={setOpenbranch}
                         setValue={setbranch}
                         setItems={setbranchitems}
                        // placeholder={"maritalstatus"}
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
                    
                    </>
                )}
                    

 
                   <Text>Gender</Text>
                     <DropDownPicker
                         open={opengender}
                         value={gender}
                         items={genderitem}
                         setOpen={setOpengender}
                         setValue={setgender}
                         setItems={setgenderitems}
                        // placeholder={"maritalstatus"}
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


                   <Text style={{marginTop: 20}}>Marital Status</Text>
                     <DropDownPicker
                         open={openmaritalstatus}
                         value={maritalstatus}
                         items={maritalstatusitem}
                         setOpen={setOpenmaritalstatus}
                         setValue={setmaritalstatus}
                         setItems={setmaritalstatusitems}
                         placeholder={"maritalstatus"}
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
                 
                 <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                     <Text>Date of birth </Text>
                     <Button icon="calendar-range" onPress={() => setShowdialog(true)}> select Date</Button>
                 </View>
                  
                     <TextInput
                      style={styles.Forminput}
                      mode="outlined"
                     // onFocus={() => setShowdialog(true)}
                     // onPressIn={() => setShowdialog(true)}
                      placeholder='yyyy-mm-dd'
                      value={dateofbirth}
                     />
 
                     <Text>Country</Text>
                     <DropDownPicker
                        searchable
                         open={opennationality}
                         value={nationality}
                         items={nationalityitem}
                         setOpen={setOpennationality}
                         setValue={setnationality}
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
 
                    <Text>Town / City</Text>
                     <TextInput
                      style={styles.Forminput}
                      mode="outlined"
                      value={towncity}
                      onChangeText={(e) => settowncity(e)}
                     />
 
 
                    <Text>State / Province</Text>
                     <TextInput
                      style={styles.Forminput}
                      mode="outlined"
                      value={stateprovince}
                      onChangeText={(e) => setstateprovince(e)}
                     />
 
                     <Text>Address</Text>
                     <TextInput
                      style={styles.Forminput}
                      multiline
                      numberOfLines={6}
                      mode="outlined"
                      value={address}
                      onChangeText={(e) => setaddress(e)}
                     />

         <Text>Working Experience</Text>
              <TextInput
              style={styles.Forminput}
              mode="outlined"
              value={workingexp}
              onChangeText={(e) => setworkingexp(e)}
              />        


         <Text>Qualification</Text>
              <DropDownPicker
                  open={openqualification}
                  value={qualification}
                  items={qualificationitem}
                  setOpen={setOpenqualification}
                  setValue={setqualification}
                  setItems={setqualificationitems}
                // placeholder={"maritalstatus"}
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

            <Text>Staff Role</Text>
              <DropDownPicker
                  open={openstaffrole}
                  value={staffrole}
                  items={staffroleitem}
                  setOpen={setOpenstaffrole}
                  setValue={setstaffrole}
                  setItems={setstaffroleitems}
                // placeholder={"maritalstatus"}
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
                      minHeight: 40,
                  }}
              />
              

              <Text style={{marginTop: 20}}>Staff ID</Text>
              <TextInput
              mode="outlined"
              value={staffid}
              onChangeText={(e) => setstaffid(e)}
              />
              <Text>Leave Blank to Auto Generate ID</Text>
 
                    
                 </View>
                 
                 {/* <Button onPress={() => props.next()} mode="contained">
                     Go Next
                 </Button>
 
                 <Button onPress={() => props.back()} mode="contained">
                     Go Back
                 </Button> */}
 
             <Portal>
                 <Dialog visible={showdialog} onDismiss={hideDialog}>
                     <Dialog.Content>
 
                     <Calendar
                        visible={true}
                         onDayPress={(day) => {
                             setSelecteddate(day.dateString);
                             setDateofbirth(day.dateString);
                             setShowdialog(false);
                             //console.log(day.dateString);
                         }}
                         markedDates={{
                             [selecteddate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                         }}
                         enableSwipeMonths={true}
                     />
 
                     </Dialog.Content>
                     <Dialog.Actions>
                         <Button onPress={hideDialog}>Cancel</Button>
                     </Dialog.Actions>
                 </Dialog>
             </Portal>
              </>
            )}


            {/* CHECK IF ITS ACADEMIC INFORMATION */}
            {step === 2 && (
              <View style={{marginHorizontal: 10}}>
              <Text>Fathers name</Text>
              <TextInput
               //style={styles.Forminput}
               mode="outlined"
               value={fathername}
               onChangeText={(e) => setfathername(e)}
              />

            <Text style={{marginTop: 20}}>Fathers number</Text>
              <TextInput
              style={styles.Forminput}
              mode="outlined"
              value={fathernumber}
              onChangeText={(e) => setfathernumber(e)}
              />


           <Text style={{marginTop: 20}}>Mothers name</Text>
              <TextInput
              style={styles.Forminput}
              mode="outlined"
              value={mothername}
              onChangeText={(e) => setmothername(e)}
              />


          <Text style={{marginTop: 20}}>Mothers number</Text>
              <TextInput
              style={styles.Forminput}
              mode="outlined"
              value={mothernumber}
              onChangeText={(e) => setmothernumber(e)}
              />

          </View>
            )}




          {/* CHECK IF INFORMATION IS GURDIAN INFORMATION */}
          {step === 3 && (

              <View style={{marginHorizontal: 10}}>
              
              <Text>Salary grade</Text>
              <DropDownPicker
                  open={opensalarygrade}
                  value={salarygrade}
                  items={salarygradeitem}
                  setOpen={setOpensalarygrade}
                  setValue={setsalarygrade}
                  setItems={setsalarygradeitems}
                // placeholder={"maritalstatus"}
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

              <Text>Salary</Text>
              <TextInput
                style={styles.Forminput}
                mode="outlined"
                value={salary}
                onChangeText={(e) => setsalary(e)}
              />

              <Text>SSNIT #</Text>
              <TextInput
                style={styles.Forminput}
                mode="outlined"
                value={ssnit}
                onChangeText={(e) => setssnit(e)}
              />
              
              </View>

          )}




          {/* CHECK IF ITS PAYMENT INFORMATION */}
          {step === 4 && (
            <View style={{marginHorizontal: 10, marginTop: 20}}>
             <Text>Account Title</Text>
              <TextInput
              style={styles.Forminput}
              mode="outlined"
              value={acctitle}
              onChangeText={(e) => setacctitle(e)}
              />

              <Text>Account Number</Text>
              <TextInput
              style={styles.Forminput}
              mode="outlined"
              value={accnumber}
              onChangeText={(e) => setaccnumber(e)}
              />

              <Text>Bank name</Text>
              <TextInput
              style={styles.Forminput}
              mode="outlined"
              value={bankname}
              onChangeText={(e) => setbankname(e)}
              />

         <Text>Bank branch</Text>
              <TextInput
              keyboardType="email-address"
              style={styles.Forminput}
              mode="outlined"
              value={bankbranch}
              onChangeText={(e) => setbankbranch(e)}
              />
        </View>
              
          )}


          {/* CHECK IF ITS ASSIGN CLASS AND SUBJECTS INFORMATION */}
          {step === 5 && (
            <View style={{marginHorizontal: 10, marginTop: 20}}>
            <Text>Assign Class</Text>
            <MultiSelect
            style={[styles.Forminput,{
            height: 60,
            borderColor: '#000',
            borderRadius: 20
            }]}
          hideTags
          items={assignclassitem}
          uniqueKey="id"
          //ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={setOpenassignclass}
          selectedItems={assignclass}
          selectText=""
          searchInputPlaceholderText="Search Items..."
          onChangeInput={ (text)=> console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />


          <Text style={{marginTop: 20}}>Assign Subjects</Text>
          <MultiSelect
            style={[styles.Forminput,{
            height: 60,
            borderColor: '#000',
            borderRadius: 20
            }]}
          hideTags
          items={assignsubjectitem}
          uniqueKey="id"
          //ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={setOpenassignsubject}
          selectedItems={assignsubject}
          selectText=""
          searchInputPlaceholderText="Search Items..."
          onChangeInput={ (text)=> console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
            
        </View>
              
          )}

          {/* CHECK IF ITS PAYMENT INFORMATION */}
          {step === 6 && (
            <View style={{marginHorizontal: 10, marginTop: 20}}>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10}}>

                <Button icon="file" onPress={documentfile} uppercase={false} mode="outlined"
                style={{marginVertical: 20, width: 200}}>
                  Upload Attachment
                </Button>

                </View>
            
           </View>
              
          )}    


         {issubmitting ? <ActivityIndicator size="large" style={{marginTop: 30, marginBottom: 50}} /> : (
            <Button mode="contained" style={{marginTop: 30, marginBottom: 50, marginHorizontal: 20}} onPress={createdata}>Add Staff</Button>
         )}


          </ScrollView>
          </KeyboardAwareScrollView>
        )}
      
        </SafeAreaView>
    </Provider>
    )
}

export default AddStaff;

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