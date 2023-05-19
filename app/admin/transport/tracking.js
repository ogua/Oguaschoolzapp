import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, Dimensions, KeyboardAvoidingView, Linking, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, Divider, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import MapView, { Marker } from "react-native-maps";
import { selectdestination, selecttoken, seleteorigin } from '../../../features/userinfoSlice';
import { schoolzapi, images } from '../../../components/constants';
import { FlatList,Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from "react-native-maps-directions";

function Trackroute() {

    const token = useSelector(selecttoken);
    const [waypoints, setWaypoints] = useState([]);
    const [students, setstudents] = useState([]);
    const [staff, setstaff] = useState([]);
    const [route, setroutes] = useState({});
    
    const [latitude, setlatitude] = useState(""); 
    const [logitude, setlogitude] = useState("");
    const [address, setaddress] = useState("");
    const [routename,setroutename] = useState("");
    
    const SCREEN_HEIGHT = Dimensions.get("window").height;
    const [isloading, setLoading] = useState(false);
    const router = useRouter();
    const {id,mylatitiude,mylongitude,myaddress} = useSearchParams();

    const [dlatitude, setdlatitude] = useState(mylatitiude); 
    const [dlogitude, setdlogitude] = useState(mylongitude);
    const [daddress, setdaddress] = useState(myaddress);
    const [distance, setdistance] = useState("");


    const origin = useSelector(seleteorigin);
    const destination = useSelector(selectdestination);

    const setautoref = useRef();

    const mapref = useRef(null);

    useEffect(()=> {
      if(dlatitude == null || dlogitude == null) return;

      if(latitude == "" || logitude == null) return;
        // mapref.current.fitToSuppliedMarkers(['origin','destination'],{
        //   edgePadding: {top: 50, right: 50, bottom: 50, left: 50}
        // });


        mapref.current.fitToCoordinates([
          {latitude: parseFloat(latitude),longitude: parseFloat(logitude)},
          {latitude: parseFloat(dlatitude),longitude: parseFloat(dlogitude)}],
          {edgePadding: {top: 50, right: 50, bottom: 50, left: 50}});
        
    },[dlatitude,dlogitude]);


    useEffect(()=> {
      if(dlatitude == null || dlogitude == null) return;

      if(latitude == "" || logitude == null) return;
     
      console.log("url",`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${daddress}&origins=${address}&units=imperial&key=AIzaSyAJYTDdNireWqKZ5Y8yNbwqW8YMAreLjTo`);

       const traveltime = async() => {
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${daddress}
        &origins=${address}&units=imperial&key=AIzaSyAJYTDdNireWqKZ5Y8yNbwqW8YMAreLjTo`)
        .then((respone) => respone.json())
        .then((data) => {
            console.log(data);
            console.log("respone",data.rows[0].elements[0]);
            setdistance(data.rows[0].elements[0]);
         });
       };

       traveltime();
        
    },[dlatitude,dlogitude,daddress]);


    useEffect(()=>{
      loaddata();
    },[]);


    const refresh = () => {
        loaddata();
    }

    function geteditwaypoint() {

      return axios.get(schoolzapi+'/waypoint-show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      });
   }

   function geteditstudent() {

      return axios.get(schoolzapi+'/student-show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      });
   }



   function geteditstaff() {

      return axios.get(schoolzapi+'/staff-show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      });
   }


   function geteditroute() {

    return axios.get(schoolzapi+'/routes/show/'+id,
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    });
 }


    const loaddata = () => {
      setLoading(true);

      console.log("loading");
      
      Promise.all([geteditwaypoint(),geteditroute()])
      .then(function (results) {
          
          const waypoint = results[0];
          const route = results[1];

         // console.log("waypoint",waypoint);
          
          setWaypoints(waypoint.data.data);
          setroutes(route.data.data); 
          loadtatitudeandlogitude();


      }).catch(function(error){
          setLoading(false);
          const acct = error[0];
          const studeclass = error[1];
          
      });
  }

    const loadtatitudeandlogitude = () => {
            
        const waypoint = waypoints.slice(-1)[0];
        
        setlatitude(waypoint.latitude);
        setlogitude(waypoint.longitude);
        setaddress(waypoint.addrress);
        setroutename(waypoint.name);

        setLoading(false);
  
       // console.log(items);
    }


    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Tracking',
                presentation: 'formSheet',
                headerLeft: () => (
                  <>
                    <TouchableOpacity onPress={() => router.back()}>
                      <Ionicons name="close-circle-outline" size={30} />
                    </TouchableOpacity>
                  </>
                ),
                headerRight: () => (
                  <>
                    <TouchableOpacity onPress={refresh}>
                      <Ionicons name="refresh" size={30} />
                    </TouchableOpacity>
                  </>
                )
            }}

        />

    

        <ScrollView style={{marginBottom: 30}} keyboardShouldPersistTaps='always'
        >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>

        <GooglePlacesAutocomplete
           // ref={setautoref}
            placeholder="Your Destination"
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            fetchDetails={true}
            returnKeyType={"Search"}
            enablePoweredByContainer={false}
            onPress={(data, details = null) => {
              const location = JSON.stringify(details?.geometry?.location);
              setdlatitude(parseFloat(JSON.stringify(details?.geometry?.location.lat)));
              setdlogitude(parseFloat(JSON.stringify(details?.geometry?.location.lng)));
              setdaddress(data.description);

              console.log("description",data.description);

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


        {latitude &&  logitude && (
        
        <View style={{height: SCREEN_HEIGHT/3}}>

        
        <MapView style={styles.map}
            ref={mapref}
            // onLayout={(mapRef) => mapRef.current.fitToCoordinates([
            //   {latitude: parseFloat(latitude),longitude: parseFloat(logitude)},
            //   {latitude: parseFloat(dlatitude),longitude: parseFloat(dlogitude)}],
            //   { edgePadding: { top: 50, right: 10, bottom: 10, left: 10 } })}
            mapType="mutedStandard"
                initialRegion={{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(logitude),
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
                {dlatitude && dlogitude && (

                  <MapViewDirections
                    origin={{latitude: parseFloat(latitude), longitude: parseFloat(logitude)}}
                    destination={{latitude: parseFloat(dlatitude), longitude: parseFloat(dlogitude)}}
                    apikey="AIzaSyAJYTDdNireWqKZ5Y8yNbwqW8YMAreLjTo"
                    mode="DRIVING"
                    strokeWidth={3}
                    strokeColor='black'
                    />

                )}

                    <Marker
                      coordinate={{latitude: parseFloat(latitude),
                          longitude: parseFloat(logitude)}}
                      title="Drivers Location"
                      //description={address}
                      identifier='origin'
                      >
                      <Image source={require('../../../assets/bus.png')}
                      resizeMode="contain"
                      style={{height: 35, width:35 }} />
                    </Marker>


                    <Marker
                        coordinate={{latitude: parseFloat(dlatitude),
                            longitude: parseFloat(dlogitude)}}
                        title="Your Location"
                       // description={address}
                        identifier='destination'
                       />
    
            </MapView>
          
        </View>

        )}
                       
                        
      <Divider style={{marginVertical: 20}} />

      <TouchableOpacity>
        <Text style={{fontSize: 18}}>Drivers name</Text>
        <Text>{route.assignedto}</Text>
      </TouchableOpacity>

      <Divider style={{marginVertical: 20}} />

      <TouchableOpacity>
        <Text style={{fontSize: 18}}>Drivers contact</Text>
        <Text onPress={() => Linking.openURL(`tel:${route?.contact}`)}>{route.contact}</Text>
      </TouchableOpacity>

      <Divider style={{marginVertical: 20}} />

      <TouchableOpacity>
        <Text style={{fontSize: 18}}>Vehicle Current Location</Text>
        <Text>{address}</Text>
      </TouchableOpacity>

      <Divider style={{marginVertical: 20}} />

      <TouchableOpacity>
        <Text style={{fontSize: 18}}>Time Remaining</Text>
        {distance !== "" && (
           <Text>{distance?.duration?.text}</Text>
        )}
       
      </TouchableOpacity>

            
                

       </Card.Content>
        </Card>
        )}
        </ScrollView>

      </SafeAreaView>
    )
}

export default Trackroute;

const styles = StyleSheet.create({
    map: {
      width: '100%',
      height: '100%'
    },
});