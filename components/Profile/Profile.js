import { ActivityIndicator, Alert, FlatList, SafeAreaView,
    StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Image, DeviceEventEmitter, useColorScheme, StatusBar } from 'react-native'
import { useSelector } from 'react-redux';
import { selectroles, selectuser } from '../../features/userinfoSlice';
import Studentprofile from './Studentprofile';
import { Redirect,useNavigation } from 'expo-router';
import Dashboard from '../../app/admin/dashboard';
import Staffprofile from './Staffprofile';


function Profile() {
    const role = useSelector(selectroles);
    const user = useSelector(selectuser);
    const navigation = useNavigation();

    if(role[0] == 'Administrator'){
        return <Dashboard />;
       return navigation.navigate("Dashboard");
    }else if(role[0] == 'Student'){
        return <Studentprofile userid={user.id} />;
    }else{
        return <Staffprofile userid={user.id} />;
    }
    
}

export default Profile;