import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput,Portal, Dialog, Provider} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
//import MultiSelect from 'react-native-multiple-select';
import { cos } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LocaleConfig, Calendar } from "react-native-calendars";
import { showMessage } from "react-native-flash-message";


function Createeditstaffleave() {

    const token = useSelector(selecttoken);
    const [note, setnote] = useState("");
    const [estinateddays, setestinateddays] = useState("");
    const [ldate, setldate] = useState("");
    const [openbal, setopenbal] = useState("");
    const [bname, setbname] = useState("");
    const [branch, setbranch] = useState("");
    const [phone, setphone] = useState("");
    const [address, setaddress] = useState("");
    

    const [openleavetype, setOpenleavetype] = useState(false);
    const [leavetype, setleavetype] = useState("");
    const [leavetypeitems, setleavetypeItems] = useState([
      { label: 'Sick Leave', value: 'Sick Leave'},
      { label: 'Travel Leave', value: 'Travel Leave'},
      { label: 'Study Leave', value: 'Study Leave'},
      { label: 'Funeral Leave', value: 'Funeral Leave'},
      { label: 'Maternity Leave', value: 'Maternity Leave'},
      { label: 'Others', value: 'Others'},
    ]);
    
    const [openstatus, setOpenstatus] = useState(false);
    const [status, setstatus] = useState("");
    const [statusitems, setstatusItems] = useState([
      { label: 'Default Account', value: 1},
      { label: 'Normal Account', value: 0},
    ]);


    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Leave');
      }else{
        loadedit();
        isCreatedorEdit('Edit Leave');
      }

    },[]);


    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/staff-leave/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

          setldate(results.data.data.leavedate);
          setleavetype(results.data.data.leavetype);
          setestinateddays(results.data.data.days);
          setnote(results.data.data.reason);
          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log("error",error);
          
      });
  }


    const createdata = () => {

        if(ldate == ""){
          alert('Leave Date cant be empty');
          return;
        }

        if(leavetype == ""){
          alert('Leave Type cant be empty');
          return;
        }

        if(estinateddays == ""){
            alert('Estinated days cant be empty');
            return;
        }


        if(note == ""){
            alert('Leave Note cant be empty');
            return;
          }

  
        setIssubmitting(true);

        const formdata = {
         ldate,
         leavetype,
         estinateddays,
         note
        }

        axios.post(schoolzapi+'/staff-leave',
        formdata,
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

        if(ldate == ""){
            alert('Leave Date cant be empty');
            return;
          }
  
          if(leavetype == ""){
            alert('Leave Type cant be empty');
            return;
          }
  
          if(estinateddays == ""){
              alert('Estinated days cant be empty');
              return;
          }
  
  
          if(note == ""){
              alert('Leave Note cant be empty');
              return;
            }
  
    
          setIssubmitting(true);
  
          const formdata = {
           ldate,
           leavetype,
           estinateddays,
           note
          }
    
      axios.patch(schoolzapi+'/staff-leave/'+id,
      formdata,
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
        
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Text>Leave Date </Text>
    <Button icon="calendar-range" onPress={() => setShowdialog(true)}> Select Date</Button>
</View>
<Portal>
    <Dialog visible={showdialog} onDismiss={hideDialog}>
        <Dialog.Content>
            <Calendar
                visible={true}
                onDayPress={(day) => {
                setSelecteddate(day.dateString);
                setldate(day.dateString);
                setShowdialog(false);
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
<TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={ldate}
        onChangeText={(e) => setldate(e)}
        />


<Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Leave Type</Text>
               <DropDownPicker
                    open={openleavetype}
                    value={leavetype}
                    items={leavetypeitems}
                    setOpen={setOpenleavetype}
                    setValue={setleavetype}
                    setItems={setleavetypeItems}
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

        

        <Text style={{fontSize: 15, fontWeight: 500}}>Estimated Days</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={estinateddays}
        onChangeText={(e) => setestinateddays(e)}
        />
            

       <Text style={{fontSize: 15, fontWeight: 500}}>Note</Text>
        <TextInput
        style={styles.Forminputhelp}
        multiline={true}
        numberOfLines={5}
        mode="outlined"
        value={note}
        onChangeText={(e) => setnote(e)}
        />


      
                

        {issubmitting ? <ActivityIndicator style={{marginTop: 30}} size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 30}}>
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

export default Createeditstaffleave;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});