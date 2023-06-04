import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, Dimensions, KeyboardAvoidingView, Linking, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, Divider, Modal, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import {  selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi, images } from '../../../components/constants';
import { FlatList,Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from "react-native-maps-directions";
import { selectdesaddress, selectdestination, selectorgaddress, seleteorigin, setDestination, setOrgaddress, setOrigin } from '../../../features/examSlice';
import * as Location from 'expo-location';

function Trackroute() {

    const token = useSelector(selecttoken);
    const dispatch = useDispatch();
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
    const [time, settime] = useState("");
    const [heading, setheading] = useState(100);


    const origin = useSelector(seleteorigin);
    const originaddress = useSelector(selectorgaddress);
    const destination = useSelector(selectdestination);
    const destaddress = useSelector(selectdesaddress);

    const setautoref = useRef();

    const mapref = useRef(null);
    const markerRef = useRef();

    const [mylocation, setmylocation] = useState(null);
    const [mylocationadd, setmylocationadd] = useState(null);
    const [usemylocation, setusemylocation] = useState(false);

    const [state, setState] = useState({
      coordinate: new AnimatedRegion({
          latitude: origin?.latitude ?? 5.5981754,
          longitude: origin?.longitude ?? -0.1125837,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
      }),
  })


   const { coordinate } = state;

   const [openmodal, setopenmodal] = useState(false);


    useEffect(()=> {
      if(destination == null || origin == null) return;

       animate(origin?.latitude, origin?.longitude);

        // mapref.current.fitToCoordinates([
        //   {latitude: parseFloat(origin.latitude),longitude: parseFloat(origin.longitude)},
        //   {latitude: parseFloat(destination.latitude),longitude: parseFloat(destination.longitude)}
        // ],
        //   {edgePadding: {top: 50, right: 50, bottom: 50, left: 50}});

        
    },[origin,destination,usemylocation]);
   


  useEffect(() => {
    const interval = setInterval(() => {
        getLiveLocation()
    }, 9000);
    return () => clearInterval(interval)
  }, []);


function getLiveLocation(){

  (async () => {
    
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    if(location){

    dispatch(setDestination({latitude: location.coords.latitude,longitude: location.coords.longitude}));

    getdriverlocation();


    }
    
    
  })();
}


const getdriverlocation = () => {
  
  axios.get(schoolzapi+'/routes/show/'+id,
{
    headers: {Accept: 'application/json',
    Authorization: "Bearer "+token
}
})
  .then(function (results) {
      
      setroutes(results.data.data);

     // console.log("live location",results.data.data.address);

      const lat = parseFloat(results.data.data.latitude);
      const lng = parseFloat(results.data.data.longitude);
      const address = results.data.data.address;

      setheading(parseFloat(results.data.data.heading));

      dispatch(setOrigin({latitude: lat,longitude: lng}));
      dispatch(setOrgaddress(address));

      animate(lat, lng);

            setState({
                coordinate: new AnimatedRegion({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005
                })
            })

      // fetchaddress(lat, lng);

  }).catch(function(error){
      
      console.log("error",error);
  });
}


const fetchaddress = (lat, lng) => {
  fetch(
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      lat +
      ',' +
      lng +
      '&key=' +
      'AIzaSyAJYTDdNireWqKZ5Y8yNbwqW8YMAreLjTo',
  )
    .then(response => response.json())
    .then(responseJson => {
     // console.log("responseJson",responseJson?.results[0]);
     // console.log("responseJson",responseJson?.results[0]?.formatted_address);
      dispatch(setOrgaddress(responseJson?.results[0]?.formatted_address));
    });
}



const animate = (latitude, longitude) => {
  const newCoordinate = { latitude, longitude };
  if (Platform.OS == 'android') {
      if (markerRef.current) {
          markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      }
  } else {
      coordinate.timing(newCoordinate).start();
  }
}




    // useEffect(()=> {
    //   if(destination == null || origin == null) return;
     
    //    const traveltime = async() => {
    //     fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destaddress}
    //     &origins=${address}&units=imperial&key=AIzaSyAJYTDdNireWqKZ5Y8yNbwqW8YMAreLjTo`)
    //     .then((respone) => respone.json())
    //     .then((data) => {
    //         setdistance(data.rows[0].elements[0]);
    //      });
    //    };

    //    traveltime();
        
    // },[destination,destaddress]);


    useEffect(()=>{
      loaddata();
    },[]);


    const refresh = () => {
        loaddata();
    }


    const loaddata = () => {
      setLoading(true);

      console.log("loading");
      
      axios.get(schoolzapi+'/routes/show/'+id,
    {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
    }
    })
      .then(function (results) {
          
          setroutes(results.data.data); 
         setLoading(false);

      }).catch(function(error){
          setLoading(false);
          console.log("error",error);
          
      });
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

    

        <ScrollView keyboardShouldPersistTaps='always'
        >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>

        <GooglePlacesAutocomplete
            placeholder="Your Destination"
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            fetchDetails={true}
            returnKeyType={"Search"}
            enablePoweredByContainer={false}
            onPress={(data, details = null) => {
              const location = JSON.stringify(details?.geometry?.location);
              
              setmylocation({latitude: parseFloat(JSON.stringify(details?.geometry?.location.lat)),longitude: parseFloat(JSON.stringify(details?.geometry?.location.lng))});
              setmylocationadd(data.description);

              setusemylocation(true);

              //dispatch(setDestination({latitude: parseFloat(JSON.stringify(details?.geometry?.location.lat)),longitude: parseFloat(JSON.stringify(details?.geometry?.location.lng))}));
             // dispatch(setdaddress(data.description))

            }}
            styles={{
              container: {
                flex: 1
              }
            }}
            query={{
              key: 'AIzaSyAJYTDdNireWqKZ5Y8yNbwqW8YMAreLjTo',
              language: 'en',
            }}
          />


        {destination && (
        
        <View style={{height: SCREEN_HEIGHT}}>
        
        <TouchableOpacity onPress={()=> setusemylocation(false)} style={{position: 'absolute', zIndex: 1000, right: 0, top: 10}}>
          <Ionicons name="locate-sharp" size={40} />
        </TouchableOpacity>
        
        <MapView style={styles.map}
            ref={mapref}
            mapType="mutedStandard"
                initialRegion={{
                    latitude: parseFloat(origin?.latitude ?? 5.5981754),
                    longitude: parseFloat(origin?.longitude ?? -0.1125837),
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
          
                {destination && origin && (

                  <MapViewDirections
                    origin={{latitude: parseFloat(origin.latitude),longitude: parseFloat(origin.longitude)}}
                    destination={{latitude: parseFloat(usemylocation ? mylocation?.latitude : destination.latitude),longitude: parseFloat(usemylocation ? mylocation?.longitude : destination.longitude)}}
                    apikey="AIzaSyAJYTDdNireWqKZ5Y8yNbwqW8YMAreLjTo"
                    mode="DRIVING"
                    strokeWidth={3}
                    strokeColor='red'
                    optimizeWaypoints={true}
                    onReady={result => {

                      console.log(`Distance: ${result.distance.toFixed(0)} km`);
                      console.log(`Duration: ${result.duration.toFixed(0)} min.`);

                      settime(`${result.duration.toFixed(0)} min`);

                      setdistance(`${result.distance.toFixed(0)} km ${result.duration.toFixed(0)} min`);

                      mapref.current.fitToCoordinates(result.coordinates,
                        {edgePadding: {top: 50, right: 50, bottom: 50, left: 50},animate: true});
                    }}
                    />

                )}


                {origin && (

                  <Marker.Animated
                  ref={markerRef}
                  coordinate={{latitude: parseFloat(origin.latitude),longitude: parseFloat(origin.longitude)}}
                  title="Drivers Location"
                  //description={address}
                  identifier='origin'
                  onPress={()=> setopenmodal(true)}
                  >
                  <Image source={require('../../../assets/bus.png')}
                  resizeMode="contain"
                  style={{
                    width: 40,
                    height: 40,
                    transform: [{rotate: `${heading}deg`}]
                  }}
                  />
                  </Marker.Animated>

                )}
                   
              {destination && (

                  <Marker.Animated
                  coordinate={{latitude: parseFloat(usemylocation ? mylocation?.latitude : destination.latitude),longitude: parseFloat(usemylocation ? mylocation?.longitude : destination.longitude)}}
                  title={`Your Location Ariving in ${time}`}
                  identifier='destination'
                />

              )}    
                    
    
            </MapView>
          
        </View>

        )}
                       
                        
      <Divider style={{marginVertical: 20}} />


      <Modal
          visible={openmodal}
          onDismiss={() => {
            setopenmodal(!openmodal);
          }}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>

          <TouchableOpacity>
        <Text style={{fontSize: 18, color: '#fff'}}>Drivers name</Text>
        <Text style={{color: '#fff'}}>{route.assignedto}</Text>
      </TouchableOpacity>

      <Divider style={{marginVertical: 20}} />

      <TouchableOpacity>
        <Text style={{fontSize: 18,color: '#fff'}}>Drivers contact</Text>
        <Text onPress={() => Linking.openURL(`tel:${route?.contact}`)} style={{color: '#fff'}}>{route.contact}</Text>
      </TouchableOpacity>

      <Divider style={{marginVertical: 20}} />

      <TouchableOpacity>
        <Text style={{fontSize: 18,color: '#fff'}}>Vehicle Current Location</Text>
        <Text style={{color: '#fff'}}>{originaddress}</Text>
      </TouchableOpacity>

      <Divider style={{marginVertical: 20}} />

       <TouchableOpacity>
        <Text style={{fontSize: 18,color: '#fff'}}>Distance / Time Remaining</Text>
        {distance !== "" && (
           <Text style={{color: '#fff'}}>{distance}</Text>
        )}
       
      </TouchableOpacity> 



          </View>
            
        </Modal>

  

       </Card.Content>
        </Card>
        )}
        </ScrollView>

      </SafeAreaView>
    )
}

export default Trackroute;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
});