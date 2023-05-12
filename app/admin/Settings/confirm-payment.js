import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, Linking, PermissionsAndroid, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput, Dialog, Portal, Provider } from 'react-native-paper';
import { useEffect } from 'react';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showMessage } from "react-native-flash-message";
import { images, schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { useSelector } from 'react-redux';


function Confirmpayment() {

  const router = useRouter();
  const token = useSelector(selecttoken);
  const {current,expiry,month,now,paying,splan,monthly} = useSearchParams();
  const [paystack,setpaystack] = useState("");
  const [issubmitting, setIssubmitting] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [urlinfo, seturlinfo] = useState(false);

  useEffect(()=>{
    loaddata();

  },[]);

  const loaddata = () => {
    setLoading(true);
   // seturlinfo(false);
    
    axios.get(schoolzapi+'/other-details',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
    })
    .then(function (results) {
        
      setpaystack(results.data.paytstack);
      setLoading(false);

    }).catch(function(error){
        setLoading(false);
        console.log(error);
    });
}


const generatelink = () => {
    setIssubmitting(true);
    
    axios.get(schoolzapi+`/generate-link/${splan}/${month}/${now}`,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
    })
    .then(function (results) {
        
        setIssubmitting(false);

        if(results.data.paylink == ""){

            showMessage({
                message: 'Something Went Wrong, Try Again!',
                type: "danger",
                position: 'bottom',
              });

              return;
        }
        seturlinfo(true);
        Linking.openURL(results.data.paylink);
        //console.log(results.data.paylink);

    }).catch(function(error){
        setIssubmitting(false);
        console.log(error);
    });
}

    return (
      <Provider>
        <StatusBar hidden={true} />
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Confirm Payment',
                presentation: 'formSheet',
                headerLeft: () => (
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.back()}>
                        <Ionicons name="close-circle" size={30} />
                    </TouchableOpacity>
            )
            }}

        />
        <KeyboardAwareScrollView>
        <ScrollView style={{marginBottom: 30}}
        >
        {isloading ? <ActivityIndicator size="large" /> : (

        <Card>
        <Card.Content>

        {paystack && (

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Avatar.Image 
                source={{uri: paystack}}
                    size={200}
            />
            </View>

        )}

        <View style={{backgroundColor: '#fff', padding: 20}}> 
            <Text>Selected Plan: {splan} </Text>
            <Text>Monthly Cost: GH¢{monthly} / Month</Text>
            <Text>Number of months selected: {month}(s) </Text>
            <Text>Previous Expiry: {current} </Text>
            <Text>Current Expiry: {expiry} </Text>
            <Text>Paying Now: GH¢{paying} </Text>
        </View>
        
        {issubmitting ? <ActivityIndicator size="large"  style={{marginTop: 20}} /> : (
            <Button onPress={generatelink} mode="contained" style={{marginTop: 20}}>Pay GH¢{paying}</Button>
        )}

        {urlinfo && (
            <Text>Follow The Link To Make Payement</Text>
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

export default Confirmpayment;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});