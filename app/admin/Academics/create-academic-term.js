import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, FlatList, SafeAreaView,
   StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Button, Card, List, Modal, Portal, Switch, TextInput, Provider, Dialog } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { DatePickerInput, DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCallback } from 'react';
import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import { LocaleConfig, Calendar } from "react-native-calendars";
import { showMessage } from "react-native-flash-message";


function Createacademicterm() {

    const token = useSelector(selecttoken);
    const [termselected, setselectedTerm] = useState("");
    const [termid, setselectedTermid] = useState();
    const [submitting, setsubmitting] = useState(false);
    const [isloading, setLoading] = useState(false);
    const [startdate, setstartdate] = useState();
    const [enddate, setenddate] = useState();
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const router = useRouter();
    const [showdialogstart, setShowdialogstart] = useState(false);
    const [showdialogend, setShowdialogend] = useState(false);
    const [selecteddate, setSelecteddate] = useState(false);
    const [selecteddatend, setSelecteddatend] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const hideDialogend = () => setSelecteddatend(false);




    const [visible, setVisible] = useState(false);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: '#fff', padding: 20};

    const showModal = () => setVisible(true);

    const onItemPress = (item) => {
      setselectedTerm(item.term);
      setselectedTermid(item.id);
      setVisible(false);
    };

    const [openterm, setOpenterm] = useState(false);
    const [term, setterm] = useState(0);
    const [termitem, settermitems] = useState([]);
    const [creatoredit, isCreatedorEdit] = useState();
    const {id} = useSearchParams();


    useEffect(()=> {

      loaddata();
      
      if(id == undefined){
        isCreatedorEdit('New Academic Term');
      }else{
        loadedit();
        isCreatedorEdit('Edit Academic Term');
      }

    },[]);

    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/academicyear/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {
        //console.log(results.data.data.termid);

         // setterm(results.data.data.termid);
          setterm(parseInt(results.data.data.termid));
          setstartdate(results.data.data.fromdate);
          setenddate(results.data.data.todate);

          if(results.data.data.status === "1"){
            setIsSwitchOn(true);
          }else{
            setIsSwitchOn(false);
          }


          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }



    function loaddata(){

      setLoading(true);

      axios.get(schoolzapi+'/academicterms',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {            
            loadsterm(response.data.data);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          
      });

    }


    const loadsterm = (data) => {
            
      const mddatas = data;
      
      let mdata = [];

       mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
      
       settermitems(mdata);

       setLoading(false);
  }


    const createdata = () => {


        if (term.length == 0 ) {

          Alert.alert('Alert!', 'Term cant be empty.', [
              {text: 'Okay'}
          ]);

          return;
       }

       if (startdate.length == 0 ) {

        Alert.alert('Alert!', 'Start Date cant be empty.', [
            {text: 'Okay'}
        ]);

        return;
     }


     if (enddate.length == 0 ) {

      Alert.alert('Alert!', 'End date cant be empty.', [
          {text: 'Okay'}
      ]);

      return;
   }

   setsubmitting(true);


      const formdata = {
            semester: term,
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
            setsubmitting(false);
            showMessage({
              message: 'Info recorded Successfully!',
              type: "success",
              position: 'bottom',
            });
          
         // DeviceEventEmitter.emit('subject.added', {});
          router.back();
          })
          .catch(function (error) {
            setsubmitting(false);
            console.log(error);
          });
    }


    const updatedata = () => {


      if (term.length == 0 ) {

        Alert.alert('Alert!', 'Term cant be empty.', [
            {text: 'Okay'}
        ]);

        return;
     }

     if (startdate.length == 0 ) {

      Alert.alert('Alert!', 'Start Date cant be empty.', [
          {text: 'Okay'}
      ]);

      return;
   }


   if (enddate.length == 0 ) {

    Alert.alert('Alert!', 'End date cant be empty.', [
        {text: 'Okay'}
    ]);

    return;
 }

 setsubmitting(true);


    const formdata = {
          semester: term,
          fromdate: startdate,
          todate: enddate,
          status: isSwitchOn ? 1 : 0
    }


      axios.patch(schoolzapi+'/academicyear/'+id,
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {

          setsubmitting(false);

          showMessage({
            message: 'Info updated Successfully!',
            type: "success",
            position: 'bottom',
          });
        
      //  DeviceEventEmitter.emit('subject.added', {});
        router.back();

        })
        .catch(function (error) {
          setsubmitting(false);
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
                headerTitle: creatoredit,
                presentation: 'formSheet'
            }}
        />

        <Card>
            <Card.Content>
            {isloading ? <ActivityIndicator size="large" /> : (
              <>
              
            <Animatable.View
             animation="bounceIn"
            >
                    <DropDownPicker
                        open={openterm}
                        value={term}
                        items={termitem}
                        setOpen={setOpenterm}
                        setValue={setterm}
                        setItems={settermitems}
                       // placeholder={"Disability"}
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
                            marginTop: 10,
                            marginBottom: 20,
                            minHeight: 40,
                        }}
                  />
          

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Start Date </Text>
              <Button icon="calendar-range" onPress={() => setShowdialogstart(true)}> select Date</Button>
          </View>

          <Portal>
                <Dialog visible={showdialogstart} onDismiss={hideDialog}>
                    <Dialog.Content>

                    <Calendar
                       visible={true}
                        onDayPress={(day) => {
                            setSelecteddate(day.dateString);
                            setstartdate(day.dateString);
                            setShowdialogstart(false);
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
                value={startdate}
                onChange={(d) => setstartdate(d)}
                mode="outlined"
                style={{marginBottom: 20}}
            />


           <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>End Date </Text>
              <Button icon="calendar-range" onPress={() => setShowdialogend(true)}> select Date</Button>
          </View>

          <Portal>
                <Dialog visible={showdialogend} onDismiss={hideDialogend}>
                    <Dialog.Content>

                    <Calendar
                       visible={true}
                        onDayPress={(day) => {
                            setSelecteddatend(day.dateString);
                            setenddate(day.dateString);
                            setShowdialogend(false);
                        }}
                        markedDates={{
                            [selecteddatend]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                        }}
                        enableSwipeMonths={true}
                    />

                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialogend}>Cancel</Button>
                    </Dialog.Actions>
                </Dialog>
             </Portal>
            <TextInput
                mode="outlined"
                value={enddate}
                onChange={(d) => setenddate(d)}
            /> 

            <View style={{flexDirection: 'row',justifyContent: 'flex-end', alignItems: 'center', marginTop: 10}}>
               <Text style={{marginRight: 10, fontWeight: 400}}>Status</Text>
               <Switch  value={isSwitchOn} onValueChange={onToggleSwitch} />

            </View>
              

        
            {submitting ? <ActivityIndicator size="large" color="#1782b6" /> : (
                <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 20}}>
                Save
                </Button>
              )}

          
            </Animatable.View>

            </>
            )}
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
