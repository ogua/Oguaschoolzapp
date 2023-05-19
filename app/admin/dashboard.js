import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selecttoken,selectcurrency, selectuserpermission, selectstaffrole, setOrigin, setDestination } from '../../features/userinfoSlice';
import { LOCATION_TASK_NAME, schoolzapi } from '../../components/constants';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

function Dashboard() {
    const [dashbaord, Setdashboard] = useState();
    const [loading, Setisloading] = useState(true);
    const token = useSelector(selecttoken);
    const currency = useSelector(selectcurrency);
    const [expectedfees, Setexpectedfees] = useState("");
    const permission = useSelector(selectuserpermission);
    const dispatch = useDispatch();
    const role = useSelector(selectstaffrole);

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

      function initail(){

        TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
            if (error) {
              // Error occurred - check `error.message` for more details.
              alert('Something went wrong with background locations');
              return;
            }
            if (data) {
              const { locations } = data;
              console.log("locations",locations[0].coords);
             if(role == "Driver"){
                dispatch(setOrigin({latitude: locations[0].coords.latitude,longitude: locations[0].coords.longitude}));
             }else{
                dispatch(setDestination({latitude: locations[0].coords.latitude,longitude: locations[0].coords.longitude}));
             }
            }
          });

      }
      
    
    
    useEffect(()=>{
        loaddata();
    },[]);

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
            Setexpectedfees(parseInt(dashbaord?.arrears) + parseInt(dashbaord?.amountleft));
          })
          .catch(function (error) {
            Setisloading(false);
            console.log(error);
           // console.log(token);
          });
    }

   return (
    <SafeAreaView>
        {loading ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 200}}>
                <ActivityIndicator size="large" />
            </View>
        ) : (

            <ScrollView style={{marginBottom: 50, paddingLeft: 20, paddingRight: 20}}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={loaddata} />
            }
            >

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
    </SafeAreaView>
   );
}

export default Dashboard;

const styles = StyleSheet.create({
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
