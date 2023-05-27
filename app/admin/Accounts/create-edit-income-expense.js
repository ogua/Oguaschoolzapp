import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
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
import { showMessage } from "react-native-flash-message";



function Createeditincomeexpense() {

    const token = useSelector(selecttoken);
    const [title, settitle] = useState("");
    const [trandate, settrandate] = useState("");
    const [note, setnote] = useState("");
    const [ref, setref] = useState("");
    const [amount, setamount] = useState("");
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
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      loaddata();

      if(id == undefined){
        isCreatedorEdit('New Income Expense');
        setlink(schoolzapi+'/income-expense');
      }else{
        loadedit();
        setlink(schoolzapi+'/income-expense/'+id);
        isCreatedorEdit('Edit Income Expense');
      }

    },[]);

    const checkPermissions = async () => {
      try {
        const result = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
  
        if (!result) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title:
                'You need to give storage permission to download and save the file',
              message: 'App needs access to your camera',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
            return true;
          } else {
            Alert.alert('Error', "Camera permission denied");
            console.log('Camera permission denied');
            return false;
          }
        } else {
          return true;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    };
  
  
    async function selectFile() {
      try {
        const result = await checkPermissions();
  
        if (result) {
          const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: false,
          });
  
          if (result.type === 'success') {
            // Printing the log realted to the file
            console.log('res : ' + JSON.stringify(result));
            // Setting the state to show single file attributes
            setFile(result);
          }
        }
      } catch (err) {
        setFile(null);
        console.warn(err);
        return false;
      }
    }

    function getaccount() {

        return axios.get(schoolzapi+'/chart-of-accounts',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }


     function getvendors() {

        return axios.get(schoolzapi+'/vendors',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }

    const loaddata = () => {
        setLoading(true);
        
        Promise.all([getaccount(), getvendors()])
        .then(function (results) {

            const acc = results[0];
            const ven = results[1];
  
            loadacctitlte(acc.data.data);
            loadvendor(ven.data.data);
            
        }).catch(function(error){
            setLoading(false);
            console.log(error);
        });
    }


   const loadacctitlte = (data) => {
            
    const mddatas = data;
    
    let mdata = [];

     mddatas.map(item =>  mdata.push({ label: item?.title, value: item?.id}))
    
     setacctitleItems(mdata);

     //setLoading(false);

   }


   const loadvendor = (data) => {
            
    const mddatas = data;
    
    let mdata = [];

     mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
    
     setvendorItems(mdata);

     setLoading(false);

   }


   const loadcategory = (data) => {
            
    const mddatas = data;
    
    let mdata = [];

     mddatas.map(item =>  mdata.push({ label: item?.title, value: item?.id}))
    
     setcategoryItems(mdata);

     setLoading(false);

   }


    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/income-expense/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

          //console.log(results.data.data);
          
          settrantype(results.data.data.in_ex_type);
          settitle(results.data.data.title);
          settrandate(results.data.data.trdate);
          settrmethod(results.data.data.paymethod);
          setacctitle(parseInt(results.data.data.acctitle_id));
          setamount(results.data.data.amount);
          setnote(results.data.data.note);
          setcategory(parseInt(results.data.data.category_id));
          setvendor(parseInt(results.data.data.vendor_id));
          setref(results.data.data.in_ex_ref);

          let expentype = results.data.data.in_ex_type;

          if(expentype == "Income"){

            loadincometypes();

          }else{

            loadexpensetypes();
          }


         // setLoading(false);
          
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

        if(trandate == ""){
          alert('Transaction Date cant be empty');
          return;
        }

        if(settrmethod == ""){
          alert('Pay Method cant be empty');
          return;
        }

        if(amount == ""){
          alert('Amount cant be empty');
          return;
        }

        if(category == ""){
          alert('Category cant be empty');
          return;
        }

        if(vendor == ""){
          alert('Vendor cant be empty');
          return;
        }

        if(ref == ""){
          alert('Reference cant be empty');
          return;
        }
  
      setIssubmitting(true);

      const data = new FormData();

      if(file != null){

        data.append('doc', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType
        });

      }
//1598
      data.append('trantype',trantype);
      data.append('title',title);
      data.append('trandate',trandate);
      data.append('paymethod',settrmethod);
      data.append('acctitle',acctitle);
      data.append('amount',amount);
      data.append('note',note);
      data.append('category',category);
      data.append('vendor',vendor);
      data.append('ref',ref);

        axios.post(link,
        data,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {

            setIssubmitting(false);

            if( response.data.error !== undefined){
                alert(response.data.error);
            }else{
              
              showMessage({
                message: 'Info recorded Successfully!',
                type: "success",
                position: 'bottom',
              });
            
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

      if(trandate == ""){
        alert('Account Title cant be empty');
        return;
      }

      if(trantype == ""){
        alert('Account Type cant be empty');
        return;
      }


      setIssubmitting(true);

      const formdata = {
       trandate,
       trantype,
       vendor,
       title,
       note,
       ref,
       acctitle,
       amount,
       address,
       phone

      }
    
      axios.post(schoolzapi+'/bank-transactions/'+id,
      formdata,
      {
          headers: {Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
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

  const refresh = () => {
    loaddata();

    if(id !== undefined){
      loadedit();
    }
    
  }


  const loadincome = () => {

    if(trantype == "Income"){
        loadincometypes();
    }else{
        loadexpensetypes();
    }

  }

  function loadincometypes(){

    setLoading(true);

    axios.get(schoolzapi+'/income',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {

            loadcategory(response.data.data);
          
        })
        .catch(function (error) {
            setLoading(false);
          console.log(error.response);
        });

   }


   function loadexpensetypes(){

    setLoading(true);

    axios.get(schoolzapi+'/expense',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {

            loadcategory(response.data.data);
          
        })
        .catch(function (error) {
            setLoading(false);
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
                // headerRight: () => (
                //     <>
                //       <TouchableOpacity onPress={refresh}>
                //         <Ionicons name="refresh" size={30} />
                //       </TouchableOpacity>
                //     </>
                //   )
            }}

        />
        <KeyboardAwareScrollView>
        <ScrollView style={{marginBottom: 30}}
        >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>

        <Text style={{fontSize: 15, fontWeight: 500}}>Transaction Type</Text>
               <DropDownPicker
                    open={opentrantype}
                    value={trantype}
                    items={trantypeitems}
                    setOpen={setOpentrantype}
                    setValue={settrantype}
                    setItems={settrantypeItems}
                    onChangeValue={loadincome}
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



        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 15, fontWeight: 500}}>Transaction Date </Text>
          <Button icon="calendar-range" onPress={() => setShowdialog(true)}> select Date</Button>
      </View>
      <Portal>
    <Dialog visible={showdialog} onDismiss={hideDialog}>
        <Dialog.Content>
            <Calendar
                visible={true}
                onDayPress={(day) => {
                setSelecteddate(day.dateString);
                settrandate(day.dateString);
                setShowdialog(false);
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
        style={styles.Forminputhelp}
        mode="outlined"
        value={trandate}
        onChangeText={(e) => settrandate(e)}
        />


          <Text style={{fontSize: 15, fontWeight: 500}}>Pay Method</Text>
              <DropDownPicker
                    open={opentrmethod}
                    value={trmethod}
                    items={trmethoditems}
                    setOpen={setOpentrmethod}
                    setValue={settrmethod}
                    setItems={settrmethodItems}
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
                        marginBottom: 20
                    }}
                    />


                <Text style={{fontSize: 15, fontWeight: 500}}>Account Title</Text>
                   <DropDownPicker
                    open={openacctitle}
                    value={acctitle}
                    items={acctitleitems}
                    setOpen={setOpenacctitle}
                    setValue={setacctitle}
                    setItems={setacctitleItems}
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
                        marginBottom: 20
                    }}
                    />



<Text style={{fontSize: 15, fontWeight: 500}}>Amount</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={amount}
        onChangeText={(e) => setamount(e)}
/>


<Text style={{fontSize: 15, fontWeight: 500}}>Note</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={note}
        multiline={true}
        numberOfLines={4}
        onChangeText={(e) => setnote(e)}
        />


<Text style={{fontSize: 15, fontWeight: 500}}>Category</Text>
              <DropDownPicker
                    open={opencategory}
                    value={category}
                    items={categoryitems}
                    setOpen={setOpencategory}
                    setValue={setcategory}
                    setItems={setcategoryItems}
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
                        marginBottom: 20
                    }}
                    />


            
            <Text style={{fontSize: 15, fontWeight: 500}}>Vendor</Text>
              <DropDownPicker
                    open={openvendor}
                    value={vendor}
                    items={vendoritems}
                    setOpen={setOpenvendor}
                    setValue={setvendor}
                    setItems={setvendorItems}
                    placeholder={"Choose vendor"}
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
                        marginBottom: 20
                    }}
                    />


       <Text style={{fontSize: 15, fontWeight: 500}}>Reference</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={ref}
        onChangeText={(e) => setref(e)}
        />     


    <Button icon="file" onPress={selectFile} uppercase={false} mode="outlined" style={{marginTop: 20}}>
       Add Attachment
    </Button>

        {issubmitting ? <ActivityIndicator style={{marginTop: 30}} size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={createdata} style={{marginTop: 30}}>
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

export default Createeditincomeexpense;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});