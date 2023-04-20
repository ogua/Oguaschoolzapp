import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, Dimensions, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
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
import Ionicons from '@expo/vector-icons/Ionicons';


function Viewwaypoint() {

    const token = useSelector(selecttoken);
    const [routename, setRoutename] = useState();
    const [address, setaddress] = useState();
    const [latitude, setlatitude] = useState(""); 
    const [logitude, setlogitude] = useState("");
    const [Number, setNumber] = useState("");
    const [file, setFile] = useState(null);
    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

    const SCREEN_HEIGHT = Dimensions.get("window").height;
    const SCREEN_WIDTH = Dimensions.get("window").width;
  

    useEffect(()=>{
        loaddata();
        isCreatedorEdit('Waypoint Details');
    },[]);


    const loaddata = () => {
      
      setLoading(true);

      axios.get(schoolzapi+'/waypoint/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setLoading(false);
          console.log(response.data.data);
          setRoutename(response.data.data?.name);
          setaddress(response.data.data?.addrress);
          setlatitude(response.data.data?.latitude);
          setlogitude(response.data.data?.longitude);
          
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }


    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: creatoredit,
                presentation: 'formSheet',
                headerRight: () => (<Ionicons name="pencil" onPress={()=> router.push(`/admin/transport/create-edit-waypoint?id=${id}`)} size={20}/>)
            }}

        />
        <ScrollView style={{marginBottom: 30}} keyboardShouldPersistTaps='always'>
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>
        
        {latitude &&  logitude && (
        
        <View style={{height: SCREEN_HEIGHT/2}}>

        
        <MapView style={styles.map}
            mapType="mutedStandard"
                initialRegion={{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(logitude),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                
                  <Marker
                  coordinate={{latitude: parseFloat(latitude), longitude: parseFloat(logitude)}}
                  title={routename}
                  tracksViewChanges={true}
                  />
                
            </MapView>
          
        </View>

        )}

        <View style={{marginTop: 20}}>
            <Text>Route name: {routename} </Text>
            <Text>Route address: {address} </Text>
            <Text>Route Latitude: {latitude} </Text>
            <Text>Route Longitude: {logitude} </Text>
        </View>


      </Card.Content>
        </Card>
        )}

        </ScrollView>


      </SafeAreaView>
    )
}

export default Viewwaypoint;

const styles = StyleSheet.create({
    map: {
      width: '100%',
      height: '100%',
    },
});