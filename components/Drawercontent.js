import {View,StyleSheet, FlatList } from 'react-native';

import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';

import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { images } from './constants';
import { Redirect, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectuser } from '../features/userinfoSlice';
import { showMessage } from "react-native-flash-message";


 function Drawercontent(props) {
 const [ispressed, setIspressed] = useState(false);
 const [focus, setFocus] = useState();
 const [subfocus, setsubFocus] = useState();
 const user = useSelector(selectuser);
 const router = useRouter();
 const dispatch = useDispatch();

 const handlelogout = () => {
  
  console.log('working');

  dispatch(logout());
    showMessage({
      message: 'Logout Successfully!',
      type: 'danger',
      position: 'bottom',
  });

  router.push("/login");
 // return <Redirect href="/login" />;
 };


const setitemfocus = (itemid) => {

  if(focus === itemid){
    setFocus(111111111);
  }else{
    setFocus(itemid);
  }

}

 const drawerlist = [
  {
    key: 1,
    name: 'Dashboard',
    icon: 'monitor-dashboard',
    route: 'Dashboard',
    permission: '',
    children: []
  },
  {
    key: 22,
    name: 'Profile',
    icon: 'account-outline',
    route: 'Profile',
    permission: '',
    children: []
  },
  {
    key: 2,
    name: 'Academics',
    icon: 'calendar-month',
    route: 'Academics',
    permission: '',
    children: [
    {
      key: 21,
      name: 'Academic Term',
      icon: 'circle-outline',
      route: 'Academicterm',
      permission: '',
    },
    {
      key: 22,
      name: 'Academic Year',
      icon: 'circle-outline',
      route: 'Academicyear',
      permission: '',
    },
    {
      key: 23,
      name: 'Academic Calendar',
      icon: 'circle-outline',
      route: 'Calendar',
      permission: '',
    },
    {
      key: 24,
      name: 'Subject',
      icon: 'circle-outline',
      route: 'Sujects',
      permission: '',
    },
    {
      key: 25,
      name: 'Classes',
      icon: 'circle-outline',
      route: 'Classroom',
      permission: '',
    },
    {
      key: 26,
      name: 'Promote Student',
      icon: 'circle-outline',
      route: 'Promotestudent',
      permission: '',
    },
  ]
  },
  {
    key: 3,
    name: 'Front Desk',
    icon: 'remote-desktop',
    route: 'Front Desk',
    permission: '',
    children: [
      {
        key: 31,
        name: 'Enquiries',
        icon: 'circle-outline',
        route: 'Enquiry',
        permission: '',
      },
      {
        key: 32,
        name: 'Visitors',
        icon: 'circle-outline',
        route: 'Visitors',
        permission: '',
      },
      {
        key: 33,
        name: 'Call Logs',
        icon: 'circle-outline',
        route: 'Calllogs',
        permission: '',
      },
      {
        key: 34,
        name: 'Postal Dispatch',
        icon: 'circle-outline',
        route: 'Postaldispatch',
        permission: '',
      },
      {
        key: 35,
        name: 'Postal Received',
        icon: 'circle-outline',
        route: 'Postalreceived',
        permission: '',
      },
    ]
  },
  {
    key: 4,
    name: 'Add Student',
    icon: 'account',
    route: 'Newstudent',
    permission: '',
    children: []
  },
  {
    key: 5,
    name: 'All Students',
    icon: 'account-group',
    route: 'All Students',
    permission: '',
    children: [
      {
        key: 51,
        name: 'All Students',
        icon: 'circle-outline',
        route: 'Studentlist',
        permission: '',
      },
      {
        key: 52,
        name: 'All Stopped Students',
        icon: 'circle-outline',
        route: 'Promotestudent',
        permission: '',
      },
      {
        key: 53,
        name: 'All Dismissed Students',
        icon: 'circle-outline',
        route: 'Promotestudent',
        permission: '',
      },
      {
        key: 54,
        name: 'All Completed Students',
        icon: 'circle-outline',
        route: 'Promotestudent',
        permission: '',
      },
    ]
  },
  {
    key: 6,
    name: 'Accounts',
    icon: 'account-group',
    route: 'Accounts Management',
    permission: '',
    children: [
      {
        key: 61,
        name: 'Online Fee Payment',
        icon: 'circle-outline',
        route: 'All Students',
        permission: '',
        children: []
      },
      {
        key: 62,
        name: 'Fees',
        icon: 'circle-outline',
        route: 'Fee',
        permission: '',
        children: []
      },
      {
        key: 63,
        name: 'Fee Master',
        icon: 'circle-outline',
        route: 'Feemaster',
        permission: '',
        children: []
      },
      {
        key: 64,
        name: 'Dispatch Fees',
        icon: 'circle-outline',
        route: 'Dispacchfees',
        permission: '',
        children: []
      },
      {
        key: 65,
        name: 'View Dispatcted',
        icon: 'circle-outline',
        route: 'Viewdispatched',
        permission: '',
        children: []
      },
      {
        key: 66,
        name: 'All Transactions',
        icon: 'circle-outline',
        route: 'Alltransactions',
        permission: '',
        children: []
      },
      {
        key: 67,
        name: 'Transactions Per Term',
        icon: 'circle-outline',
        route: 'Transactionsperterm',
        permission: '',
        children: []
      },
      {
        key: 68,
        name: 'Transactions Per Day',
        icon: 'circle-outline',
        route: 'Transactionsperday',
        permission: '',
        children: []
      },
      {
        key: 69,
        name: 'Transactions Per Month',
        icon: 'circle-outline',
        route: 'Transactionspermonth',
        permission: '',
        children: []
      },
      {
        key: 610,
        name: 'Fee Payment',
        icon: 'circle-outline',
        route: 'Feepayment',
        permission: '',
        children: []
      },
      {
        key: 611,
        name: 'Debtors',
        icon: 'circle-outline',
        route: 'Debtors',
        permission: '',
        children: []
      },
      {
        key: 612,
        name: 'Receipts',
        icon: 'circle-outline',
        route: 'Receipttrack',
        permission: '',
        children: []
      },
      {
        key: 613,
        name: 'Chart of Accounts',
        icon: 'circle-outline',
        route: 'Chartofaccount',
        permission: '',
        children: []
      },
      {
        key: 614,
        name: 'Bank Transaction',
        icon: 'circle-outline',
        route: 'Banktransaction',
        permission: '',
        children: []
      },
      {
        key: 615,
        name: 'Vendors',
        icon: 'circle-outline',
        route: 'Vendors',
        permission: '',
        children: []
      },
      {
        key: 616,
        name: 'Income Expenses',
        icon: 'circle-outline',
        route: 'Incomeexpense',
        permission: '',
        children: []
      },
      // {
      //   key: 617,
      //   name: 'Accounting',
      //   icon: 'circle-outline',
      //   route: 'All Students',
      //   permission: '',
      //   children: []
      // },
      
      // {
      //   key: 618,
      //   name: 'Vendors',
      //   icon: 'circle-outline',
      //   route: 'All Students',
      //   permission: '',
      //   children: []
      // },
    ]
  },
  {
    key: 7,
    name: 'Human Resource',
    icon: 'account-group',
    route: 'Human Resource',
    permission: '',
    children: [
      {
        key: 71,
        name: 'Staff',
        icon: 'circle-outline',
        route: 'All Students',
        permission: '',
        children: []
      },
      {
        key: 72,
        name: 'Staff Attendance',
        icon: 'circle-outline',
        route: 'Staffattendance',
        permission: '',
        children: []
      },
      {
        key: 73,
        name: 'All Attendance',
        icon: 'circle-outline',
        route: 'Allstaffattendance',
        permission: '',
        children: []
      },
      {
        key: 74,
        name: 'Payroll',
        icon: 'circle-outline',
        route: 'Allpayroll',
        permission: '',
        children: []
      },
      {
        key: 75,
        name: 'Staff Leave',
        icon: 'circle-outline',
        route: 'Leave',
        permission: '',
        children: []
      },
      {
        key: 76,
        name: 'Teachers Review',
        icon: 'circle-outline',
        route: 'All Students',
        permission: '',
        children: []
      }
    ]
  },
  {
    key: 8,
    name: 'Hostel',
    icon: 'home-city-outline',
    route: 'All Students',
    permission: '',
    children: [
    {
      key: 81,
      name: 'Add Hostel',
      icon: 'circle-outline',
      route: 'Hostel',
      permission: '',
      children: []
    },
    {
      key: 82,
      name: 'Allocate Student',
      icon: 'circle-outline',
      route: 'Allocatestudent',
      permission: '',
      children: []
    }
  ]
  },
  {
    key: 9,
    name: 'Teaching Log',
    icon: 'post',
    route: 'Teachinglogs',
    permission: '',
    children: []
  },
  {
    key: 10,
    name: 'Report Signature',
    icon: 'draw-pen',
    route: 'Terninalreportsignature',
    permission: '',
    children: []
  },
  {
    key: 11,
    name: 'Weekly Report',
    icon: 'chart-line',
    route: 'All Students',
    permission: '',
    children: []
  },
  {
    key: 1112,
    name: 'Online Quiz',
    icon: 'cast-education',
    route: 'Listexams',
    permission: '',
    children: []
  },
  {
    key: 13,
    name: 'Library',
    icon: 'library',
    route: 'All Students',
    permission: '',
    children: [
      {
        key: 131,
        name: 'Books',
        icon: 'circle-outline',
        route: 'Books',
        permission: '',
        children: []
      },{
        key: 132,
        name: 'Issue Books',
        icon: 'circle-outline',
        route: 'Issuebooks',
        permission: '',
        children: []
      },
    ]
  },
  {
    key: 14,
    name: 'Inventory',
    icon: 'book-outline',
    route: 'All Students',
    permission: '',
    children: []
  },
  {
    key: 12,
    name: 'Transportation',
    icon: 'bus-school',
    route: 'All Students',
    permission: '',
    children: [
      {
        key: 121,
        name: 'Vehicle',
        icon: 'circle-outline',
        route: 'vehicle',
        permission: '',
        children: []
      },
      {
        key: 122,
        name: 'Waypoints',
        icon: 'circle-outline',
        route: 'waypoint',
        permission: '',
        children: []
      },
      {
        key: 123,
        name: 'Routes',
        icon: 'circle-outline',
        route: 'Routes',
        permission: '',
        children: []
      },
      {
        key: 124,
        name: 'Waypoint Transfer',
        icon: 'circle-outline',
        route: 'All Students',
        permission: '',
        children: []
      },
    ]
  },
  {
    key: 20,
    name: 'E Learning',
    icon: 'video-vintage',
    route: 'Onlinelearning',
    permission: '',
    children: []
  },
  {
    key: 12,
    name: 'Live Class',
    icon: 'google-classroom',
    route: 'Zoommeetings',
    permission: '',
    children: []
  },
  {
    key: 21,
    name: 'Home work',
    icon: 'book-open-outline',
    route: 'Listhomework',
    permission: '',
    children: []
  },
  {
    key: 14,
    name: 'Student Attendance',
    icon: 'account-check-outline',
    route: 'Studentattendance',
    permission: '',
    children: [
      {
        key: 141,
        name: 'Record Attendance',
        icon: 'circle-outline',
        route: 'Studentattendance',
        permission: '',
        children: []
      },
      {
        key: 142,
        name: 'Total Attendance',
        icon: 'circle-outline',
        route: 'Totalattendance',
        permission: '',
        children: []
      },
    ]
  },
  {
    key: 15,
    name: 'Student Results',
    icon: 'chart-timeline',
    route: 'All Students',
    permission: '',
    children: []
  },
  {
    key: 16,
    name: 'Questionaires',
    icon: 'help-circle-outline',
    route: 'All Students',
    permission: '',
    children: []
  },
  {
    key: 17,
    name: 'Terminal Report',
    icon: 'chart-line',
    route: 'All Students',
    permission: '',
    children: []
  },
  {
    key: 18,
    name: 'Communicate',
    icon: 'email-box',
    route: 'All Students',
    permission: '',
    children: []
  },
  {
    key: 19,
    name: 'Settings',
    icon: 'cog',
    route: 'All Students',
    permission: '',
    children: []
  },






 ];

const setfocustate  = (key) => {
  //console.log("Focus",focus);
  if(focus > 0){
    setFocus(0);
  }else{
    setFocus(key);
  }
}

    const paperTheme = useTheme();
        return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={{backgroundColor: '#fff',
                    flexDirection: 'row', alignItems: 'center',padding: 10}}>
                       <Avatar.Image 
                            source={images.softwarelogo}
                            size={30}
                        />

                        <Text style={{fontSize: 15, marginLeft: 10}}>OSMS</Text>
                    </View>

                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',padding: 10, alignItems: 'center'}}>
                            <Avatar.Image 
                                source={{uri: props.user.avatar}}
                                size={50}
                            />
                            <View style={{ marginLeft: 10}}>
                                <Title style={styles.title}>{props.user.name}</Title>
                            </View>
                        </View>
                    </View>
                   
                    <Drawer.Section style={styles.drawerSection}>

                    {drawerlist.map(item => (
                        <>
                          <DrawerItem 
                            focused={focus == item.key ? true: false}
                            icon={({color, size}) => (
                                <Icon 
                                  name={item.icon}
                                    color={color}
                                    size={size}
                                    />
                                )}
                              label={({color, focused}) => (
                                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                      <Text {...focused}>{item.name}</Text>
                                      {item.children.length > 0 && (
                                        <>
                                        {focus == item.key ? (
                                            <Ionicons name='arrow-down' size={25} color={color} />
                                        ): (
                                          <Ionicons name='arrow-up' size={25} color={color} />
                                        )}
                                        </>
                                      )}
                                  </View>
                              )}   
                            onPress={() => {
                             // setFocus(item.key);
                              setitemfocus(item.key);
                              //setfocustate(item.key);
                              if(item.children.length > 0){

                              }else{
                                setsubFocus(0);
                                props.navigation.navigate(item.route);
                              }

                            }}
                        />

                        {focus == item.key && (
                          <>
                          {item.children.map(children => (

                            <DrawerItem 
                            focused={focus == item.key &&  subfocus == children.key ? true: false}
                            icon={({color, size}) => (
                                <Icon 
                                  name={children.icon}
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label={({color, focused}) => (
                                  <Text>{children.name}</Text>
                              )}  
                            onPress={() => {
                                setsubFocus(children.key);
                                props.navigation.navigate(children.route);
                            }}
                            />

                          ))}

                        </>
                       )}

                        </>

                        
                    ))}
                

                
                        
                       
                        
                </Drawer.Section>

                    
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {handlelogout()}}
                />
            </Drawer.Section>
        </View>
    );
}

export default Drawercontent;

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
      marginTop: -4
    },
    userInfoSection: {
      backgroundColor: '#fff',
      borderBottomColor: '#000',
      borderTopWidth: 1,
      borderBottomWidth: 1
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color:'#000',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 10,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#000',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
