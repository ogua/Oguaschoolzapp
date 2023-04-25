import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput, Provider, Dialog, Portal } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { LocaleConfig, Calendar } from "react-native-calendars";
import { selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';


function Createeditissuedbook() {

    const token = useSelector(selecttoken);
    const [Name, setName] = useState("");
    const [isbn, setisbn] = useState("");
    const [author, setauthor] = useState("");
    const [publisher, setpublisher] = useState("");
    const [file, setFile] = useState(null);
    const [img, setImg] = useState(null);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    const [openbook, setOpenbook] = useState(false);
    const [book, setbook] = useState(null);
    const [itemsbook, setItemsbook] = useState([]);

    const [openrole, setOpenrole] = useState(false);
    const [role, setrole] = useState(null);
    const [itemsrole, setItemsrole] = useState([
        { label: 'Student', value:'Student'},
        { label: 'Staff', value: 'Staff'}
    ]);

    const [returndate, setreturndate] = useState(null);


    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);

    const [quanity, setquanity] = useState("");
    const [price, setprice] = useState("");
    const [note, setnote] = useState("");
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();
  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      loaddata();

      if(id == undefined){
        isCreatedorEdit('Issued Books');
        
      }else{
        loaddataedit();
        isCreatedorEdit('Edit Issued Books');
      }

    },[]);


      const loaddataedit = () => {
        setLoading(true);
        
        axios.get(schoolzapi+'/issue-book/show/'+id,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (results) {
           
            setValue(parseInt(results.data.data.issuedtoid));
            setbook(parseInt(results.data.data.titleid));
            setreturndate(results.data.data.retundate);
            setrole(results.data.data.role);

            setLoading(false);

        }).catch(function(error){
            setLoading(false);
            console.log(error);
            
        });
    }

    function getusers() {

        return axios.get(schoolzapi+'/issued-users',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
    }

    function getbooks() {

        return axios.get(schoolzapi+'/books',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }



    const loaddata = () => {
      
      setLoading(true);

        Promise.all([getusers(), getbooks()])
        .then(function (response) {
            
          const users = response[0];
          const books = response[1];

          //console.log(users);
        
          loadusers(users.data.data);

          loadbooks(books.data.data);

          setLoading(false);
          
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }


    const loadusers = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
        setItems(mdata);
  
        //console.log(items);
    }

    const loadbooks = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.title, value: item?.id}))
        
         setItemsbook(mdata);
  
        //console.log(items);
    }

    const createdata = () => {

        if(value == ""){
          alert('Issued To cant be empty');
          return;
        }

        if(book == ""){
            alert('Book Issued cant be empty');
            return;
        }

        if(returndate == ""){
          alert('Returning Date cant be empty');
          return;
        }

        if(role == ""){
          alert('Role cant be empty');
          return;
        }

        setIssubmitting(true);

        const formdata = {
            issuedto: value,
            book,
            returndate,
            role
        }

        
        axios.post(schoolzapi+'/issue-book',
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
            console.log(error);
          });
    }

    const updatedata = () => {

        if(value == ""){
            alert('Issued To cant be empty');
            return;
          }
  
          if(book == ""){
              alert('Book Issued cant be empty');
              return;
          }
  
          if(returndate == ""){
            alert('Returning Date cant be empty');
            return;
          }
  
          if(role == ""){
            alert('Role cant be empty');
            return;
          }
  
          setIssubmitting(true);
  
          const formdata = {
              issuedto: value,
              book,
              returndate,
              role
          }
    
      axios.patch(schoolzapi+'/issue-book/'+id,
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
                //   <>
                //     {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : null}
                //   </>
                // )
            }}

        />
        <ScrollView style={{marginBottom: 30}}>
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>

        <Text style={{fontSize: 15, fontWeight: 500}}>Issued to</Text>
              <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
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
                        color: "#456A5A",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 40,
                        marginBottom: 20
                    }}
                    />

<Text style={{fontSize: 15, fontWeight: 500}}>Book Issued</Text>
              <DropDownPicker
                    open={openbook}
                    value={book}
                    items={itemsbook}
                    setOpen={setOpenbook}
                    setValue={setbook}
                    setItems={setItemsbook}
                    // multiple={true}
                    // mode="BADGE"
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
                        color: "#456A5A",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 40,
                        marginBottom: 20
                    }}
                    />


<View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Text>Returning Date </Text>
    <Button icon="calendar-range" onPress={() => setShowdialog(true)}> select Date</Button>
</View>
<Portal>
    <Dialog visible={showdialog} onDismiss={hideDialog}>
        <Dialog.Content>
            <Calendar
                visible={true}
                onDayPress={(day) => {
                setSelecteddate(day.dateString);
                setreturndate(day.dateString);
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
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setreturndate(e)}
        value={returndate} />


<Text style={{fontSize: 15, fontWeight: 500}}>Role</Text>
              <DropDownPicker
                    open={openrole}
                    value={role}
                    items={itemsrole}
                    setOpen={setOpenrole}
                    setValue={setrole}
                    setItems={setItemsrole}
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
                        color: "#456A5A",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 40,
                        marginBottom: 20
                    }}
                    />

        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 20}}>
        Save
        </Button>
        )}

</Card.Content>
        </Card>
        )}

        </ScrollView>


      </SafeAreaView>
      </Provider>
    )
}

export default Createeditissuedbook;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    }
});