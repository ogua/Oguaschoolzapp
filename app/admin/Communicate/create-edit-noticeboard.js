import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, SafeAreaView, Text, ToastAndroid, View } from 'react-native'
import { Button, Card, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { showMessage } from "react-native-flash-message";

function Createditnoticeboard() {

    const token = useSelector(selecttoken);
    const [name, setName] = useState("");
    const [message, setmessage] = useState("");
    const [opennoticefor, setOpennoticefor] = useState(false);
    const [noticefor, setnoticefor] = useState("");
    const [noticeforitems, setnoticeforItems] = useState([
      { label: 'Students', value: 'Students'},
      { label: 'Staff', value: 'Staff'},
      { label: 'General', value: 'General'}
    ]);
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

    useEffect(()=>{
    //  DeviceEventEmitter.removeAllListeners("subject.added");

      if(id == undefined){
        isCreatedorEdit('Noticeboard');
      }else{
        loaddata();
        isCreatedorEdit('Edit Noticeboard');
      }


    },[]);

    const loaddata = () => {
      
      setLoading(true);

      axios.get(schoolzapi+'/noticeboard/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          setName(response.data.data.title);
          setmessage(response.data.data.message);
          setnoticefor(response.data.data.noticefor);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }

    const createdata = () => {

        if(name == ""){
          alert('Title cant be empty');
          return;
        }

        if(message == ""){
            alert('Message cant be empty');
            return;
          }

          if(noticefor == ""){
            alert('Notice For cant be empty');
            return;
          }

        setLoading(true);

        const formdata = {
            title: name,
            noticefor,
            message
        }

        axios.post(schoolzapi+'/noticeboard',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            setLoading(false);

            DeviceEventEmitter.emit('subject.added', {});

            showMessage({
                message: 'Updated Successfully!',
                type: "success",
                position: 'bottom',
              });

           
            router.back();
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }

    const updatedata = () => {

        if(name == ""){
            alert('Title cant be empty');
            return;
          }
  
          if(message == ""){
              alert('Message cant be empty');
              return;
            }
  
            if(noticefor == ""){
              alert('Notice For cant be empty');
              return;
            }   

      setLoading(true);

      const formdata = {
        title: name,
        noticefor,
        message
    }

      axios.patch(schoolzapi+'/noticeboard/'+id,
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          DeviceEventEmitter.emit('subject.added', {});
            
          showMessage({
            message: 'Updated Successfully!',
            type: "success",
            position: 'bottom',
          });
          
          router.back();
        })
        .catch(function (error) {
          setLoading(false);
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

        <Card>
            <Card.Content>
            <TextInput
              label="Title"
              mode="outlined"
              onChangeText={(e) => setName(e)}
              value={name} />


                  <DropDownPicker
                    open={opennoticefor}
                    value={noticefor}
                    items={noticeforitems}
                    setOpen={setOpennoticefor}
                    setValue={setnoticefor}
                    setItems={setnoticeforItems}
                    placeholder={"Notice For"}
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

             <TextInput
              label="Message"
              multiline={true}
              mode="outlined"
              numberOfLines={5}
              onChangeText={(e) => setmessage(e)}
              value={message} />


            {isloading ? <ActivityIndicator size="large" color="#1782b6" style={{marginTop: 20}} /> : (
               
                <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 20}}>
                Save
                </Button>
              )}
            
            </Card.Content>
        </Card>


      </SafeAreaView>
    )
}

export default Createditnoticeboard;

