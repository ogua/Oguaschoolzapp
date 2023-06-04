import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, SafeAreaView, Text, View } from 'react-native'
import { Button, Card, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { showMessage } from "react-native-flash-message";

function Editcalendar() {

    const token = useSelector(selecttoken);
    const [name, setName] = useState();
    const [creating, iscreatordeit] = useState(true);
    const [isloading, setLoading] = useState(false);
    const {id} = useSearchParams();
    const router = useRouter();

    
    useEffect(()=> {

      setLoading(true);

      axios.get(schoolzapi+'/academicterms/show/'+id,
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
        
    },[]);

    
    const updatedata = () => {

      setLoading(true);

      const formdata = {
          name: name
      }

      axios.patch(schoolzapi+'/academicterms/'+id,
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);

          showMessage({
            message: 'Info recorded Successfully!',
            type: "success",
            position: 'bottom',
          });
        
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
                headerTitle: 'Edit',
                presentation: 'formSheet'
            }}
        />

        <Card>
            <Card.Content>
            <TextInput 
              label='Academic Term'
              mode="outlined"
              onChangeText={(e) => setName(e)}
              value={name} />

              {isloading ? <ActivityIndicator size="large" color="#1782b6" style={{marginTop: 20}} /> : (
                <Button mode="contained" onPress={updatedata} style={{marginTop: 20}}>
                  Save
                </Button>
              )}
            
            </Card.Content>
        </Card>


      </SafeAreaView>
    )
}

export default Editcalendar;
