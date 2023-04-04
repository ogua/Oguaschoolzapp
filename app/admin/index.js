import { Redirect, Stack, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectuser,selecttoken,selectroles,selectuserpermission,selectpermissions,selectmenu } from '../../features/userinfoSlice';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from './dashboard';
import Drawercontent from '../../components/Drawercontent';
import Academicterm from '../../components/Academics/AcademicTerm';
import { getData, getDataobject, removeusertoken } from '../../features/usertokenSlice';
import Academicyear from '../../components/Academics/Academicyear';
import TextBottomsheet from '../../components/TextBottomsheet';
import Eventcalendar from '../../components/Academics/Eventcalendar';
import Subjects from '../../components/Academics/Subjects';
import Classrooms from '../../components/Academics/Classrooms';
import Promotestudent from '../../components/Academics/Promotestudent';
import Enquiries from '../../components/Frontdesk/Enquiries';

const Drawer = createDrawerNavigator();

function Mainmenu() {
  const user = useSelector(selectuser);
  const userinfo = getData();
  const router = useRouter();

  if(user ===null){
    return <Redirect href="/login" />
  }

    return (
    <Drawer.Navigator
    drawerContent={props => <Drawercontent user={user} {...props}/>}>
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Academicterm" component={Academicterm} />
      <Drawer.Screen name="Academicyear" component={Academicyear} />
      <Drawer.Screen name="Calendar" component={Eventcalendar} />
      <Drawer.Screen name="Sujects" component={Subjects} />
      <Drawer.Screen name="Classroom" component={Classrooms} />
      <Drawer.Screen name="Promotestudent" component={Promotestudent} />
      <Drawer.Screen name="Enquiry" component={Enquiries} />
      <Drawer.Screen name="TextBottomsheet" component={TextBottomsheet} />
    </Drawer.Navigator>
    )
}

export default Mainmenu;

const styles = StyleSheet.create({
    
});
