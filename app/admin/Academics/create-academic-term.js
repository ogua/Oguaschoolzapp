import axios from 'axios';
import { Redirect, Stack, useRouter } from 'expo-router';
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

function Createacademicterm() {

    const token = useSelector(selecttoken);
    const [academicterm, setTerm] = useState();
    const [termselected, setselectedTerm] = useState("");
    const [termid, setselectedTermid] = useState();
    const [creating, iscreatordeit] = useState(true);
    const [isloading, setLoading] = useState(false);
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

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "전체 공개", value: "전체 공개" },
    { label: "맞팔로우 공개", value: "맞팔로우 공개" },
    { label: "나만 보기", value: "나만 보기" },
  ]);

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

    const rendermodel = () => (
        <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <FlatList 
              data={academicterm}
              ItemSeparatorComponent={()=> <View style={styles.separator} />}
              renderItem={({item}) => renderitem(item)}
              keyExtractor={(item) => item.id}
            />
        </Modal>
        </Portal>
    );



    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'New',
                presentation: 'formSheet'
            }}
        />

        <Card>
            <Card.Content>
            <Animatable.View
             animation="bounceIn"
            >
            
            {rendermodel()}

            <TouchableOpacity onPress={showModal} style={{marginBottom:10, borderColor: '#ccc', padding: 10, backgroundColor: '#fff'}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>{termselected == "" ? `Select Academic Term` : termselected}</Text>
                  <Ionicons  name="arrow-down"  size={20}/>
              </View>
              
            </TouchableOpacity>

            <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder={"공개범위"}
      placeholderStyle={{
        color: "#456A5A",
      }}
      listMode="SCROLLVIEW"
      dropDownContainerStyle={{
        borderWidth: 0,
        borderRadius: 30,
        backgroundColor: "#F5F7F6",
      }}
      labelStyle={{
        color: "#456A5A",
      }}
      listItemLabelStyle={{
        color: "#456A5A",
      }}
      style={{
        borderWidth: 0,
        borderRadius: 30,
        backgroundColor: "#F5F7F6",
        minHeight: 30,
      }}
    />



            <DatePickerInput
                locale="en"
                label="Start Date"
                value={startdate}
                onChange={(d) => setstartdate(d)}
                inputMode="end"
                style={{marginBottom: 20}}
            />

            <DatePickerInput
                locale="en"
                label="Start Date"
                value={enddate}
                onChange={(d) => setenddate(d)}
                inputMode="start"
            /> 

            <View style={{flexDirection: 'row',justifyContent: 'flex-end', alignItems: 'center', marginTop: 10}}>
               <Text style={{marginRight: 10, fontWeight: 400}}>Status</Text>
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

export default Createacademicterm;

const styles = StyleSheet.create({

  separator: {
      height: 0.5,
      backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
