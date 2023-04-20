import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
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
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


function Createeditwaypoint() {

    const token = useSelector(selecttoken);
    const [routename, setRoutename] = useState("");
    const [latitude, setlatitude] = useState(""); //37.78825
    const [logitude, setlogitude] = useState(""); //-122.4324
    const [address, setaddress] = useState("");
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

    const setautoref = useRef();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      if(id == undefined){
        isCreatedorEdit('New Waypoint');
       // loadonlystaff();
      }else{
        loaddataedit();
        isCreatedorEdit('Edit Waypoint');
      }

    },[]);


    const loaddataedit = () => {
      
      setLoading(true);

      axios.get(schoolzapi+'/waypoint/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          console.log(response.data.data.addrress);
          setRoutename(response.data.data?.name);
          setlatitude(response.data.data?.latitude);
          setaddress(response.data.data?.addrress);
          setlogitude(response.data.data?.longitude);

          setautoref.current.setAddressText(response.data.data?.addrress);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }

    const createdata = () => {

        if(routename == ""){
          alert('route name cant be empty');
          return;
        }

        if(latitude == ""){
            alert('latitude cant be empty');
            return;
        }

        if(logitude == ""){
          alert('longitude cant be empty');
          return;
        }

        if(address == ""){
          alert('Address Number cant be empty');
          return;
        }


        setIssubmitting(true);

        const formdata = {

          name: routename,
          latitude: latitude,
          longitude: logitude,
          coordinates: logitude+','+logitude,
          addrress: address,
        }

        axios.post(schoolzapi+'/waypoint',
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

      if(routename == ""){
        alert('route name cant be empty');
        return;
      }

      if(latitude == ""){
          alert('latitude cant be empty');
          return;
      }

      if(logitude == ""){
        alert('longitude cant be empty');
        return;
      }

      if(address == ""){
        alert('Address Number cant be empty');
        return;
      }

      setIssubmitting(true);

      const formdata = {

        name: routename,
        latitude: latitude,
        longitude: logitude,
        coordinates: logitude+','+logitude,
        addrress: address,
      }
    
      axios.post(schoolzapi+'/waypoint/'+id,
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
        <ScrollView style={{marginBottom: 30}} keyboardShouldPersistTaps='always'>
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>

        <Text style={{fontSize: 15, fontWeight: 500}}>Route Name </Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setRoutename(e)}
        value={routename} />


      <Text style={{fontSize: 15, fontWeight: 500}}>Route Address </Text>
      <GooglePlacesAutocomplete
           ref={setautoref}
            placeholder=""
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            fetchDetails={true}
            returnKeyType={"Search"}
            enablePoweredByContainer={false}
            onPress={(data, details = null) => {
              const location = JSON.stringify(details?.geometry?.location);
             // console.log("location",JSON.stringify(details?.geometry?.location.lat));
             //console.log("details", data.description);
              setlatitude(JSON.stringify(details?.geometry?.location.lat));
              setlogitude(JSON.stringify(details?.geometry?.location.lng));
              setaddress(data.description);
            }}
            styles={{
              container: {
                flex: 1
              }
            }}
            //currentLocation={true}
            query={{
              key: 'AIzaSyAJYTDdNireWqKZ5Y8yNbwqW8YMAreLjTo',
              language: 'en',
            }}
          />

        
        {/* <View style={{height: 300,marginVertical: 15}}>
        
        <MapView style={styles.map}
            ref={_map}s
            mapType="mutedStandard"
                initialRegion={{
                    latitude: latitude ?? 37.78825,
                    longitude: logitude ?? -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}

                showsUserLocation={true}
                followsUserLocation={true}
            >
                
                  <Marker
                  coordinate={{latitude: latitude ?? 37.78825, longitude:logitude ?? -122.4324}}
                  //image={{uri: require('../../../assets/bus.png')}}
                  title={routename}
                  tracksViewChanges={true}
                  />
                

            </MapView>

          
        </View> */}

        <Text style={{fontSize: 15, fontWeight: 500}}>Latitude</Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setlatitude(e)}
        value={latitude} />


        <Text style={{fontSize: 15, fontWeight: 500}}>Longitude</Text>
        <TextInput
        style={styles.Forminput}
        mode="outlined"
        onChangeText={(e) => setlogitude(e)}
        value={logitude} />

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

export default Createeditwaypoint;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    map: {
      width: '100%',
      height: '100%',
    },
});