import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Button, Card, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { showMessage } from "react-native-flash-message";

function Createeditenquiry() {

    const token = useSelector(selecttoken);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

    const [open, setOpen] = useState(false);
    const [gender, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Male', value: 'Male'},
        {label: 'Female', value: 'Female'}
    ]);

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Enquiry');
      }else{
        loaddata();
        isCreatedorEdit('Edit Enquiry');
      }


    },[]);

    const loaddata = () => {
      
      setLoading(true);

      axios.get(schoolzapi+'/enquiry/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          setName(response.data.data.fullname);
          setValue(response.data.data.gender);
          setPhone(response.data.data.phone);
          setEmail(response.data.data.email);
          setAddress(response.data.data.location);
          setNote(response.data.data.note);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }

    const createdata = () => {

        if(name == ""){
          alert('Subject cant be empty');
          return;
        }

        if(gender == ""){
            alert('Gender cant be empty');
            return;
        }

        if(note == ""){
            alert('Note cant be empty');
            return;
        }

        if(phone == ""){
            alert('Phone number cant be empty');
            return;
        }

        setIssubmitting(true);

        const formdata = {
            fullname: name,
            gender: gender,
            phone: phone,
            email: email,
            location: address,
            note: note,
        }

        axios.post(schoolzapi+'/enquiry',
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
            console.log(error);
          });
    }

    const updatedata = () => {

        if(name == ""){
            alert('Subject cant be empty');
            return;
          }
  
          if(gender == ""){
              alert('Gender cant be empty');
              return;
          }
  
          if(note == ""){
              alert('Note cant be empty');
              return;
          }
  
          if(phone == ""){
              alert('Phone number cant be empty');
              return;
          }
      
      
      setIssubmitting(true);

      const formdata = {
        fullname: name,
        gender: gender,
        phone: phone,
        email: email,
        location: address,
        note: note,
    }

      axios.patch(schoolzapi+'/enquiry/'+id,
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
          console.log(error);
        });
  }

    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: creatoredit,
                presentation: 'formSheet'
            }}
        />
        <ScrollView>

        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (

        <Card>
            <Card.Content>

            <Text style={{fontSize: 15, fontWeight: 500}}>Full name</Text>
            <TextInput
             style={styles.Forminput}
             mode="outlined"
              onChangeText={(e) => setName(e)}
              value={name} />

          <Text style={{fontSize: 15, fontWeight: 500}}>Choose Gender</Text>
           <DropDownPicker
                    open={open}
                    value={gender}
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
                        //backgroundColor: "#F5F7F6",
                        minHeight: 40,
                    }}
           />

<Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Phone number</Text>
            <TextInput
            style={styles.Forminput}
             mode="outlined"
             keyboardType="phone-pad"
              onChangeText={(e) => setPhone(e)}
              value={phone} />


<Text style={{fontSize: 15, fontWeight: 500}}>Email Address</Text>
        <TextInput
            style={styles.Forminput}
             mode="outlined"
             keyboardType="email-address"
              onChangeText={(e) => setEmail(e)}
              value={email} />

          
<Text style={{fontSize: 15, fontWeight: 500}}>Address</Text>
           <TextInput
           style={styles.Forminput}
             mode="outlined"
              keyboardType="default"
              onChangeText={(e) => setAddress(e)}
              value={address} /> 

      
<Text style={{fontSize: 15, fontWeight: 500}}>Note</Text>
          <TextInput
            style={styles.Forminput}
            mode="outlined"
            multiline={true}
            numberOfLines={5}
            keyboardType="default"
            onChangeText={(e) => setNote(e)}
            value={note} /> 



            
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
    )
}

export default Createeditenquiry;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    }
});