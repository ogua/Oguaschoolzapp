import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView,
   StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Button, Card, List, Modal, Portal, Switch, TextInput, Provider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { DatePickerInput, DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCallback } from 'react';
import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import { DeviceEventEmitter } from 'react-native';
import { ToastAndroid } from 'react-native';

function Createeditfee() {

    const token = useSelector(selecttoken);
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const [title, settitle] = useState("");
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [creatoredit, isCreatedorEdit] = useState();
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const router = useRouter();
    const {id} = useSearchParams();

    useEffect(()=> {

      if(id == undefined){
        isCreatedorEdit('New Fee');
      }else{
        loaddata();
        isCreatedorEdit('Edit Fee');
      }
    },[]);

    const loaddata = () => {
      
      setLoading(true);

      axios.get(schoolzapi+'/schoolfees/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          settitle(response.data.data.title);
          let status = response.data.data.status;
          setIsSwitchOn(status === `0` ? false : true);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }


    const createdata = () => {

      if(title == ""){
        alert('Title cant be empty');
        return;
      }

      setIssubmitting(true);

      const formdata = {
          title: title,
          status: isSwitchOn ? 1 : 0
      }

      axios.post(schoolzapi+'/schoolfees',
      formdata,
      {
          headers: {Accept: 'application/json',
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
          console.log("error",error.response);
        });
  }

  const updatedata = () => {

    if(title == ""){
      alert('Fullname cant be empty');
      return;
    }

    setIssubmitting(true);

    const formdata = {
        title: title,
        status: isSwitchOn ? 1 : 0
    }

    axios.patch(schoolzapi+'/schoolfees/'+id,
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
          console.log("error",error);
      });
}

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: creatoredit,
                presentation: 'formSheet'
            }}
        />
      {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
            <Card.Content>
            <Animatable.View
             animation="bounceIn"
            >

            <Text>Title</Text>
            <TextInput
            value={title}
            mode="outlined"
            onChangeText={(e) => settitle(e)}
            />

            <View style={{flexDirection: 'row',justifyContent: 'flex-end', alignItems: 'center', marginTop: 10}}>
               <Text style={{marginRight: 10, fontWeight: 400}}>Status</Text>
               <Switch  value={isSwitchOn} onValueChange={onToggleSwitch} />

            </View>
              

        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" /> : (
          <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 20}}>
               Save
          </Button>
        )}
            </Animatable.View>
            </Card.Content>
        </Card>

      )}


      </SafeAreaView>
      </Provider>
    )
}

export default Createeditfee;

const styles = StyleSheet.create({

  separator: {
      height: 0.5,
      backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
