import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';

function Createeditelearning() {

    const token = useSelector(selecttoken);
    const [Name, setName] = useState("");
    const [link, setlink] = useState("");
    const [outcome, setoutcome] = useState("");
    const [documents, setdocuments] = useState("");
    const [file, setFile] = useState(null);
    const [img, setImg] = useState(null);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    const [intime, setIntime] = useState("");
    const [showintime, setShowintime] = useState(false);
    const onDismissintime = useCallback(() => {
        setShowintime(false)
    }, [setShowintime]);

    const onConfirmintime = useCallback(
        ({ hours, minutes }) => {
         setShowintime(false);
         setIntime(hours+':'+minutes);
        },
        [setShowintime]
    );

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      loadstudentclass();

      if(id == undefined){
        isCreatedorEdit('E-learning');
        
      }else{
        loaddataedit();
        isCreatedorEdit('Edit E-learning');
      }

    },[]);



      const loaddataedit = () => {
        setLoading(true);
        
        axios.get(schoolzapi+'/online-learning/show/'+id,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (results) {
            setLoading(false);

            //console.log(results);
            setValue(parseInt(results.data.data.stclassid));
            setImg(results.data.data.pic);
            setName(results.data.data.title);
            setlink(results.data.data.link);
            setdocuments(results.data.data.desc);
            setoutcome(results.data.data.outcome);
            setIntime(results.data.data.duration);

        }).catch(function(error){
            setLoading(false);
            console.log(error);
            
        });
    }



    const loadstudentclass = () => {
      
      setLoading(true);

      axios.get(schoolzapi+'/student-classes',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          console.log(response.data.data);
          loaddropdown(response.data.data);
          
        })
        .catch(function (error) {
          setLoading(false);
          console.log("error",error.response);
        });
    }


    const loaddropdown = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
        setItems(mdata);
  
        //console.log(items);
    }

    const createdata = () => {

        if(value == ""){
          alert('Student class cant be empty');
          return;
        }

        if(Name == ""){
            alert('Video Title cant be empty');
            return;
        }

        if(link == ""){
          alert('Sharable Link cant be empty');
          return;
        }

        if(outcome == ""){
            alert('Outcome cant be empty');
            return;
        }

        if(intime == ""){
          alert('Duration cant be empty');
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

        data.append('stclass',value);
        data.append('link',link);
        data.append('title',Name);
        data.append('outcome',outcome);
        data.append('document',documents);
        data.append('duration',intime);

        axios.post(schoolzapi+'/online-learning',
        data,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
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
        alert('Student class cant be empty');
        return;
      }

      if(Name == ""){
          alert('Video Title cant be empty');
          return;
      }

      if(link == ""){
        alert('Sharable Link cant be empty');
        return;
      }

      if(outcome == ""){
          alert('Outcome cant be empty');
          return;
      }

      if(intime == ""){
        alert('Duration cant be empty');
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

      data.append('stclass',value);
      data.append('link',link);
      data.append('title',Name);
      data.append('outcome',outcome);
      data.append('document',documents);
      data.append('duration',intime);
    
      axios.post(schoolzapi+'/online-learning/'+id,
      data,
      {
          headers: {Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
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
          setImg(result.uri);
        }
      }
    } catch (err) {
      setFile(null);
      console.warn(err);
      return false;
    }
  }

    return (
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

        <View style={{flexDirection: 'row',alignItems: 'center',  marginVertical: 20}}>
                    
            {img && <Avatar.Image 
                 source={{ uri: img }}
                 size={100}
            /> }
                    
            <Button mode="text" style={{fontSize: 20}} onPress={selectFile}>Video Art Work</Button>
        </View>

        <Text style={{fontSize: 15, fontWeight: 500}}>Student Class</Text>
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

        <Text style={{fontSize: 15, fontWeight: 500}}>Video Title </Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setName(e)}
        value={Name} />


        <Text style={{fontSize: 15, fontWeight: 500}}>Sharable Link</Text>
        <TextInput
        style={styles.Forminput}
        keyboardType="url"
        mode="outlined"
        onChangeText={(e) => setlink(e)}
        value={link} />


        <Text style={{fontSize: 15, fontWeight: 500}}>Study Documents</Text>
        <TextInput
        style={styles.Forminput}
        multiline={true}
        numberOfLines={4}
        mode="outlined"
        onChangeText={(e) => setdocuments(e)}
        value={documents} />


        <Text style={{fontSize: 15, fontWeight: 500}}>Outcome</Text>
        <TextInput
        style={styles.Forminput}
        multiline={true}
        numberOfLines={4}
        mode="outlined"
        onChangeText={(e) => setoutcome(e)}
        value={outcome} />

<TimePickerModal
          visible={showintime}
          onDismiss={onDismissintime}
          onConfirm={onConfirmintime}
          hours={12}
          minutes={14}
        />

         <Text style={{fontSize: 15, fontWeight: 500}}>Duration</Text>
         <TextInput
            style={styles.Forminput}
            mode="outlined"
            keyboardType="default"
            onFocus={()=>  setShowintime(true)}
            onChangeText={(e) => setIntime(e)}
            value={intime} />

           

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
    )
}

export default Createeditelearning;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    }
});