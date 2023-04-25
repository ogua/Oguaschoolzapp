import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput, Dialog, Portal, Provider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import MultiSelect from 'react-native-multiple-select';
import { cos } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LocaleConfig, Calendar } from "react-native-calendars";


function Incomeexpensecat() {

    const token = useSelector(selecttoken);
    const [title, settitle] = useState("");
    const [trandate, settrandate] = useState("");
    const [note, setnote] = useState("");
    const [ref, setref] = useState("");
    const [percentage, setpercentage] = useState("0");
    const [file, setFile] = useState(null);
    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);
    

    const [opentrantype, setOpentrantype] = useState(false);
    const [trantype, settrantype] = useState("");
    const [trantypeitems, settrantypeItems] = useState([
      { label: 'Income', value: 'Income'},
      { label: 'Expense', value: 'Expense'}
    ]);


    const [opentrmethod, setOpentrmethod] = useState(false);
    const [trmethod, settrmethod] = useState("");
    const [trmethoditems, settrmethodItems] = useState([
      { label: 'Bank Transfer', value: 'Bank Transfer'},
      { label: 'Cash', value: 'Cash'},
      { label: 'MOMO', value: 'MOMO'}
    ]);

    const [openacctitle, setOpenacctitle] = useState(false);
    const [acctitle, setacctitle] = useState("");
    const [acctitleitems, setacctitleItems] = useState([]);


    const [opencategory, setOpencategory] = useState(false);
    const [category, setcategory] = useState("");
    const [categoryitems, setcategoryItems] = useState([]);


    
    const [openvendor, setOpenvendor] = useState(false);
    const [vendor, setvendor] = useState("");
    const [vendoritems, setvendorItems] = useState([]);


    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const [link, setlink] = useState("");
    const router = useRouter();
    const {id,type} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      //loaddata();

      if(id == undefined){
        isCreatedorEdit('New Category');
       // setlink(schoolzapi+'/income-expense');
      }else{
        
        if(type == 'Expense'){
            setlink(schoolzapi+'/expense/show/'+id);
        }else{
            setlink(schoolzapi+'/income/show/'+id);
        }

        loadedit();
        
        isCreatedorEdit('Edit Category');
      }

    },[]);


    const loadedit = () => {
      setLoading(true);
      
      axios.get(type == 'Expense' ? schoolzapi+'/expense/show/'+id : schoolzapi+'/income/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

          //console.log(link);
          
          settrantype(type);
          settitle(results.data.data.title);
          setpercentage(results.data.data.percentage);

          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }


    const createdata = () => {

        if(trantype == ""){
          alert('Transaction Type cant be empty');
          return;
        }

        if(title == ""){
          alert('Title cant be empty');
          return;
        }

        setIssubmitting(true);

        const data = {
            trantype,
            title,
            percentage
        }

        axios.post(schoolzapi+'/add-income-expense-cat',
        data,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {

            setIssubmitting(false);

            if( response.data.error !== undefined){
                alert(response.data.error);
            }else{
                ToastAndroid.show('info saved successfully!', ToastAndroid.SHORT);
                DeviceEventEmitter.emit('subject.added', {});
                router.back();
            }
           
            
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log("error",error);
          });
    }

    const updatedata = () => {

        if(trantype == ""){
            alert('Transaction Type cant be empty');
            return;
          }
  
          if(title == ""){
            alert('Title cant be empty');
            return;
          }

          setIssubmitting(true);
  
          const data = {
              trantype,
              title,
              percentage
          }
    
      axios.patch(schoolzapi+'/edit-income-expense-cat/'+id,
      data,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setIssubmitting(false);

          if( response.data.error !== undefined){
            alert(response.data.error);
          }else{
              ToastAndroid.show('info saved successfully!', ToastAndroid.SHORT);
              DeviceEventEmitter.emit('subject.added', {});
              router.back();
          }
          
        })
        .catch(function (error) {
          setIssubmitting(false);
          console.log(error.response);
        });
  }



    return (
      <Provider>
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: creatoredit,
                presentation: 'formSheet',
                headerLeft: () => (
                  <>
                    <TouchableOpacity onPress={() => router.back()} style={{marginHorizontal: 10}}>
                      <Ionicons name="close-circle" size={30} />
                    </TouchableOpacity>
                  </>
                )
            }}

        />
        {/* <StatusBar hidden={true} /> */}
        <KeyboardAwareScrollView>
        <ScrollView style={{marginBottom: 30}}
        >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>

        <Text style={{fontSize: 15, fontWeight: 500}}>Category Type</Text>
               <DropDownPicker
                    open={opentrantype}
                    value={trantype}
                    items={trantypeitems}
                    setOpen={setOpentrantype}
                    setValue={settrantype}
                    setItems={settrantypeItems}
                   // onChangeValue={loadincome}
                    placeholder={""}
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

     <Text style={{fontSize: 15, fontWeight: 500}}>Title</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={title}
        onChangeText={(e) => settitle(e)}
        />

  {trantype == 'Expense' && (
    <>
    <Text style={{fontSize: 15, fontWeight: 500}}>Percentage</Text>
        <TextInput
        style={styles.Forminputhelp}
        keyboardType="numeric"
        mode="outlined"
        value={percentage}
        onChangeText={(e) => setpercentage(e)}
      />
    </>
  )}



        {issubmitting ? <ActivityIndicator style={{marginTop: 30}} size="large" color="#1782b6" /> : (
          <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 30}}>
            Save
          </Button>
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

export default Incomeexpensecat;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});