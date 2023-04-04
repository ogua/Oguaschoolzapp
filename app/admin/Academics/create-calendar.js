import axios from 'axios';
import { Redirect, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView,
   ScrollView,
   StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Button, Card, List, Modal, Portal, Switch, TextInput, Provider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { DatePickerInput, DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCallback } from 'react';
import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';
import { selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';

function Createcalendar() {

    const token = useSelector(selecttoken);
    const [academicterm, setTerm] = useState();
    const [termselected, setselectedTerm] = useState("");
    const [termid, setselectedTermid] = useState();
    const [creating, iscreatordeit] = useState(true);
    const [isloading, setLoading] = useState(false);
    const [title, setTitle] = useState();
    const [startdate, setstartdate] = useState();
    const [enddate, setenddate] = useState();
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const router = useRouter();

    const [visible, setVisible] = useState(false);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: '#fff', padding: 20};

    const showModal = () => setVisible(true);

    const onItemPress = (item) => {
      setselectedTerm(item.term);
      setselectedTermid(item.id);
      setVisible(false);
    };

    useEffect(()=> {

      setLoading(true);

      axios.get(schoolzapi+'/academicyear',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            setTerm(response.data.data);
            setLoading(false);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          
      });

    },[]);


    const createdata = () => {

        setLoading(true);

        if (termselected.length == 0 ) {

          Alert.alert('Alert!', 'Term cant be empty.', [
              {text: 'Okay'}
          ]);

          setLoading(false);

          return;
       }

       if (startdate.length == 0 ) {

        Alert.alert('Alert!', 'Start Date cant be empty.', [
            {text: 'Okay'}
        ]);

        setLoading(false);

        return;
     }


     if (enddate.length == 0 ) {

      Alert.alert('Alert!', 'End date cant be empty.', [
          {text: 'Okay'}
      ]);

      setLoading(false);

      return;
   }


      const formdata = {
            semester: termid,
            fromdate: startdate,
            todate: enddate,
            status: isSwitchOn ? 1 : 0
      }

     // console.log(formdata);
     // return;

        axios.post(schoolzapi+'/academicyear',
        formdata,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            setLoading(false);
            router.back();
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }


  const renderitem = (item) => (

    <TouchableOpacity style={{backgroundColor: '#fff'}} onPress={() => onItemPress(item)}>
        <List.Item
         title={item.term} />
    </TouchableOpacity>

  )

    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'New Calendar',
                presentation: 'formSheet'
            }}
        />

        <Card>
            <Card.Content>
            <Animatable.View
             animation="bounceIn"
            >
            
            
            <TextInput 
                placeholder='Enter Title'
                value={title}
                onChangeText={(e) => setTitle(e)}
                style={{marginBottom: 20}}
            />
            

            <DatePickerInput
                locale="en"
                label="From Date"
                value={startdate}
                onChange={(d) => setstartdate(d)}
                inputMode="end"
                style={{marginBottom: 20}}
            />

            <DatePickerInput
                locale="en"
                label="To Date"
                value={enddate}
                onChange={(d) => setenddate(d)}
                inputMode="start"
            /> 

            <View style={{flexDirection: 'row',justifyContent: 'flex-end', alignItems: 'center', marginTop: 10}}>
               <Text style={{marginRight: 10, fontWeight: 400}}>Holiday</Text>
               <Switch  value={isSwitchOn} onValueChange={onToggleSwitch} />

            </View>
              

        
            {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
                <Button mode="contained" onPress={createdata} style={{marginTop: 20}}>
                Save
                </Button>
              )} 
            </Animatable.View>
            </Card.Content>
        </Card>


      </SafeAreaView>
      </Provider>
    )
}

export default Createcalendar;

const styles = StyleSheet.create({

  separator: {
      height: 0.5,
      backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
