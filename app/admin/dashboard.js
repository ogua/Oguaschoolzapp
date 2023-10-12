import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, Button, FlatList, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selecttoken,selectcurrency, selectuserpermission, selectstaffrole, selectuser, selectroles } from '../../features/userinfoSlice';
import {setOrigin, setDestination, setHeading, updateroute } from '../../features/examSlice';

import { LOCATION_TASK_NAME, schoolzapi } from '../../components/constants';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import {
    BannerAd,
    BannerAdSize,
    TestIds,
    } from "react-native-google-mobile-ads";
import { Snackbar } from 'react-native-paper';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function Dashboard() {
    const [dashbaord, Setdashboard] = useState("");
    const [loading, Setisloading] = useState(true);
    const token = useSelector(selecttoken);
    const mrole = useSelector(selectroles);
    const user = useSelector(selectuser);
    const currency = useSelector(selectcurrency);
    const [expectedfees, Setexpectedfees] = useState("");
    const permission = useSelector(selectuserpermission);
    const dispatch = useDispatch();
    const role = useSelector(selectstaffrole);

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5448171275225637/7712155558';
    const [updateIsAvailable, setUpdateAvailable] = useState(false);

    async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
          },
          trigger: { seconds: 2 },
        });
      }


      async function registerForPushNotificationsAsync() {
        let token;
      
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log(token);
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        return token;
      }


    useEffect(() => {

        const formdata = {
            token: expoPushToken
        }

        axios.post(schoolzapi+'/mobile-tokens',
        formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
            console.log("token added");
        })
        .catch(function (error) {
          console.log("token error",error);
        });


    },[expoPushToken]);


    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);




    useEffect(() => {

        (async () => {
          
          let { status } = await Location.requestBackgroundPermissionsAsync();
  
          if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
          }

          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
          });

          initail();

        })();
  
      }, []);

      useFocusEffect(() => {
       // onFetchUpdateAsync();   
      });
      

    //   async function onFetchUpdateAsync() {
    //     try {
    //       const update = await Updates.checkForUpdateAsync();
    
    //       if (update.isAvailable) {
    //         await Updates.fetchUpdateAsync();
    //         setUpdateAvailable(true);
    //       }else{
    //         setUpdateAvailable(false);
    //       }
    //     } catch (error) {
    //       console.log("error",error);
    //       alert(`Error fetching latest Expo update: ${error}`);
    //     }
    //   }

      function initail(){

        TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
            if (error) {
              // Error occurred - check `error.message` for more details.
              alert('Something went wrong with background locations');
              return;
            }
            if (data) {
              const { locations } = data;
             // console.log("locations",locations[0].coords);

             if(role == "Driver"){

                console.log("drive locations...")

                // dispatch(updateroute({
                //     cordinates: {latitude: locations[0].coords.latitude,longitude: locations[0].coords.longitude},
                //     token: token
                // }));

                dispatch(setOrigin({latitude: locations[0].coords.latitude,longitude: locations[0].coords.longitude}));

                dispatch(setHeading( locations[0].coords.heading));


             }else{
                dispatch(setDestination({latitude: locations[0].coords.latitude,longitude: locations[0].coords.longitude}));
             }
            }
          });

      }
      
    
    
    useEffect(()=>{
        loaddata();
    },[]);


    useFocusEffect(() => {
        if(user == null){
            router.replace("/expo-auth-session");
        }    
    });

    const loaddata = () => {
        axios.get(schoolzapi+'/dashboard',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            Setdashboard(response.data);
            Setisloading(false);
            Setexpectedfees(parseInt(response.data?.arrears) + parseInt(response.data?.amountleft));
          })
          .catch(function (error) {
            Setisloading(false);
            console.log(error);
           // console.log(token);
          });
    }


   return (
    <SafeAreaView style={{flexGrow: 1}}>

        {mrole[0] !== 'Student' && (
                    <>
                       {dashbaord !== "" && (
                        <>
                            {dashbaord?.expiry !== "true" && (
                                <Text style={{color: 'red', padding: 10, position: 'absolute', bottom: 40, zIndex: 2000, backgroundColor: '#fff'}}>Your current plan ({ dashbaord.planname ?? '' }) { dashbaord.expiry ?? '' }, if you would like to extend it, please click on make payment to extend the expiration date. thank you.</Text>
                            )}

                        </>
                       )}                        
                    </>
        )}

        {loading ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 200}}>
                <ActivityIndicator size="large" />
            </View>
        ) : (

            <ScrollView style={{marginBottom: 30, paddingLeft: 20, paddingRight: 20}}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={loaddata} />
            }
            >

        {/* <Text>Your expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>Title: {notification && notification.request.content.title} </Text>
            <Text>Body: {notification && notification.request.content.body}</Text>
            <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </View>
        <Button
            title="Press to schedule a notification"
            onPress={async () => {
            await schedulePushNotification();
            }}
        /> */}
                
                
                
                
                <TouchableOpacity>
                    <View style={styles.containerview}>
                        <Text style={styles.containertexth1}>{dashbaord?.currentacademicterm}</Text>
                        <Text style={styles.containertexth2}>Current Academic Term</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[{marginTop: 20}]}>
                    <View style={styles.containerview}>
                        <Text style={styles.containertexth1}>{dashbaord?.currentacademicyear}</Text>
                        <Text style={styles.containertexth2}>Current Academic Year</Text>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity style={[{marginTop: 20}]}>
                    <View style={styles.containerview}>
                        <Text style={styles.containertexth1}>{dashbaord?.yearstart}</Text>
                        <Text style={styles.containertexth2}>Current Year Start</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[{marginTop: 20}]}>
                    <View style={styles.containerview}>
                        <Text style={styles.containertexth1}>{dashbaord?.yearend}</Text>
                        <Text style={styles.containertexth2}>Current Year End</Text>
                    </View>
                </TouchableOpacity>

            
            {permission.includes("viewviewtotalsmsbalance") && (

            <TouchableOpacity style={[{marginTop: 20}]}>
                <View style={{backgroundColor: '#17a2b8',padding: 10, flexDirection: 'row',
                 alignItems: 'center'}}>
                    <View style={{backgroundColor: '#28a745', padding: 10}}>
                        <Ionicons name="send-sharp" color="#fff" size={30} />
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text style={styles.smstexth1}>{dashbaord?.sms}</Text>
                        <Text style={styles.smstexth2}>Total Sms Balance</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )}


         {permission.includes("viewviewtotalvoicebalance") && (    
            <TouchableOpacity style={[{marginTop: 20}]}>
                <View style={{backgroundColor: '#17a2b8',padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#17a2b8', padding: 10}}>
                        <Ionicons name="send-sharp" color="#fff" size={30} />
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text style={styles.smstexth1}>
                            {dashbaord?.voicebalance.length > 0 
                            ? dashbaord?.voicebalance.substring(0,10)
                             : 0}
                            </Text>
                        <Text style={styles.smstexth2}>Total Voice Balance</Text>
                    </View>
                </View>
            </TouchableOpacity>

        )}     



          {permission.includes("viewtotalstaff") && (                    
            <TouchableOpacity style={[{marginTop: 20}]}>
                <View style={{backgroundColor: '#17a2b8',padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#28a745', padding: 10}}>
                        <Ionicons name="person-circle-outline" color="#fff" size={30} />
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text style={styles.smstexth1}>{dashbaord?.totalstaff}</Text>
                        <Text style={styles.smstexth2}>Total Staff</Text>
                    </View>
                </View>
            </TouchableOpacity>

        )}


            {permission.includes("viewtotalstudents") && (
            <TouchableOpacity style={[{marginTop: 20}]}>
                <View style={{backgroundColor: '#17a2b8',padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#17a2b8', padding: 10}}>
                        <Ionicons name="person-circle-outline" color="#fff" size={30} />
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text style={styles.smstexth1}>{dashbaord?.allstudents}</Text>
                        <Text style={styles.smstexth2}>Total Students</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )}

            
            {permission.includes("viewlasttermarrears") && (
            <TouchableOpacity style={[{marginTop: 20}]}>
                <View style={{backgroundColor: '#17a2b8',padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#28a745', padding: 10}}>
                        <Ionicons name="cash-outline" color="#fff" size={30} />
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text style={styles.smstexth1}>{currency}{dashbaord?.arrears}</Text>
                        <Text style={styles.smstexth2}>Last Term Arrears</Text>
                    </View>
                </View>
            </TouchableOpacity>
            )}

            
            {permission.includes("viewexpectedfees") && (
            <TouchableOpacity style={[{marginTop: 20}]}>
                <View style={{backgroundColor: '#17a2b8',padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#17a2b8', padding: 10}}>
                        <Ionicons name="cash-outline" color="#fff" size={30} />
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text style={styles.smstexth1}>{currency}{dashbaord?.expectedfees}</Text>
                        <Text style={styles.smstexth2}>Expected Fees</Text>
                    </View>
                </View>
            </TouchableOpacity>
            )}

            
            {permission.includes("viewexpectedowings") && (
            <TouchableOpacity style={[{marginTop: 20}]}>
                <View style={{backgroundColor: '#17a2b8',padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#28a745', padding: 10}}>
                        <Ionicons name="cash-outline" color="#fff" size={30} />
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text style={styles.smstexth1}>{currency}{expectedfees}</Text>
                        <Text style={styles.smstexth2}>Expected Owings</Text>
                    </View>
                </View>
            </TouchableOpacity>
            )}

            
            {permission.includes("viewtotalfeesreceivedthisterm") && (
            <TouchableOpacity style={[{marginTop: 20}]}>
                <View style={{backgroundColor: '#17a2b8',padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#17a2b8', padding: 10}}>
                        <Ionicons name="cash-outline" color="#fff" size={30} />
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text style={styles.smstexth1}>{currency}{dashbaord?.totaltermnow}</Text>
                        <Text style={styles.smstexth2}>Fees Received This Term</Text>
                    </View>
                </View>
            </TouchableOpacity>
            )}

            
            {permission.includes("viewtotalfeespayablethismonth") && (
            <TouchableOpacity style={[{marginTop: 20}]}>
                <View style={{backgroundColor: '#17a2b8',padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#28a745', padding: 10}}>
                        <Ionicons name="cash-outline" color="#fff" size={30} />
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text style={styles.smstexth1}>{currency}{dashbaord?.totalmonth}</Text>
                        <Text style={styles.smstexth2}>Total Fees Payable This Month</Text>
                    </View>
                </View>
            </TouchableOpacity>
            )}

            
            {permission.includes("viewtotalfeesreceivedtoday") && (
            <TouchableOpacity style={[{marginTop: 20}]}>
                <View style={{backgroundColor: '#17a2b8',padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#17a2b8', padding: 10}}>
                        <Ionicons name="cash-outline" color="#fff" size={30} />
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text style={styles.smstexth1}>{currency}{dashbaord?.totaltoday}</Text>
                        <Text style={styles.smstexth2}>Total Fees Received Today</Text>
                    </View>
                </View>
            </TouchableOpacity>
            )}

            
            {permission.includes("viewtotalattendance") && (
            <TouchableOpacity style={[{marginTop: 20}]}>
                <View style={{backgroundColor: '#17a2b8',padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#28a745', padding: 10}}>
                        <Ionicons name="checkbox-outline" color="#fff" size={30} />
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text style={styles.smstexth1}>{dashbaord?.totalattendance}</Text>
                        <Text style={styles.smstexth2}>Total Attendance</Text>
                    </View>
                </View>
            </TouchableOpacity>
            )}

            
            {permission.includes("viewtotalabsenttoday") && (
            <TouchableOpacity style={[{marginTop: 20}]}>
                <View style={{backgroundColor: '#17a2b8',padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#fff', padding: 10}}>
                        <Ionicons name="remove" color="#17a2b8" size={30} />
                    </View>
                    <View style={{marginLeft: 10}}>
                        
                        <Text style={styles.smstexth1}>{ parseInt(dashbaord?.totalstudents) - parseInt(dashbaord?.totalattendance)}</Text>
                        <Text style={styles.smstexth2}>Total Absent Today</Text>
                    </View>
                </View>
            </TouchableOpacity>
            )}
        </ScrollView>

        )}

    

    {/* <View style={[styles.ad]}>
            
    <Snackbar
        style={styles.update}
        visible={updateIsAvailable}
        onDismiss={() => {}}
        action={{
            label: 'Apply update',
            onPress: async () => {
                await Updates.reloadAsync();
            },
        }}
     >
      New update for you 🥳🎉.
    </Snackbar>

        </View> */}


        {/* <View style={[styles.ad,{marginRight: 20}]}>
            
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.BANNER}
                requestOptions={{ requestNonPersonalizedAdsOnly: true }}
            />

        </View> */}
    </SafeAreaView>
   );
}

export default Dashboard;

const styles = StyleSheet.create({
    update: {
        position: 'absolute',
        right: 18,
        bottom: 50,
    },
    ad: {
        position: 'absolute',
        right: 0,
        bottom: 10,
    },
 container: {
    flexDirection: 'column',
     flex: 1,
     margin: 20
 },
 containerview:{
    backgroundColor: '#17a2b8', padding: 20
 },
 containertexth1:{
    color: '#fff', fontSize: 25
 },
 containertexth2:{
    color: '#fff', fontSize: 15
 },
 smstexth1:{
    fontSize: 25,
    color: '#fff'
 },
 smstexth2:{
    fontSize: 15,
    color: '#fff'
 }

    
});
