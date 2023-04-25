import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selecttoken } from '../../../features/userinfoSlice';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';

function Createeditbook() {

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

      loadsubject();

      if(id == undefined){
        isCreatedorEdit('New Book');
        
      }else{
        loaddataedit();
        isCreatedorEdit('Edit Book');
      }

    },[]);



      const loaddataedit = () => {
        setLoading(true);
        
        axios.get(schoolzapi+'/books/show/'+id,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
        .then(function (results) {
            setLoading(false);
            setImg(results.data.data.file);
            setName(results.data.data.title);
            setisbn(results.data.data.isbnnumber);
            setpublisher(results.data.data.publisher);
            setauthor(results.data.data.authour);
            setValue(parseInt(results.data.data.subjectid));
            setquanity(results.data.data.qty);
            setprice(results.data.data.price);
            setnote(results.data.data.description);

        }).catch(function(error){
            setLoading(false);
            console.log(error);
            
        });
    }



    const loadsubject = () => {
      
      setLoading(true);

      axios.get(schoolzapi+'/subject',
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
          console.log(error);
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

        if(Name == ""){
          alert('Book Title cant be empty');
          return;
        }

        if(isbn == ""){
            alert('Isbn cant be empty');
            return;
        }

        if(author == ""){
          alert('Author cant be empty');
          return;
        }

        if(publisher == ""){
          alert('Publisher cant be empty');
          return;
        }

        if(value == ""){
            alert('Subject cant be empty');
            return;
        }

        if(quanity == ""){
          alert('Quantity cant be empty');
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

        data.append('name',Name);
        data.append('isbn',isbn);
        data.append('publisher',publisher);
        data.append('author',author);
        data.append('subject',value);
        data.append('qty',quanity);
        data.append('price',price);
        data.append('note',note);

        axios.post(schoolzapi+'/books',
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

      if(Name == ""){
        alert('Book Title cant be empty');
        return;
      }

      if(isbn == ""){
          alert('Isbn cant be empty');
          return;
      }

      if(author == ""){
        alert('Author cant be empty');
        return;
      }

      if(publisher == ""){
        alert('Publisher cant be empty');
        return;
      }

      if(value == ""){
          alert('Subject cant be empty');
          return;
      }

      if(quanity == ""){
        alert('Quantity cant be empty');
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

        data.append('name',Name);
        data.append('isbn',isbn);
        data.append('publisher',publisher);
        data.append('author',author);
        data.append('subject',value);
        data.append('qty',quanity);
        data.append('price',price);
        data.append('note',note);
    
      axios.post(schoolzapi+'/books/'+id,
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
                    
            <Button mode="text" style={{fontSize: 20}} onPress={selectFile}>Pick Book Pickart</Button>
        </View>

        <Text style={{fontSize: 15, fontWeight: 500}}>Book Title </Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setName(e)}
        value={Name} />


        <Text style={{fontSize: 15, fontWeight: 500}}>ISBN publisher</Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setisbn(e)}
        value={isbn} />


        <Text style={{fontSize: 15, fontWeight: 500}}>Publisher</Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setpublisher(e)}
        value={publisher} />


        <Text style={{fontSize: 15, fontWeight: 500}}>Author</Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setauthor(e)}
        value={author} />

           <Text style={{fontSize: 15, fontWeight: 500}}>Subject</Text>
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

<Text style={{fontSize: 15, fontWeight: 500}}>Quantity</Text>
        <TextInput
        style={styles.Forminput}
        keyboardType="numeric"
        mode="outlined"
        onChangeText={(e) => setquanity(e)}
        value={quanity} />


<Text style={{fontSize: 15, fontWeight: 500}}>Price</Text>
        <TextInput
        style={styles.Forminput}
        keyboardType="numeric"
        mode="outlined"
        onChangeText={(e) => setprice(e)}
        value={price} />



<Text style={{fontSize: 15, fontWeight: 500}}>Note</Text>
        <TextInput
        style={styles.Forminput}
        multiline={true}
        numberOfLines={5}
        mode="outlined"
        onChangeText={(e) => setnote(e)}
        value={note} />

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

export default Createeditbook;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    }
});