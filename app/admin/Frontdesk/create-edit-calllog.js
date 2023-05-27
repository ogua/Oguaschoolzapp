import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Button, Card, TextInput, Portal, Dialog, Provider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import { LocaleConfig, Calendar } from "react-native-calendars";
import { showMessage } from "react-native-flash-message";



function Createeditcalllogs() {

    const token = useSelector(selecttoken);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [callduration, setCallduration] = useState("");
    const [selecteddate, setSelecteddate] = useState('');
    const [followup, setfollowup] = useState('');
    const [note, setNote] = useState("");

const [showdialog, setShowdialog] = useState(false);
const hideDialog = () => setShowdialog(false);

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

    const [open, setOpen] = useState(false);
    const [calltype, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: "Incoming Call", value: "Incoming Call"},
        { label: "Outgoing Call", value: "Outgoing Call"}
    ]);


    const [showintime, setShowintime] = useState(false);
    const onDismissintime = useCallback(() => {
        setShowintime(false)
    }, [setShowintime]);

    const onConfirmintime = useCallback(
        ({ hours, minutes }) => {
         setShowintime(false);
         setCallduration(hours+':'+minutes);
        },
        [setShowintime]
    );


    const [showouttime, setShowouttime] = useState(false);
    const onDismissouttime = useCallback(() => {
        setShowouttime(false)
    }, [setShowouttime]);

    const onConfirmouttime = useCallback(
        ({ hours, minutes }) => {
         setShowouttime(false);
         setOuttime(hours+':'+minutes);
        },
        [setShowouttime]
    );

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Call Log');
      }else{
        loaddata();
        isCreatedorEdit('Edit Call Log');
      }

    },[]);

    const loaddata = () => {
      
      setLoading(true);

      axios.get(schoolzapi+'/calllogs/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          setName(response.data.data.fullname);
          setPhone(response.data.data.phone);
          setCallduration(response.data.data.duration);
          setfollowup(response.data.data.followupdate);
          setNote(response.data.data.note);
          setValue(response.data.data.type);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }

    const createdata = () => {

        if(name == ""){
          alert('Fullname cant be empty');
          return;
        }

        if(phone == ""){
            alert('Phone number cant be empty');
            return;
        }

        if(calltype == ""){
          alert('Call Type cant be empty');
          return;
        }

        setIssubmitting(true);

        const formdata = {
            fullname: name,
            phone: phone,
            duration: callduration,
            followupdate: followup,
            note: note,
            type: calltype
        }
    

        axios.post(schoolzapi+'/calllogs',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            setIssubmitting(false);

            showMessage({
              message: 'Info recorded Successfully!',
              type: "success",
              position: 'bottom',
            });
          
            DeviceEventEmitter.emit('subject.added', {});
            router.back();
            
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log(error.response);
          });
    }

    const updatedata = () => {

        if(name == ""){
            alert('Fullname cant be empty');
            return;
          }
  
          if(phone == ""){
              alert('Phone number cant be empty');
              return;
          }
  
          if(calltype == ""){
            alert('Call Type cant be empty');
            return;
          }

    const formdata = {
        fullname: name,
        phone: phone,
        duration: callduration,
        followupdate: followup,
        note: note,
        type: calltype
    }
    
    setIssubmitting(true);

      axios.patch(schoolzapi+'/calllogs/'+id,
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setIssubmitting(false);

          showMessage({
            message: 'Info recorded Successfully!',
            type: "success",
            position: 'bottom',
          });
        
          DeviceEventEmitter.emit('subject.added', {});
          router.back();

          
        })
        .catch(function (error) {
            setIssubmitting(false);
          console.log(error.response);
        });
  }


    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: creatoredit,
                presentation: 'formSheet',
                // headerRight: () => (
                //   <>
                //     {isloading && <ActivityIndicator size="large" color="#1782b6" />}
                //   </>
                // )
            }}

        />
      

        <ScrollView style={{marginBottom: 30}}>
        
        {isloading ? <ActivityIndicator size="large" color="#1782b6" style={{justifyContent: 'center'}} /> : (

        <Card>
            <Card.Content>

            <Text style={{fontSize: 15, fontWeight: 500}}>Fullname</Text>
            <TextInput
             style={styles.Forminput}
             mode="outlined"
              onChangeText={(e) => setName(e)}
              value={name} />

          <Text style={{fontSize: 15, fontWeight: 500}}>Phone Number</Text>
            <TextInput
            style={styles.Forminput}
             mode="outlined"
             keyboardType="phone-pad"
              onChangeText={(e) => setPhone(e)}
              value={phone} />


       <TimePickerModal
          visible={showintime}
          onDismiss={onDismissintime}
          onConfirm={onConfirmintime}
          hours={12}
          minutes={14}
        />

       <Text style={{fontSize: 15, fontWeight: 500}}>Calll Duration</Text>
         <TextInput
            style={styles.Forminput}
            mode="outlined"
            keyboardType="default"
            onFocus={()=>  setShowintime(true)}
            onChangeText={(e) => setIntime(e)}
            value={callduration} />


<View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Text>Choose Follow up Date </Text>
    <Button icon="calendar-range" onPress={() => setShowdialog(true)}> select Date</Button>
</View>
<Portal>
    <Dialog visible={showdialog} onDismiss={hideDialog}>
        <Dialog.Content>
            <Calendar
                visible={true}
                onDayPress={(day) => {
                setSelecteddate(day.dateString);
                setfollowup(day.dateString);
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
            style={styles.Forminput}
            mode="outlined"
            value={followup}
            onChangeText={(e) => setfollowup(e)}
            />
           

        <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Note</Text>
        <TextInput
            style={styles.Forminput}
            mode="outlined"
            multiline={true}
            numberOfLines={5}
            keyboardType="default"
            onChangeText={(e) => setNote(e)}
            value={note} />

            
              <Text style={{fontSize: 15, fontWeight: 500}}>Call Type</Text>
           <DropDownPicker
                    open={open}
                    value={calltype}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
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
                        minHeight: 40,
                        //marginTop: 20
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
      </SafeAreaView>
      </Provider>
    )
}

export default Createeditcalllogs;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    }
});