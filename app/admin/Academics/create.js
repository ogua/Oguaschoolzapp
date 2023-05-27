import axios from 'axios';
import { Redirect, Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native'
import { Button, Card, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { showMessage } from "react-native-flash-message";

function Editaddcalendar() {
    const token = useSelector(selecttoken);
    const [name, setName] = useState();
    const [creating, iscreatordeit] = useState(true);
    const [isloading, setLoading] = useState(false);
    const router = useRouter();

    const createdata = () => {

        setLoading(true);

        const formdata = {
            name: name
        }

        axios.post(schoolzapi+'/academicterms',
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
                headerTitle: 'New',
                presentation: 'formSheet'
            }}
        />

        <Card>
            <Card.Content>
            <TextInput 
              label='Academic Term'
              onChangeText={(e) => setName(e)}
              mode="outlined"
              value={name} />

            {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
                <Button mode="contained" onPress={createdata} style={{marginTop: 20}}>
                Save
                </Button>
              )}
            
            </Card.Content>
        </Card>


      </SafeAreaView>
    )
}

export default Editaddcalendar;
