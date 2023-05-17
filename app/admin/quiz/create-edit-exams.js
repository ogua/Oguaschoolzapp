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



function Createeditexams() {

    const token = useSelector(selecttoken);
    const [title, settitle] = useState("");
    const [trandate, settrandate] = useState("");
    const [note, setnote] = useState("");
    const [totalquestion, settotalquestion] = useState("");
    const [markright, setmarkright] = useState("");
    const [markswrong, setmarkswrong] = useState("");
    const [file, setFile] = useState(null);
    const [showdialog, setShowdialog] = useState(false);
    const hideDialog = () => setShowdialog(false);
    const [selecteddate, setSelecteddate] = useState(false);
    

    const [openbank, setOpenbank] = useState(false);
    const [bank, setbank] = useState("");
    const [bankitems, setbankItems] = useState([]);
    
    const [openstclass, setOpenstclass] = useState(false);
    const [stclass, setstclass] = useState(0);
    const [stclassitems, setstclassItems] = useState([]);

    const [opentryable, setOpentryable] = useState(false);
    const [tryable, settryable] = useState("");
    const [tryableitems, settryableItems] = useState([
        { label: 'Yes', value: 'Yes'},
        { label: 'No', value: 'No'},
    ]);

    const [showduration, setShowduration] = useState(false);
    const onDismissduration = useCallback(() => {
        setShowduration(false)
    }, [setShowduration]);

    const onConfirmduration = useCallback(
        ({ hours, minutes }) => {
         setShowduration(false);
         setduration(hours+':'+minutes);
        },
        [setShowduration]
    );

    const [duration, setduration] = useState("");

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const [link, setlink] = useState("");
    const router = useRouter();
    const {id} = useSearchParams();
  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Examination');
        setlink(schoolzapi+'/online-quiz');
      }else{
        loadedit();
        setlink(schoolzapi+'/online-quiz/'+id);
        isCreatedorEdit('Edit Examination');
      }

      loaddata();

    },[]);

    function getstudentclass() {

        return axios.get(schoolzapi+'/student-classes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }

      function getquestionbank() {

        return axios.get(schoolzapi+'/questions-bank',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }


     const loaddata = () => {
        setLoading(true);
        
        Promise.all([getstudentclass(), getquestionbank()])
        .then(function (results) {
            ///setLoading(false);
            const stclass = results[0];
            const bank = results[1];

            loadstclass(stclass.data.data);
            loadbank(bank.data.data);


        }).catch(function(error){
            setLoading(false);
            const acct = error[0];
            const studeclass = error[1];
            
        });
    }

    const loadstclass = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setstclassItems(mdata);
    }

    const loadbank = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.title, value: item?.id}))
        
         setbankItems(mdata);

         setLoading(false);
    }

    


    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/online-quiz/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {

        // console.log(results.data.data.stclass);
          settitle(results.data.data.title);
          setbank(parseInt(results.data.data.examid));
          setstclass(parseInt(results.data.data.stclassid));
          settryable(results.data.data.retry);
          setnote(results.data.data.description);
          settotalquestion(results.data.data.quesoshow);
          setmarkright(results.data.data.mfr);
          setmarkswrong(results.data.data.mfw);
          setduration(results.data.data.minutes);
          setLoading(false);
          
      }).catch(function(error){
          setLoading(false);
          console.log(error);
      });
  }


    const createdata = () => {

        if(title == ""){
          alert('Title Date cant be empty');
          return;
        }

        if(bank == ""){
          alert('Bank Type cant be empty');
          return;
        }

        if(stclass == ""){
          alert('Student Class cant be empty');
          return;
        }

        if(tryable == ""){
          alert('Tryable cant be empty');
          return;
        }

        if(note == ""){
          alert('Note cant be empty');
          return;
        }

        if(totalquestion == ""){
          alert('Total Questions cant be empty');
          return;
        }

        if(markright == ""){
            alert('Marks For Right cant be empty');
            return;
        }

        if(duration == ""){
            alert('Duration cant be empty');
            return;
          }
  
      setIssubmitting(true);

      const data = {
        title,
        bank,
        stclass,
        tryable,
        note,
        totalquestion,
        markright,
        markswrong,
        duration
      }

        axios.post(link,
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

                showMessage({
                    message: 'Info saved Successfully!',
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

      if(bank == ""){
        alert('Account Type cant be empty');
        return;
      }


      setIssubmitting(true);

      const formdata = {
       trandate,
       bank,
       stclass,
       title,
       note,
       totalquestion,
       markright,
       markswrong,
       address,
       phone

      }
    
      axios.post(schoolzapi+'/online-quiz/'+id,
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

        <Text style={{fontSize: 15, fontWeight: 500}}>Title</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={title}
        onChangeText={(e) => settitle(e)}
        />

         <Text style={{fontSize: 15, fontWeight: 500}}>Choose Bank </Text>
               <DropDownPicker
                    searchable
                    open={openbank}
                    value={bank}
                    items={bankitems}
                    setOpen={setOpenbank}
                    setValue={setbank}
                    setItems={setbankItems}
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


             <Text style={{fontSize: 15, fontWeight: 500}}>Student Class </Text>
                 <DropDownPicker
                    open={openstclass}
                    value={stclass}
                    items={stclassitems}
                    setOpen={setOpenstclass}
                    setValue={setstclass}
                    setItems={setstclassItems}
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


<Text style={{fontSize: 15, fontWeight: 500}}>Tryable </Text>
                 <DropDownPicker
                    open={opentryable}
                    value={tryable}
                    items={tryableitems}
                    setOpen={setOpentryable}
                    setValue={settryable}
                    setItems={settryableItems}
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

<Text style={{fontSize: 15, fontWeight: 500}}>Note</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        multiline
        numberOfLines={5}
        value={note}
        onChangeText={(e) => setnote(e)}
        /> 




<Text style={{fontSize: 15, fontWeight: 500}}>Total question</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        keyboardType="numeric"
        value={totalquestion}
        onChangeText={(e) => settotalquestion(e)}
        />


     <Text style={{fontSize: 15, fontWeight: 500}}>Marks For Right Answer</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        keyboardType="numeric"
        value={markright}
        onChangeText={(e) => setmarkright(e)}
        />  



        
<Text style={{fontSize: 15, fontWeight: 500}}>Marks For Wrong Answer</Text>
        <TextInput
        style={styles.Forminputhelp}
        mode="outlined"
        value={markswrong}
        keyboardType="numeric"
        onChangeText={(e) => setmarkswrong(e)}
    />  


<TimePickerModal
          visible={showduration}
          onDismiss={onDismissduration}
          onConfirm={onConfirmduration}
          hours={12}
          minutes={14}
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={{fontSize: 15, fontWeight: 500}}>Duration eg.00:02:00</Text>
            <Button onPress={()=> setShowduration(true)}>Choose Duration</Button>
        </View>
         <TextInput
            style={styles.Forminput}
            mode="outlined"
            keyboardType="default"
            onChangeText={(e) => setduration(e)}
            value={duration} />





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

export default Createeditexams;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});