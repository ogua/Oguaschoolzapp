import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput } from 'react-native-paper';
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

function Createeditroutes() {

    const token = useSelector(selecttoken);
    const [routeno, setrouteno] = useState("");
    const [routename, setroutename] = useState("");
    const [pickup, setpickup] = useState("");
    const [pickend, setpickend] = useState("");

    const [opentripway, setOpentripway] = useState(false);
    const [tripway, settripway] = useState(null);
    const [tripwayitems, settripwayItems] = useState([
        { label: "Up(Going)", value: "Up(Going)"},
        { label: "Down(Return)", value: "Down(Return)"},
    ]);

    
    const [showpickupstart, setshowpickupstart] = useState(false);
    const onDismisspickupstart = useCallback(() => {
        setshowpickupstart(false)
    }, [setshowpickupstart]);

    const onConfirmpickupstart = useCallback(
        ({ hours, minutes }) => {
            setshowpickupstart(false);
            setpickup(hours+':'+minutes);
        },
        [setshowpickupstart]
    );


    const [showpickupend, setshowpickupend] = useState(false);
    const onDismisspickupend = useCallback(() => {
        setshowpickupend(false)
    }, [setshowpickupend]);

    const onConfirmpickupend = useCallback(
        ({ hours, minutes }) => {
            setshowpickupend(false);
            setpickend(hours+':'+minutes);
        },
        [setshowpickupend]
    );




    const [openvehicle, setOpenvehicle] = useState(false);
    const [vehicle, setVehicle] = useState();
    const [vehicleitems, setvehicleItems] = useState([]);


    const [waypointitems, setwaypointitems] = useState([]);
    const [selectedItems, setselectedItems] = useState([]);

    const onSelectedItemsChange = selectedItems => {
        setselectedItems(selectedItems);
    };

    
    const [studentsitems, setstudentsitems] = useState([]);
    const [studentItems, setselectedstudentsItems] = useState([]);

    const onstudentItemsChange = selectedItems => {
      setselectedstudentsItems(selectedItems);
    };

   


    const [staffitems, setstaffitems] = useState([]);
    const [staffselectedItems, setselectedstaffItems] = useState([]);

    const onstaffItemsChange = selectedItems => {
      setselectedstaffItems(selectedItems);
    };


    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      loaddata();

      if(id == undefined){
        isCreatedorEdit('New Route');
      }else{
        loadedit();
        isCreatedorEdit('Edit Route');
      }

    },[]);

      
      function getallvehicles() {

        return axios.get(schoolzapi+'/vehicle',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }

      function getwaypoins() {

        return axios.get(schoolzapi+'/waypoint',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }

     function getstudent() {

        return axios.get(schoolzapi+'/student-info',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }



     function getstaff() {

        return axios.get(schoolzapi+'/staff',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }


     const loaddata = () => {
        setLoading(true);
        
        Promise.all([getallvehicles(), getwaypoins(), getstudent(), getstaff()])
        .then(function (results) {
            ///setLoading(false);
            const vehicle = results[0];
            const waypoint = results[1];
            const student = results[2];
            const staff = results[3];

            //loaddropdown(staff.data.data);
            loadvehicle(vehicle.data.data);
            loadwaypoint(waypoint.data.data);
            loadstudent(student.data.data);
            loadstaff(staff.data.data);

            if(id == undefined){
              setLoading(false);
            }

        }).catch(function(error){
            setLoading(false);
            const acct = error[0];
            const studeclass = error[1];
            
        });
    }

    

    function geteditwaypoint() {

      return axios.get(schoolzapi+'/waypoint-edit/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      });
   }

   function geteditstudent() {

      return axios.get(schoolzapi+'/student-edit/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      });
   }



   function geteditstaff() {

      return axios.get(schoolzapi+'/staff-edit/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      });
   }


   function geteditroute() {

    return axios.get(schoolzapi+'/routes/show/'+id,
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    });
 }


    const loadedit = () => {
      setLoading(true);
      
      Promise.all([geteditwaypoint(), geteditstudent(), geteditstaff(), geteditroute()])
      .then(function (results) {
          
          const waypoint = results[0];
          const student = results[1];
          const staff = results[2];
          const route = results[3];

          //console.log("route",route.data.data.tripway);

          setselectedItems(waypoint.data.data);
          setselectedstudentsItems(student.data.data);
          setselectedstaffItems(staff.data.data);   

          setrouteno(route.data.data.routeno);
          setroutename(route.data.data.name);
          setpickup(route.data.data.pickupstart);
          setpickend(route.data.data.pickupend);
          settripway(route.data.data.tripway);
          setVehicle(parseInt(route.data.data.vehicle_id));

          setLoading(false);
          

      }).catch(function(error){
          setLoading(false);
          const acct = error[0];
          const studeclass = error[1];
          
      });
  }

    const loadvehicle = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setvehicleItems(mdata);
  
       // console.log(items);
    }


    const loadwaypoint = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ id: item?.id, name: item?.name}))
        
         setwaypointitems(mdata);
      }


      const loadstudent = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ id: item?.id, name: item?.fullname}))
        
         setstudentsitems(mdata);
      }

      const loadstaff = (data) => {

       // console.log(data);
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ id: item?.id, name: item?.fullname}))
        
         setstaffitems(mdata);
      }

    const createdata = () => {

        if(routeno == ""){
          alert('Routeno cant be empty');
          return;
        }

        if(routename == ""){
            alert('Route name cant be empty');
            return;
        }

        if(tripway == ""){
          alert('Tripway cant be empty');
          return;
        }

        if(pickup == ""){
          alert('Pickup start cant be empty');
          return;
        }

        if(pickend == ""){
          alert('Pickup End cant be empty');
          return;
        }

        if(vehicle == ""){
            alert('Vehicle cant be empty');
            return;
        }

        if(selectedItems == ""){
          alert('Waypoints cant be empty');
          return;
        }


        if(studentItems == ""){
          alert('Students cant be empty');
          return;
      }

      if(staffselectedItems == ""){
        alert('Students cant be empty');
        return;
    }


        setIssubmitting(true);

        const formdata = {
          routeno: routeno,
          name: routename,
          tripway: tripway,
          pickupstart: pickup,
          pickupend: pickend,
          vehicle: vehicle,
          waypoints: selectedItems,
          students: studentItems,
          staff: staffselectedItems,
        }

        axios.post(schoolzapi+'/routes',
        formdata,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            ToastAndroid.show('info saved successfully!', ToastAndroid.SHORT);
            setIssubmitting(false);
            DeviceEventEmitter.emit('subject.added', {});
            router.back();
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log(error.response);
          });
    }

    const updatedata = () => {

      if(routeno == ""){
        alert('Routeno cant be empty');
        return;
      }

      if(routename == ""){
          alert('Route name cant be empty');
          return;
      }

      if(tripway == ""){
        alert('Tripway cant be empty');
        return;
      }

      if(pickup == ""){
        alert('Pickup start cant be empty');
        return;
      }

      if(pickend == ""){
        alert('Pickup End cant be empty');
        return;
      }

      if(vehicle == ""){
          alert('Vehicle cant be empty');
          return;
      }

      if(selectedItems == ""){
        alert('Waypoints cant be empty');
        return;
      }


      if(studentItems == ""){
        alert('Students cant be empty');
        return;
    }

    if(staffselectedItems == ""){
      alert('Students cant be empty');
      return;
  }


      setIssubmitting(true);

      const formdata = {
        routeno: routeno,
        name: routename,
        tripway: tripway,
        pickupstart: pickup,
        pickupend: pickend,
        vehicle: vehicle,
        waypoints: selectedItems,
        students: studentItems,
        staff: staffselectedItems,
      }
    
      axios.patch(schoolzapi+'/routes/'+id,
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setIssubmitting(false);
          DeviceEventEmitter.emit('subject.added', {});
          router.back();
        })
        .catch(function (error) {
          setIssubmitting(false);
          console.log(error.response);
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
        }
      }
    } catch (err) {
      setFile(null);
      console.warn(err);
      return false;
    }
  }

    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: creatoredit,
                presentation: 'formSheet',
                // headerRight: () => (
                //   <>
                //     {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : null}
                //   </>
                // )
            }}

        />
        <ScrollView style={{marginBottom: 30}}
        >
            <KeyboardAvoidingView
            behavior="height"
            >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>


        <Text style={{fontSize: 15, fontWeight: 500}}>Route no</Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setrouteno(e)}
        value={routeno} />


        <Text style={{fontSize: 15, fontWeight: 500}}>Route name</Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setroutename(e)}
        value={routename} />


<Text style={{fontSize: 15, fontWeight: 500}}>Trip way</Text>
               <DropDownPicker
                    open={opentripway}
                    value={tripway}
                    items={tripwayitems}
                    setOpen={setOpentripway}
                    setValue={settripway}
                    setItems={settripwayItems}
                    placeholder={"Trip way"}
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
                        minHeight: 50,
                        marginTop: 10
                    }}
                    /> 




        <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Pickup start</Text>
        
        <TimePickerModal
          visible={showpickupstart}
          onDismiss={onDismisspickupstart}
          onConfirm={onConfirmpickupstart}
          hours={12}
          minutes={14}
        />
    
           <TextInput
            style={styles.Forminput}
            mode="outlined"
            keyboardType="default"
            onFocus={()=>  setshowpickupstart(true)}
            onChangeText={(e) => setpickup(e)}
            value={pickup} />



      <Text style={{fontSize: 15, fontWeight: 500}}>Pickup End</Text>
        
        <TimePickerModal
          visible={showpickupend}
          onDismiss={onDismisspickupend}
          onConfirm={onConfirmpickupend}
          hours={12}
          minutes={14}
        />
    
           <TextInput
            style={styles.Forminput}
            mode="outlined"
            keyboardType="default"
            onFocus={()=>  setshowpickupend(true)}
            onChangeText={(e) => setpickend(e)}
            value={pickend} />
            
            <Text style={{fontSize: 15, fontWeight: 500}}>Choose a Vehicles</Text>
              <DropDownPicker
                    open={openvehicle}
                    value={vehicle}
                    items={vehicleitems}
                    setOpen={setOpenvehicle}
                    setValue={setVehicle}
                    setItems={setvehicleItems}
                    placeholder={"Choose a Vehicles"}
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
                        minHeight: 50,
                        marginBottom: 20
                    }}
                    />



<Text style={{fontSize: 15, fontWeight: 500}}>Waypoint Items</Text>            
       <MultiSelect
        style={[styles.Forminput,{
          height: 60,
          borderColor: '#000',
          borderRadius: 20
        }]}
          hideTags
          items={waypointitems}
          uniqueKey="id"
          //ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={selectedItems}
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




<Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Students</Text>            
       <MultiSelect
        style={styles.Forminput}
          hideTags
          items={studentsitems}
          uniqueKey="id"
          //ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={onstudentItemsChange}
          selectedItems={studentItems}
          selectText=""
          searchInputPlaceholderText="Search Student..."
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




<Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Staff</Text>            
       <MultiSelect
        style={styles.Forminput}
          hideTags
          items={staffitems}
          uniqueKey="id"
          //ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={onstaffItemsChange}
          selectedItems={staffselectedItems}
          selectText=""
          searchInputPlaceholderText="Search Staff..."
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

        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 20}}>
        Save
        </Button>
        )}

</Card.Content>
        </Card>
        )}
        </KeyboardAvoidingView>
        </ScrollView>


      </SafeAreaView>
    )
}

export default Createeditroutes;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    }
});