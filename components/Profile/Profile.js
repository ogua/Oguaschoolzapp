import { ActivityIndicator, Alert, FlatList, SafeAreaView,
    StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Image, DeviceEventEmitter, useColorScheme, StatusBar } from 'react-native'
import { useSelector } from 'react-redux';
import { selectroles, selectuser } from '../../features/userinfoSlice';
import Studentprofile from './Studentprofile';


function Profile() {
    const role = useSelector(selectroles);
    const user = useSelector(selectuser);

    if(role[0] == 'Administrator'){
        return (
            <Text>Administrators</Text>
        );
    }else if(role[0] == 'Student'){
        return <Studentprofile userid={user.id} />;
    }else{
        return (
            <Text>Staff</Text>
        );
    }
    
}

export default Profile;