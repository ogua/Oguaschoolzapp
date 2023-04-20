import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput } from 'react-native-paper';
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

function Fetchtermlyfee() {

    const token = useSelector(selecttoken);
    const [amount, setamount] = useState("");
    const [year, setYear] = useState("");
    const [ofee, setofee] = useState("");

    const [openstudentclass, setOpenstudentclass] = useState(false);
    const [studentclass, setstudentclass] = useState("");
    const [studentclassitems, setstudentclassItems] = useState([]);
    
    const [openacdemicterm, setOpenacdemicterm] = useState(false);
    const [acdemicterm, setacdemicterm] = useState("");
    const [acdemictermitems, setacdemictermItems] = useState([]);


    const [openfee, setOpenfee] = useState(false);
    const [fee, setfee] = useState("");
    const [feeitems, setfeeItems] = useState([]);

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id,studentname} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      loaddata();

      if(id == undefined){
        isCreatedorEdit('New Fee master');
      }else{
        isCreatedorEdit('Edit Fee master');
      }

    },[]);

    


     const loaddata = () => {
        setLoading(true);
        
        axios.get(schoolzapi+'/academicterms',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (results) {
            ///setLoading(false);

            loadacademicterm(results.data.data);

        }).catch(function(error){
            setLoading(false);
            
        });
    }


    const loadacademicterm = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setacdemictermItems(mdata);

         setLoading(false);
    }



    const createdata = () => {

        if(acdemicterm == ""){
            alert('Acdemic term cant be empty');
            return;
        }


        setIssubmitting(true);

        const formdata = {
         studntid: id,
         term: acdemicterm,
        }

        axios.post(schoolzapi+'/fetch-termly-fee',
        formdata,
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
                ToastAndroid.show(response.data.data, ToastAndroid.SHORT);
                DeviceEventEmitter.emit('subject.added', {});
                router.back();
            }
            
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log("error",error);
          });
    }


    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Fetch Fee',
                presentation: 'formSheet',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                          <Ionicons name="close-circle" size={30} style={{marginRight: 10}} />
                    </TouchableOpacity>
                ),
                // headerRight: () => (
                //     <>
                //       <TouchableOpacity onPress={refresh}>
                //         <Ionicons name="refresh" size={30} />
                //       </TouchableOpacity>
                //     </>
                //   )
            }}

        />
        <ScrollView style={{marginBottom: 30}}
        >
        <KeyboardAvoidingView
            behavior="height"
            >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>

            <Text style={{marginVertical: 15, fontSize: 15, fontWeight: 500}}>Fetch Fee For {studentname}</Text>
            
            <Text style={{fontSize: 15, fontWeight: 500}}>Academic Term</Text>
              <DropDownPicker
                    open={openacdemicterm}
                    value={acdemicterm}
                    items={acdemictermitems}
                    setOpen={setOpenacdemicterm}
                    setValue={setacdemicterm}
                    setItems={setacdemictermItems}
                    placeholder={"Choose Academic Term"}
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

        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Button mode="contained" onPress={createdata} style={{marginTop: 30}}>
           Request
        </Button>
        )}

</Card.Content>
        </Card>
        )}
        </KeyboardAvoidingView>
        </ScrollView>


      </SafeAreaView>
    )
}

export default Fetchtermlyfee;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});