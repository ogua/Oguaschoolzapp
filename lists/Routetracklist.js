import { useEffect, useState } from "react";
import { Linking, TouchableWithoutFeedback, View } from "react-native";
import { Avatar, Button, Card, Dialog, Divider, List, Menu, Portal, Snackbar, Text } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
//import Geolocation from '@react-native-community/geolocation';


const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

function Routetracklist ({item,deletedata,location,driver}) {

    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const [latitude, setlatitude] = useState("");
    const [longitude, setlongitude] = useState("");
    const [address, setaddress] = useState("");
    
    
    useEffect(()=>{

       // Geolocation.getCurrentPosition(info => console.log("info",info));
     
        if (location) {
        console.log("loc",location.coords);
        setlatitude(location.coords.latitude);
        setlongitude(location.coords.longitude);
        setaddress(location.coords.longitude);
     }

    },[]);


    const trackbus = () => {

        if (location) {
            setlatitude(location.coords.latitude);
            setlongitude(location.coords.longitude);
        }

        router.push(`/admin/transport/view-route-track?id=${item?.id}&mylatitiude=${latitude}&mylongitude=${longitude}&myaddress=${address}`)

    }

    const starttrip = () => {

        if (location) {
            setlatitude(location.coords.latitude);
            setlongitude(location.coords.longitude);
        }

        router.push(`/admin/transport/view-route-track?id=${item?.id}&mylatitiude=${latitude}&mylongitude=${longitude}&myaddress=${address}`)

    }


    return (
        <>
         <View style={{backgroundColor: '#fff', padding: 10, marginBottom: 20}}>
        <TouchableWithoutFeedback 
        
        >

        <Card>
            <Card.Title title={`${item?.name} (${item?.tripway})`} 
            subtitle={`Driver ${item?.assignedto}`}
            left={() => (
            
            <Avatar.Image 
                 source={{uri: item.assignedto_pic}}
                size={30}
            />
            
            )} />
            <Card.Content>
            </Card.Content>
            
            <View style={{marginLeft: 35,flexDirection: 'row', justifyContent: "space-around", padding: 10}}>
            <Text>#Passengers{item?.capacity}</Text>
            <Text>Time: {item?.pickupstart}</Text>
            </View>
            <Text style={{marginLeft:70, color: 'red'}}> {item?.status == '0' ? 'Processing' : (item?.status == '1' ? "Route Started" : 'Route Ended')}</Text>
            {driver == 'Driver' ? (
                <Button onPress={starttrip}>Start Trip</Button>
            ) : (
                <Button onPress={trackbus}>Track Route</Button>
            )}
            
        </Card>

            
        </TouchableWithoutFeedback>

        </View>
        </>
    )
}

export default Routetracklist;