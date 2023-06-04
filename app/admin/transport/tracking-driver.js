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

function Trackingdriver() {

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

   
    const [distance, setdistance] = useState("");
    const [time, settime] = useState("");
    
    const [openmodal, setopenmodal] = useState(false);

    const [heading, setheading] = useState(100); 
    const origin = useSelector(seleteorigin);
    const originaddress = useSelector(selectorgaddress);
    const destination = useSelector(selectdestination);
    const destaddress = useSelector(selectdesaddress);


    const setautoref = useRef();

    const mapref = useRef(null);
    const markerRef = useRef();


    const [state, setState] = useState({
      coordinate: new AnimatedRegion({
          latitude: origin.latitude ?? 5.5981754,
          longitude: origin.longitude ?? -0.1125837,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
      }),

  })


   const { coordinate } = state


    useEffect(()=> {
      if(destination == null || origin == null) return;

       animate(origin?.latitude, origin?.longitude);
        
    },[origin,destination]);
   


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

    dispatch(setOrigin({latitude: location.coords.latitude,longitude: location.coords.longitude}));

    setheading(location.coords.heading);    
    
    fetchaddress(location.coords.latitude,location.coords.longitude,location.coords.heading);  



  }
    
    
  })();
}


const getdriverlocation = (lat,lng,heading,address) => {

  const formdata = {
    id,
    lat,
    lng,
    heading,
    address
  }

  axios.post(schoolzapi+'/driver-add-cordinates',
  formdata,
{
    headers: {Accept: 'application/json',
    Authorization: "Bearer "+token
}
})
  .then(function (results) {
      
      animate(lat, lng);
            setState({
                coordinate: new AnimatedRegion({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005
                })
            });

           // fetchaddress(lat, lng);

  }).catch(function(error){
      
      console.log("error",error);
  });
}


const fetchaddress = (lat, lng, heading) => {
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
      //console.log(responseJson?.results[0]);
      dispatch(setOrgaddress(responseJson?.results[0]?.formatted_address));
      getdriverlocation(lat, lng, heading,responseJson?.results[0]?.formatted_address);

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
                headerTitle: '',
                headerShown: false,
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
                    {/* <TouchableOpacity onPress={refresh}>
                      <Ionicons name="refresh" size={30} />
                    </TouchableOpacity> */}
                  </>
                )
            }}

        />

            <TouchableOpacity onPress={() => router.back()} style={{marginLeft: 20, marginTop: 30}}>
                <Ionicons name="close-circle-outline" size={30} />
             </TouchableOpacity>    

        <ScrollView style={{marginBottom: 30}} keyboardShouldPersistTaps='always'
        >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>

        <GooglePlacesAutocomplete
            placeholder="Where Are You Going Today ?"
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            fetchDetails={true}
            returnKeyType={"Search"}
            enablePoweredByContainer={false}
            onPress={(data, details = null) => {
              const location = JSON.stringify(details?.geometry?.location);

              dispatch(setDestination({latitude: parseFloat(JSON.stringify(details?.geometry?.location.lat)),longitude: parseFloat(JSON.stringify(details?.geometry?.location.lng))}));
              dispatch(setaddress(data.description));

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


        {origin && (
        
        <View style={{height: SCREEN_HEIGHT}}>

        
        <MapView style={styles.map}
            ref={mapref}
            mapType="mutedStandard"
                initialRegion={{
                    latitude: parseFloat(origin?.latitude),
                    longitude: parseFloat(origin?.longitude),
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
          
                {destination && origin && (

                  <MapViewDirections
                    origin={{latitude: parseFloat(origin.latitude),longitude: parseFloat(origin.longitude)}}
                    destination={{latitude: parseFloat(destination.latitude),longitude: parseFloat(destination.longitude)}}
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
                  title={`Your Location Ariving in ${time}`}
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
                  coordinate={{latitude: parseFloat(destination.latitude),longitude: parseFloat(destination.longitude)}}
                  title={`Destination`}
                  // description={address}
                  identifier='destination'
                  />

                )}
                   

                    
    
            </MapView>

       <Modal
          visible={openmodal}
          onDismiss={() => {
            setopenmodal(!openmodal);
          }}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>

          <Text style={{fontSize: 18, color: '#fff'}}>Your Details</Text>

          <Divider style={{marginVertical: 20}} />

          <TouchableOpacity>
        <Text style={{fontSize: 18, color: '#fff'}}>Your name</Text>
        <Text style={{color: '#fff'}}>{route.assignedto}</Text>
      </TouchableOpacity>

      <Divider style={{marginVertical: 20}} />

      <TouchableOpacity>
        <Text style={{fontSize: 18,color: '#fff'}}>Contact</Text>
        <Text onPress={() => Linking.openURL(`tel:${route?.contact}`)} style={{color: '#fff'}}>{route.contact}</Text>
      </TouchableOpacity>

      <Divider style={{marginVertical: 20}} />

      <TouchableOpacity>
        <Text style={{fontSize: 18,color: '#fff'}}>Current Location</Text>
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
          
        </View>

        )}
                       
                        
      {/* <Divider style={{marginVertical: 20}} />

       <TouchableOpacity>
        <Text style={{fontSize: 18}}>Distance / Time Remaining</Text>
        {distance !== "" && (
           <Text>{distance}</Text>
        )}
       
      </TouchableOpacity>  */}

            
       </Card.Content>
        </Card>
        )}
        </ScrollView>

      </SafeAreaView>
    )
}

export default Trackingdriver;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
});