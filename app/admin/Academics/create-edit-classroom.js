import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, SafeAreaView, Text, ToastAndroid, View } from 'react-native'
import { Button, Card, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { useEffect } from 'react';

function Createeditsubject() {

    const token = useSelector(selecttoken);
    const [name, setName] = useState("");
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Class');
      }else{
        loaddata();
        isCreatedorEdit('Edit Class');
      }


    },[]);

    const loaddata = () => {
      
      setLoading(true);

      axios.get(schoolzapi+'/student-classes/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          setName(response.data.data.name);
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

        setLoading(true);

        const formdata = {
            name: name
        }

        axios.post(schoolzapi+'/student-classes',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            ToastAndroid.show('info saved successfully!', ToastAndroid.SHORT);
            setLoading(false);
            DeviceEventEmitter.emit('subject.added', {});
            router.back();
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }

    const updatedata = () => {

      setLoading(true);

      const formdata = {
          name: name
      }

      axios.patch(schoolzapi+'/student-classes/'+id,
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          DeviceEventEmitter.emit('subject.added', {});
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
              placeholder='Class Name'
              onChangeText={(e) => setName(e)}
              value={name} />

            {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
               
                <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 20}}>
                Save
                </Button>
              )}
            
            </Card.Content>
        </Card>


      </SafeAreaView>
    )
}

export default Createeditsubject;
