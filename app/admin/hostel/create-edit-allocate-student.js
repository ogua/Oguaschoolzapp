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
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LocaleConfig, Calendar } from "react-native-calendars";
import { showMessage } from "react-native-flash-message";


function Createeditallocatestudent() {

    const token = useSelector(selecttoken);

    const [openstudent, setOpenstudent] = useState(false);
    const [student, setstudent] = useState("");
    const [studentitems, setstudentItems] = useState([]);
    
    const [openhostel, setOpenhostel] = useState(false);
    const [hostel, sethostel] = useState(0);
    const [hostelitems, sethostelItems] = useState([]);

    const [openfloor, setOpenfloor] = useState(false);
    const [floor, setfloor] = useState(0);
    const [flooritems, setfloorItems] = useState(
        [
            { label: 'First Floor', value: 'First Floor'},
            { label: 'Second Floor', value: 'Second Floor'},
            { label: 'Third Floor', value: 'Third Floor'},
            { label: 'Fourth Floor', value: 'Fourth Floor'},
            { label: 'Fifth Floor', value: 'Fifth Floor'}
          ]
    );

    const [openroom, setOpenroom] = useState(false);
    const [room, setroom] = useState(0);
    const [roomitems, setroomItems] = useState([]);

    const [openbed, setOpenbed] = useState(false);
    const [bed, setbed] = useState(0);
    const [beditems, setbedItems] = useState([]);

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const [link, setlink] = useState("");
    const router = useRouter();
    const {id} = useSearchParams();
    

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('Allocate Student');
        setlink(schoolzapi+'/bank-transactions');
      }else{
        loadedit();
        setlink(schoolzapi+'/bank-transactions/'+id);
        isCreatedorEdit('Edit Allocated Student');
      }

      loaddata();

    },[]);


    function allstudents() {

        return axios.get(schoolzapi+'/student-info',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }
      
      function allhostel() {

        return axios.get(schoolzapi+'/hostel',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }

    const loaddata = () => {
        setLoading(true);
        
        Promise.all([allstudents(), allhostel()])
        .then(function (results) {
            setLoading(false);
            const stu = results[0];
            const hos = results[1];

            loadstudent(stu.data.data);
            loadhostel(hos.data.data);

        }).catch(function(error){
            setLoading(false);
            console.log(error);
            
        });
    }

    const loadstudent = (data) => {

        ///console.log(data);
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.fullname+" - "+item?.stclass, value: item?.id}))
        
         setstudentItems(mdata);
    }

    const loadhostel = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         sethostelItems(mdata);

         setLoading(false);
    }

    const loadroom = () => {

        setLoading(true);

        if(hostel == ""){
            alert('Hostel cant be empty');
            return;
        }

        const formdata = {
            hostel: hostel,
            floor: floor,
        }
        
        axios.post(schoolzapi+'/hostel-allocated-fetch-room',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        }).then(function (results) {
  
          // console.log(results.data.data.hostel);
           loadrooms(results.data.data);
            
        }).catch(function(error){
            setLoading(false);
            console.log(error);
        });
    }


    const loadrooms = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: `Room `+item?.roomno, value: item?.roomno}))
        
         setroomItems(mdata);

         setLoading(false);
    }


    const loadavailablebed = () => {

        setLoading(true);

        if(hostel == ""){
            alert('Hostel cant be empty');
            return;
        }

        if(floor == ""){
            alert('Floor cant be empty');
            return;
        }

        const formdata = {
            hostel: hostel,
            floor: floor,
            room: room
        }
        
        axios.post(schoolzapi+'/hostel-allocated-fetch-beds',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        }).then(function (results) {
  
          // console.log(results.data.available);
           loadbeds(results.data.available);
            
        }).catch(function(error){
            setLoading(false);
            console.log(error);
        });
    }

    const loadbeds = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: `Bed `+item, value: item}))
        
         setbedItems(mdata);

         setLoading(false);
    }


    const loadeditbed = () => {

      setLoading(true);

      if(hostel == ""){
          alert('Hostel cant be empty');
          return;
      }

      if(floor == ""){
          alert('Floor cant be empty');
          return;
      }

      const formdata = {
          hostel: hostel,
          floor: floor,
          room: room,
          student: student
      }
      
      axios.post(schoolzapi+'/hostel-allocated-fetch-all-beds',
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

        // console.log(results.data.available);
        loadeditbeds(results.data.available);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }

  const loadeditbeds = (data) => {
          
      const mddatas = data;
      
      let mdata = [];

       mddatas.map(item =>  mdata.push({ label: `Bed `+item, value: item}))
      
       setbedItems(mdata);

       setLoading(false);
  }




    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/hostel-allocated/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

          //console.log(results.data.data);
          setstudent(parseInt(results.data.data.studentid));
          sethostel(parseInt(results.data.data.hostelid));
          setfloor(results.data.data.floor);
          setroom(results.data.data.roomno);
          setbed(results.data.data.bed);
          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }


    const createdata = () => {

        if(student == ""){
          alert('Student name cant be empty');
          return;
        }

        if(hostel == ""){
          alert('Hostel cant be empty');
          return;
        }

        if(floor == ""){
          alert('Floor cant be empty');
          return;
        }

        if(room == ""){
          alert('Room cant be empty');
          return;
        }

        if(bed == ""){
          alert('Available Bed cant be empty');
          return;
        }
  
      setIssubmitting(true);

      const FormData = {
        student,
        hostel,
        floor,
        room,
        bed
      }

        axios.post(schoolzapi+'/hostel-allocated',
        FormData,
        {
            headers: {Accept: 'application/json',
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

      if(student == ""){
        alert('Student name cant be empty');
        return;
      }

      if(hostel == ""){
        alert('Hostel cant be empty');
        return;
      }

      if(floor == ""){
        alert('Floor cant be empty');
        return;
      }

      if(room == ""){
        alert('Room cant be empty');
        return;
      }

      if(bed == ""){
        alert('Available Bed cant be empty');
        return;
      }

    setIssubmitting(true);

    const FormData = {
      student,
      hostel,
      floor,
      room,
      bed
    }
    
      axios.patch(schoolzapi+'/hostel-allocated/'+id,
      FormData,
      {
          headers: {Accept: 'application/json',
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

            <Text style={{fontSize: 15, fontWeight: 500}}>Student name</Text>
               <DropDownPicker
                    open={openstudent}
                    value={student}
                    items={studentitems}
                    setOpen={setOpenstudent}
                    setValue={setstudent}
                    setItems={setstudentItems}
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

<Text style={{fontSize: 15, fontWeight: 500}}>Hostel</Text>
               <DropDownPicker
                    open={openhostel}
                    value={hostel}
                    items={hostelitems}
                    setOpen={setOpenhostel}
                    setValue={sethostel}
                    setItems={sethostelItems}
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




<Text style={{fontSize: 15, fontWeight: 500}}>Floor</Text>
               <DropDownPicker
                    open={openfloor}
                    value={floor}
                    items={flooritems}
                    setOpen={setOpenfloor}
                    setValue={setfloor}
                    setItems={setfloorItems}
                    onChangeValue={loadroom}
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

<Text style={{fontSize: 15, fontWeight: 500}}>Room</Text>
{id == undefined ? ( <DropDownPicker
                    open={openroom}
                    value={room}
                    items={roomitems}
                    setOpen={setOpenroom}
                    setValue={setroom}
                    onChangeValue={loadavailablebed}
                    setItems={setroomItems}
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
                    />) : ( <DropDownPicker
                      open={openroom}
                      value={room}
                      items={roomitems}
                      setOpen={setOpenroom}
                      setValue={setroom}
                      onChangeValue={loadeditbed}
                      setItems={setroomItems}
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
                      />)}                                 

   <Text style={{fontSize: 15, fontWeight: 500}}>Available Bed</Text>
               <DropDownPicker
                    open={openbed}
                    value={bed}
                    items={beditems}
                    setOpen={setOpenbed}
                    setValue={setbed}
                    setItems={setbedItems}
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

     {issubmitting ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 20}}>
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

export default Createeditallocatestudent;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});