import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, DeviceEventEmitter, Dimensions, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Avatar, Button, Card, Divider, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import MapView, { Marker } from "react-native-maps";
import { selectstaffrole, selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi, images } from '../../../components/constants';
import { FlatList,Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

function Trackroute() {

    const token = useSelector(selecttoken);
    const driver = useSelector(selectstaffrole);
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
    const [issubmitting, setissubmitting] = useState(false);
    const router = useRouter();
    const {id} = useSearchParams();

    useEffect(()=>{
      loadedit();
    },[]);


    const refresh = () => {
        loadedit();
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


    const loadedit = () => {
      setLoading(true);
      
      Promise.all([geteditwaypoint(), geteditstudent(), geteditstaff(), geteditroute()])
      .then(function (results) {
          
          const waypoint = results[0];
          const student = results[1];
          const staff = results[2];
          const route = results[3];

          setWaypoints(waypoint.data.data);
          setstudents(student.data.data);
          setstaff(staff.data.data);  
          setroutes(route.data.data); 

          loadtatitudeandlogitude(waypoint.data.data);

          console.log('students',student.data.data);

      }).catch(function(error){
          setLoading(false);
          const acct = error[0];
          const studeclass = error[1];
          
      });
  }

    const loadtatitudeandlogitude = (data) => {
            
        const waypoint = data[0];
        setlatitude(waypoint.latitude);
        setlogitude(waypoint.longitude);
        setaddress(waypoint.addrress);
        setroutename(waypoint.name);

        setLoading(false);
  
       // console.log(routes);
    }

    const endtrip = () => {
        
        return Alert.alert(
            "Are your sure?",
            "You want to end this trip",
            [
              {
                text: "No",
              },
              {
                text: "Yes End",
                onPress: () => {
                    setissubmitting(true);

                        const formdata = {
                            id: route?.id    
                        }

                        axios.post(schoolzapi+'/end-route',
                        formdata,
                        {
                            headers: {Accept: 'application/json',
                            Authorization: "Bearer "+token
                        }
                        })
                        .then(function (response) {
                            setissubmitting(false);
                            loadedit();
                        })
                        .catch(function (error) {
                            setissubmitting(false);
                            console.log(error.response);
                        });

                },
              },
            ]
          );

    }


    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Route Information',
                presentation: 'formSheet',
                headerRight: () => (
                  <>
                    <TouchableOpacity onPress={refresh}>
                      <Ionicons name="refresh" size={30} />
                    </TouchableOpacity>
                  </>
                )
            }}

        />
        <ScrollView style={{marginBottom: 30}}
        >
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
                {waypoints.map(item => (

                    <Marker
                    coordinate={{latitude: parseFloat(item.latitude),
                         longitude: parseFloat(item.longitude)}}
                    title={item.name}
                    description={item.address}
                    tracksViewChanges={true}
                    >
                    <Image source={require('../../../assets/bus.png')}
                    resizeMode="contain"
                    style={{height: 35, width:35 }} />
                    </Marker>

                ))}
                  
                
            </MapView>
          
        </View>

        )}
                       <TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                            <Text style={{textAlign: 'left'}}>Route routeno</Text>
                            <View>
                               <Text style={{textAlign: 'left'}}>{route?.name}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                            <Text style={{textAlign: 'left'}}>Route name</Text>
                            <View>
                               <Text style={{textAlign: 'left'}}>{route?.name}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                            <Text style={{textAlign: 'left'}}>Route Type</Text>
                            <View>
                               <Text style={{textAlign: 'left'}}>{route?.tripway}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                            <Text style={{textAlign: 'left'}}>Route Time</Text>
                            <View>
                               <Text style={{textAlign: 'left'}}>Start{route?.pickupstart} - End {route?.pickupend}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                            <Text style={{textAlign: 'left'}}>Vehicle</Text>
                            <View>
                               <Text style={{textAlign: 'left'}}>{route?.vehicle}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                            <Text style={{textAlign: 'left'}}>Driver</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Avatar.Image 
                                    source={{uri: route?.assignedto_pic}}
                                    size={20}
                                />
                               <Text style={{textAlign: 'left', marginLeft: 10}}>{route?.assignedto}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>

                        
                <Divider />

               <Text style={{marginVertical: 20}}>Students</Text>
                <FlatList
                    data={students}
                    renderItem={({item})=> (
                        <TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                            <Avatar.Image 
                                source={{uri: item?.pic}}
                                size={20}
                            />
                            <View>
                               <Text style={{textAlign: 'left'}}>{item?.fullname}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>
                    ) }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                         marginBottom: 20
                    }}
                    //style={{marginBottom: 40}}
                    keyExtractor={item => item.id}
                />

                <Divider />

               <Text style={{marginVertical: 20}}>Staff</Text>
                <FlatList
                    data={staff}
                    renderItem={({item})=> (
                        <TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                            <Avatar.Image 
                                source={{uri: item?.pic}}
                                size={20}
                            />
                            <View>
                               <Text style={{textAlign: 'left'}}>{item?.fullname}</Text>
                            </View>
                        </View>
                        </TouchableOpacity>
                    ) }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                         marginBottom: 20
                    }}
                    //style={{marginBottom: 40}}
                    keyExtractor={item => item.id}
                />

                <Text style={{textAlign: 'center', backgroundColor: 'red', padding: 15, color: '#fff'}}>Trip Status:  {route?.status == '0' ? 'Not Started' : (route?.status == '1' ? "Route Started" : 'Route Ended')}</Text>

                {driver == "Driver" ? (
                    <>
                     {issubmitting ? <ActivityIndicator size="large" style={{marginVertical: 15}} /> : (
                        <>
                        {route?.status == '1' && (
                            <Button textColor='red' onPress={endtrip}>End Trip</Button>
                        )}
                        </>
                     )}
                      <Button onPress={() => router.push(`/admin/transport/tracking-driver?id=${route?.id}`)}>Enter Trip</Button>
                    </>
                ) : (
                    <>
                    {route?.status == '0' ? (
                         <Button>Not Started</Button>
                        ) : (route?.status == '1' ? (
                            <Button onPress={() => router.push(`/admin/transport/tracking?id=${route?.id}`)}>Track Vehicle</Button>
                        ) : (
                            <Button>Route Endded</Button>
                    ))}
                    
                    </>
                )}
        

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
      height: '100%',
    },
});