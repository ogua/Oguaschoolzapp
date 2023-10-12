import {View,StyleSheet, FlatList, Linking, Platform } from 'react-native';

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
import { logout, selectaccstatus, selectpermissions, selectroles, selectstaffrole, selectuser, selectuserpermission } from '../features/userinfoSlice';
import { showMessage } from "react-native-flash-message";
import {
BannerAd,
BannerAdSize,
TestIds,
} from "react-native-google-mobile-ads";

import * as Sharing from 'expo-sharing';


function Drawercontent(props) {
const [ispressed, setIspressed] = useState(false);
const [focus, setFocus] = useState();
const [subfocus, setsubFocus] = useState();
const [subsubfocus, setsubsubFocus] = useState();
const user = useSelector(selectuser);
const router = useRouter();
const dispatch = useDispatch();
const permission = useSelector(selectuserpermission);
const role = useSelector(selectroles);
const driver = useSelector(selectstaffrole);
const accnt = useSelector(selectaccstatus);


const fileUri = require('../assets/logo.png');

const osver = Platform.constants['Release'];

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5448171275225637/7712155558';

//console.log("osver",osver);

const handlelogout = () => {

dispatch(logout());
showMessage({
message: 'Logout Successfully!',
type: 'success',
position: 'bottom',
});

router.push("/expo-auth-session");
// return <Redirect href="/login" />;
};

//console.log("permission",permission);

const setitemfocus = (itemid) => {

if(focus === itemid){
setFocus(111111111);
}else{
setFocus(itemid);
}

}

const drawerlist = [

{
key: 2,
name: 'Academics',
icon: 'calendar-month',
route: 'Academics',
permission: 'viewacademics',
role: '',
children: [
{
key: 21,
name: 'Academic Term',
icon: 'circle-outline',
route: 'Academicterm',
permission: 'viewacademics',
role: '',
},
{
key: 22,
name: 'Academic Year',
icon: 'circle-outline',
route: 'Academicyear',
permission: 'viewacademics',
role: '',
},
// {
//   key: 23,
//   name: 'Academic Calendar',
//   icon: 'circle-outline',
//   route: 'Calendar',
//   permission: 'viewacademics',
//   role: '',
// },
{
key: 24,
name: 'Subject',
icon: 'circle-outline',
route: 'Sujects',
permission: 'viewacademics',
role: '',
},
{
key: 25,
name: 'Classes',
icon: 'circle-outline',
route: 'Classroom',
permission: 'viewacademics',
role: '',
},
{
key: 26,
name: 'Promote Student',
icon: 'circle-outline',
route: 'Promotestudent',
permission: 'viewacademics',
role: '',
},
]
},
{
key: 3,
name: 'Front Desk',
icon: 'remote-desktop',
route: 'Front Desk',
permission: 'viewfrontdesk',
role: '',
children: [
{
  key: 31,
  name: 'Enquiries',
  icon: 'circle-outline',
  route: 'Enquiry',
  permission: 'viewfrontdesk',
  role: '',
},
{
  key: 32,
  name: 'Visitors',
  icon: 'circle-outline',
  route: 'Visitors',
  permission: 'viewfrontdesk',
  role: '',
},
{
  key: 33,
  name: 'Call Logs',
  icon: 'circle-outline',
  route: 'Calllogs',
  permission: 'viewfrontdesk',
  role: '',
},
{
  key: 34,
  name: 'Postal Dispatch',
  icon: 'circle-outline',
  route: 'Postaldispatch',
  permission: 'viewfrontdesk',
  role: '',
},
{
  key: 35,
  name: 'Postal Received',
  icon: 'circle-outline',
  route: 'Postalreceived',
  permission: 'viewfrontdesk',
  role: '',
},
]
},
{
key: 4,
name: 'Add Student',
icon: 'account',
route: 'Newstudent',
permission: 'viewadmission',
role: '',
children: []
},
{
key: 5,
name: 'Students',
icon: 'account-group',
route: 'All Students',
permission: 'viewallstudents',
role: '',
children: [
{
  key: 51,
  name: 'All Students',
  icon: 'circle-outline',
  route: 'Studentlist',
  permission: 'viewallstudents',
  role: '',
},
{
  key: 54,
  name: 'All Active Students',
  icon: 'circle-outline',
  route: 'Allactivestudents',
  permission: 'viewallstudents',
  role: '',
},
{
  key: 52,
  name: 'All Stopped Students',
  icon: 'circle-outline',
  route: 'Allstoppedstudents',
  permission: 'viewallstudents',
  role: '',
},
{
  key: 53,
  name: 'All Dismissed Students',
  icon: 'circle-outline',
  route: 'Alldismissedstudents',
  permission: 'viewallstudents',
  role: '',
},
{
  key: 514,
  name: 'All Completed Students',
  icon: 'circle-outline',
  route: 'Allcompletedstudents',
  permission: 'viewallstudents',
  role: '',
},
]
},
{
key: 6,
name: 'Accounts',
icon: 'cash',
route: 'Accounts Management',
permission: 'viewaccountmanagement',
role: '',
children: [
// {
//   key: 61,
//   name: 'Online Fee Payment',
//   icon: 'circle-outline',
//   route: 'All Students',
//   permission: 'viewonlinefeepayment',
//   role: '',
//   children: []
// },
{
  key: 62,
  name: 'Fees',
  icon: 'circle-outline',
  route: 'Fee',
  permission: 'viewfees',
  role: '',
  children: []
},
{
  key: 63,
  name: 'Fee Master',
  icon: 'circle-outline',
  route: 'Feemaster',
  permission: 'viewfeemaster',
  role: '',
  children: []
},
{
  key: 64,
  name: 'Dispatch Fees',
  icon: 'circle-outline',
  route: 'Dispacchfees',
  permission: 'viewdispatchfees',
  role: '',
  children: []
},
{
  key: 610,
  name: 'Fee Payment',
  icon: 'circle-outline',
  route: 'Feepayment',
  permission: 'viewfeepayment',
  role: '',
  children: []
},
{
  key: 65,
  name: 'View Dispatcted',
  icon: 'circle-outline',
  route: 'Viewdispatched',
  permission: 'viewviewdispatchedfees',
  role: '',
  children: []
},
{
  key: 66,
  name: 'All Transactions',
  icon: 'circle-outline',
  route: 'Alltransactions',
  permission: 'viewtransactions',
  role: '',
  children: []
},
{
  key: 67,
  name: 'Transactions Per Term',
  icon: 'circle-outline',
  route: 'Transactionsperterm',
  permission: 'viewtransactions',
  role: '',
  children: []
},
{
  key: 68,
  name: 'Transactions Per Day',
  icon: 'circle-outline',
  route: 'Transactionsperday',
  permission: 'viewtransactions',
  role: '',
  children: []
},
{
  key: 69,
  name: 'Transactions Per Month',
  icon: 'circle-outline',
  route: 'Transactionspermonth',
  permission: 'viewtransactions',
  role: '',
  children: []
},
{
  key: 619,
  name: 'Transaction Report',
  icon: 'circle-outline',
  route: 'Sendtransactionbymail',
  permission: 'viewtransactions',
  role: '',
  children: []
},
{
  key: 611,
  name: 'Debtors',
  icon: 'circle-outline',
  route: 'Debtors',
  permission: 'viewdebtors',
  role: '',
  children: []
},
{
  key: 612,
  name: 'Receipts',
  icon: 'circle-outline',
  route: 'Receipttrack',
  permission: 'viewreceipts',
  role: '',
  children: []
},
{
  key: 613,
  name: 'Chart of Accounts',
  icon: 'circle-outline',
  route: 'Chartofaccount',
  permission: 'viewchartofaccounts',
  role: '',
  children: []
},
{
  key: 614,
  name: 'Bank Transaction',
  icon: 'circle-outline',
  route: 'Banktransaction',
  permission: 'viewbanktransactions',
  role: '',
  children: []
},
{
  key: 615,
  name: 'Vendors',
  icon: 'circle-outline',
  route: 'Vendors',
  permission: 'viewvendors',
  role: '',
  children: []
},
{
  key: 616,
  name: 'Income Expenses',
  icon: 'circle-outline',
  route: 'Incomeexpense',
  permission: 'viewincomeexpense',
  role: '',
  children: []
},
// {
//   key: 617,
//   name: 'Accounting',
//   icon: 'circle-outline',
//   route: 'All Students',
//   permission: '',
//role: '',
//   children: []
// },

// {
//   key: 618,
//   name: 'Vendors',
//   icon: 'circle-outline',
//   route: 'All Students',
//   permission: '',
//role: '',
//   children: []
// },
]
},
{
key: 7,
name: 'Human Resource',
icon: 'account-group',
route: 'Human Resource',
permission: 'viewhumanresource',
role: '',
children: [
{
  key: 71,
  name: 'Staff',
  icon: 'circle-outline',
  route: 'Allstaff',
  permission: 'viewstaff',
  role: '',
  children: []
},
{
  key: 72,
  name: 'Staff Attendance',
  icon: 'circle-outline',
  route: 'Staffattendance',
  permission: 'viewstaffattendance',
  role: '',
  children: []
},
{
  key: 73,
  name: 'All Attendance',
  icon: 'circle-outline',
  route: 'Allstaffattendance',
  permission: 'viewallattendance',
  role: '',
  children: []
},
{
  key: 74,
  name: 'Payroll',
  icon: 'circle-outline',
  route: 'Allpayroll',
  permission: 'viewpayroll',
  role: '',
  children: []
},
{
  key: 75,
  name: 'Staff Leave',
  icon: 'circle-outline',
  route: 'Leave',
  permission: 'viewstaffleave',
  role: '',
  children: []
},
{
  key: 76,
  name: 'Teachers Review',
  icon: 'circle-outline',
  route: 'All Students',
  permission: 'viewteachersreview',
  role: '',
  children: []
}
]
},
{
key: 8,
name: 'Hostel',
icon: 'home-city-outline',
route: 'All Students',
permission: 'viewhostel',
role: '',
children: [
{
key: 81,
name: 'Add Hostel',
icon: 'circle-outline',
route: 'Hostel',
permission: 'viewhostel',
role: '',
children: []
},
{
key: 82,
name: 'Allocate Student',
icon: 'circle-outline',
route: 'Allocatestudent',
permission: 'viewhostel',
role: '',
children: []
}
]
},
{
key: 9,
name: 'Teaching Log',
icon: 'post',
route: 'Teachinglogs',
permission: 'viewteachinglog',
role: '',
children: []
},
{
key: 10,
name: 'Report Signature',
icon: 'draw-pen',
route: 'Terninalreportsignature',
permission: 'viewterminalreportsignatures',
role: '',
children: []
},
{
key: 11,
name: 'Weekly Report',
icon: 'chart-line',
route: 'All Students',
permission: 'viewteachersweeklyreport',
role: '',
children: []
},
{
key: 1112,
name: 'Online Quiz',
icon: 'cast-education',
route: 'Listexams',
permission: 'viewonlinequiz',
role: '',
children: [
{
  key: 11121,
  name: 'Questions Bank',
  icon: 'circle-outline',
  route: 'Questionbank',
  permission: 'viewonlinequiz',
  role: '',
  children: []
},
{
  key: 11122,
  name: 'Examinations',
  icon: 'circle-outline',
  route: 'Examination',
  permission: 'viewonlinequiz',
  role: '',
  children: []
},
]
},
{
key: 13,
name: 'Library',
icon: 'library',
route: 'All Students',
permission: 'viewlibrary',
role: '',
children: [
{
  key: 131,
  name: 'Books',
  icon: 'circle-outline',
  route: 'Books',
  permission: 'viewlibrary',
  role: '',
  children: []
},{
  key: 132,
  name: 'Issue Books',
  icon: 'circle-outline',
  route: 'Issuebooks',
  permission: 'viewlibrary',
  role: '',
  children: []
},
]
},
{
key: 414,
name: 'Inventory',
icon: 'book-outline',
route: 'All Students',
permission: 'viewinventory',
role: '',
children: []
},
{
key: 12,
name: 'Transportation',
icon: 'bus-school',
route: 'All Students',
permission: 'viewtransportation',
role: '',
children: [
{
  key: 121,
  name: 'Vehicle',
  icon: 'circle-outline',
  route: 'vehicle',
  permission: 'viewtransportation',
  role: '',
  children: []
},
{
  key: 122,
  name: 'Waypoints',
  icon: 'circle-outline',
  route: 'waypoint',
  permission: 'viewtransportation',
  role: '',
  children: []
},
{
  key: 123,
  name: 'Routes',
  icon: 'circle-outline',
  route: 'Routes',
  permission: 'viewtransportation',
  role: '',
  children: []
},
// {
//   key: 124,
//   name: 'Waypoint Transfer',
//   icon: 'circle-outline',
//   route: 'All Students',
//   permission: 'viewtransportation',
//   role: '',
//   children: []
// },
]
},
{
key: 20,
name: 'E Learning',
icon: 'video-vintage',
route: 'Onlinelearning',
permission: 'viewe-learning',
role: '',
children: []
},
// {
//   key: 102,
//   name: 'Live Class',
//   icon: 'google-classroom',
//   route: 'Zoommeetings',
//   permission: 'viewonlineclass',
//   role: '',
//   children: []
// },
{
key: 21,
name: 'Home work',
icon: 'book-open-outline',
route: 'Listhomework',
permission: 'viewonlineassignment',
role: '',
children: []
},
{
key: 14,
name: 'Student Attendance',
icon: 'account-check-outline',
route: 'Studentattendance',
permission: 'viewstudentattendance',
role: '',
children: [
{
  key: 141,
  name: 'Record Attendance',
  icon: 'circle-outline',
  route: 'Studentattendance',
  permission: 'viewstudentattendance',
  role: '',
  children: []
},
{
  key: 142,
  name: 'Total Attendance',
  icon: 'circle-outline',
  route: 'Totalattendance',
  permission: 'viewstudentattendance',
  role: '',
  children: []
},
]
},
{
key: 15,
name: 'Student Results',
icon: 'chart-timeline',
route: 'All Students',
permission: 'viewstudentresults',
role: '',
children: [
{
  key: 151,
  name: 'Enter Results',
  icon: 'circle-outline',
  route: 'Enterresults',
  permission: 'viewstudentresults',
  role: '',
  children: []
},
{
  key: 152,
  name: 'Results per subject',
  icon: 'circle-outline',
  route: 'Resultspersubject',
  permission: 'viewstudentresults',
  role: '',
  children: []
},
// {
//   key: 153,
//   name: 'Results per student',
//   icon: 'circle-outline',
//   route: 'All Students',
//   permission: 'viewstudentresults',
//   role: '',
//   children: []
// },
]
},
{
key: 16,
name: 'Questionaires',
icon: 'help-circle-outline',
route: 'All Students',
permission: 'viewquestionnaires',
role: '',
children: [
{
  key: 161,
  name: 'Questionaire 1',
  icon: 'circle-outline',
  route: 'Questionnaire 1',
  permission: 'viewquestionnaires',
  role: '',
  children: []
},
{
  key: 162,
  name: 'Questionaire 2',
  icon: 'circle-outline',
  route: 'Questionnaire 2',
  permission: 'viewquestionnaires',
  role: '',
  children: []
},
]
},
{
key: 17,
name: 'Terminal Report',
icon: 'chart-line',
route: 'Normalreport',
permission: 'viewterminalreport',
role: '',
children: []
},
{
key: 18,
name: 'Communicate',
icon: 'email-box',
route: 'All Students',
permission: 'viewcommunicate',
role: '',
children: [
{
  key: 181,
  name: 'Noticeboard',
  icon: 'circle-outline',
  route: 'Noticeboard',
  permission: 'viewnoticeboard',
  role: '',
  children: []
},
{
  key: 182,
  name: 'Message Template',
  icon: 'circle-outline',
  route: 'Messagetemplate',
  permission: 'viewmessagetemplate',
  role: '',
  children: []
},
{
  key: 183,
  name: 'Send SMS',
  icon: 'circle-outline',
  route: 'Sendsms',
  permission: 'viewsendsms',
  role: '',
  children: []
},
{
  key: 184,
  name: 'Send Mail',
  icon: 'circle-outline',
  route: 'Sendmail',
  permission: 'viewsendmail',
  role: '',
  children: []
},
{
  key: 185,
  name: 'Send Notification',
  icon: 'circle-outline',
  route: 'Sendpushnotification',
  permission: 'viewsendmail',
  role: '',
  children: []
}
]
},
{
key: 19,
name: 'Settings',
icon: 'cog',
route: 'All Students',
permission: 'viewsettings',
role: '',
children: [
{
  key: 191,
  name: 'School Information',
  icon: 'circle-outline',
  route: 'Schoolinformation',
  permission: 'viewsettings',
  role: '',
  children: []
},
{
  key: 192,
  name: 'SMS Settings',
  icon: 'circle-outline',
  route: 'Smssettings',
  permission: 'viewsettings',
  role: '',
  children: []
},
{
  key: 193,
  name: 'Notification Settings',
  icon: 'circle-outline',
  route: 'Notificationsettings',
  permission: 'viewsettings',
  role: '',
  children: []
},
{
key: 194,
name: 'Mail Settings',
icon: 'circle-outline',
route: 'Mailsettings',
permission: 'viewsettings',
role: '',
children: []
}
]
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

permission !== null && permission.includes("viewaccountmanagement")


function checkpermission(){

if(permission !== null){
if(permission.includes("viewaccountmanagement")){
return (
    <DrawerItem 
          icon={({color, size}) => (
              <Icon 
              name="cash" 
              color={color}
              size={size}
              />
          )}
          label="Make Payment"
          onPress={()=> props.navigation.navigate("Makepayment")}
    /> 
);
}
}

}


function checkfeemaster(){

  if(permission !== null){

    if (accnt == "0" || accnt == "1") {
      if(permission.includes("viewfeemaster")){
        return (<>
           <DrawerItem 
              focused={focus == '10' &&  subfocus == '102' ? true: false}
              icon={({color, size}) => (
                  <Icon 
                    name="circle-outline"
                      color={color}
                      size={size}
                      />
                  )}
                label={({color, focused}) => (
                    <Text>Fee Master</Text>
                )}   
              onPress={() => {
                setsubFocus('102');
                props.navigation.navigate("Feemaster");
              }}
          />  
        </>);
      }
    }
  }
}


function checkdispatch(){

  if(permission !== null){

    if (accnt == "0" || accnt == "1") {
      if(permission.includes("viewdispatchfees")){
        return (<>
          <DrawerItem 
              focused={focus == '10' &&  subfocus == '103' ? true: false}
              icon={({color, size}) => (
                  <Icon 
                    name="circle-outline"
                      color={color}
                      size={size}
                      />
                  )}
                label={({color, focused}) => (
                    <Text>Dispatch Fees</Text>
                )}   
              onPress={() => {
                setsubFocus('103');
                props.navigation.navigate("Dispacchfees");
              }}
          />
        </>);
      }
    }
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

                  <Text style={{fontSize: 15, marginLeft: 10}}>OguaSchoolz</Text>
              </View>

              <View style={styles.userInfoSection}>
                  <View style={{flexDirection:'row',padding: 10, alignItems: 'center'}}>
                      <Avatar.Image 
                          source={{uri: props.user?.avatar}}
                          size={50}
                      />
                      <View style={{ marginLeft: 10}}>
                          <Title style={styles.title}>{props.user?.name}</Title>
                      </View>
                  </View>
              </View>

              {permission !== null && (
                <Drawer.Section style={styles.drawerSection}>

                <DrawerItem 
                focused={focus == `1` ? true: false}
                icon={({color, size}) => (
                    <Icon 
                      name="monitor-dashboard"
                        color={color}
                        size={size}
                        />
                    )}
                  label={({color, focused}) => (
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                          <Text {...focused}>Dashboard</Text>
                      </View>
                  )}   
                onPress={() => {
                  setitemfocus(`1`);
                  setsubFocus(0);
                  props.navigation.navigate("Dashboard");

                }}
                />


              <DrawerItem 
                focused={focus == `2` ? true: false}
                icon={({color, size}) => (
                    <Icon 
                      name="account-outline"
                        color={color}
                        size={size}
                        />
                    )}
                  label={({color, focused}) => (
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                          <Text {...focused}>Profile</Text>
                      </View>
                  )}   
                onPress={() => {
                  setitemfocus(`2`);
                  setsubFocus(0);
                  props.navigation.navigate("Profile");

                }}
                />

                {role[0] == "Student" && (
                <DrawerItem 
                focused={focus == `3` ? true: false}
                icon={({color, size}) => (
                    <Icon 
                      name="cash"
                        color={color}
                        size={size}
                        />
                    )}
                  label={({color, focused}) => (
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                          <Text {...focused}>My Transaction</Text>
                      </View>
                  )}   
                onPress={() => {
                  setitemfocus(`3`);
                  setsubFocus(0);
                  props.navigation.navigate("Studenttransaction");

                }}
                />
              )}

          {driver == "Driver" && (
            <DrawerItem 
                focused={focus == `4` ? true: false}
                icon={({color, size}) => (
                    <Icon 
                      name="map-marker-circle"
                        color={color}
                        size={size}
                        />
                    )}
                  label={({color, focused}) => (
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                          <Text {...focused}>Driver</Text>
                      </View>
                  )}   
                onPress={() => {
                  setitemfocus(`4`);
                  setsubFocus(0);
                  props.navigation.navigate("Trackroute");

                }}
                />
              )}


              {role[0] == "Staff" && (
                <DrawerItem 
                focused={focus == `5` ? true: false}
                icon={({color, size}) => (
                    <Icon 
                      name="cash"
                        color={color}
                        size={size}
                        />
                    )}
                  label={({color, focused}) => (
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                          <Text {...focused}>My Payroll</Text>
                      </View>
                  )}   
                onPress={() => {
                  setitemfocus(`5`);
                  setsubFocus(0);
                  props.navigation.navigate("Studenttransaction");

                }}
                />
              )}


              {/* Academics  */}
              {permission.includes("viewacademics") && (
                <>

                <DrawerItem 
                      focused={focus == '6' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="calendar-month"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text {...focused}>Academics</Text>
                                  {focus == '6' ? (
                                      <Ionicons name='arrow-down' size={25} color={color} />
                                  ): (
                                    <Ionicons name='arrow-up' size={25} color={color} />
                                  )}
                            </View>
                        )}   
                      onPress={() => {
                        setitemfocus('6');
                      }}
                  />

              {focus == '6' && (
                <>
                
                {/* Academic Term */}
                {permission.includes("viewacademics") && (
                  <>
                  <DrawerItem 
                      focused={focus == '6' &&  subfocus == '60' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="circle-outline"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <Text>Academic Term</Text>
                        )}   
                      onPress={() => {
                        setsubFocus('60');
                        props.navigation.navigate("Academicterm");
                      }}
                  />

                  </>
                )}


                {permission.includes("viewacademics") && (
                  <>
                  <DrawerItem 
                      focused={focus == '6' &&  subfocus == '61' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="circle-outline"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <Text>Academic Year</Text>
                        )}   
                      onPress={() => {
                        setsubFocus('61');
                        props.navigation.navigate("Academicyear");
                      }}
                  />

                  </>
                )}

              {permission.includes("viewsubject") && (
                  <>
                  <DrawerItem 
                      focused={focus == '6' &&  subfocus == '62' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="circle-outline"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <Text>Subject</Text>
                        )}   
                      onPress={() => {
                        setsubFocus('62');
                        props.navigation.navigate("Sujects");
                      }}
                  />

                  </>
                )}


                {permission.includes("viewclasses") && (
                  <>
                  <DrawerItem 
                      focused={focus == '6' &&  subfocus == '63' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="circle-outline"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <Text>Classes</Text>
                        )}   
                      onPress={() => {
                        setsubFocus('63');
                        props.navigation.navigate("Classroom");
                      }}
                  />

                  </>
                )}


                {permission.includes("viewpromotestudent") && (
                  <>
                  <DrawerItem 
                      focused={focus == '6' &&  subfocus == '64' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="circle-outline"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <Text>Promote Student</Text>
                        )}   
                      onPress={() => {
                        setsubFocus('64');
                        props.navigation.navigate("Promotestudent");
                      }}
                  />

                  </>
                )}

                </>
              ) }
                
                </>
              )}

              {/* End Academics  */}






              {/* Front Desk  */}
              {permission.includes("viewfrontdesk") && (
                <>

                <DrawerItem 
                      focused={focus == '7' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="remote-desktop"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text {...focused}>Front Desk</Text>
                                  {focus == '7' ? (
                                      <Ionicons name='arrow-down' size={25} color={color} />
                                  ): (
                                    <Ionicons name='arrow-up' size={25} color={color} />
                                  )}
                            </View>
                        )}   
                      onPress={() => {
                        setitemfocus('7');
                      }}
                  />

              {focus == '7' && (
                <>
                
                {/* Enquiries */}
                {permission.includes("viewenquiries") && (
                  <>
                  <DrawerItem 
                      focused={focus == '7' &&  subfocus == '70' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="circle-outline"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <Text>Enquiries</Text>
                        )}   
                      onPress={() => {
                        setsubFocus('70');
                        props.navigation.navigate("Enquiry");
                      }}
                  />

                  </>
                )}


                {permission.includes("viewvisitors") && (
                  <>
                  <DrawerItem 
                      focused={focus == '7' &&  subfocus == '71' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="circle-outline"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <Text>Visitors</Text>
                        )}   
                      onPress={() => {
                        setsubFocus('71');
                        props.navigation.navigate("Visitors");
                      }}
                  />

                  </>
                )}

              {permission.includes("viewcalllogs") && (
                  <>
                  <DrawerItem 
                      focused={focus == '7' &&  subfocus == '72' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="circle-outline"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <Text>Call Logs</Text>
                        )}   
                      onPress={() => {
                        setsubFocus('72');
                        props.navigation.navigate("Calllogs");
                      }}
                  />

                  </>
                )}


                {permission.includes("viewpostaldispatch") && (
                  <>
                  <DrawerItem 
                      focused={focus == '7' &&  subfocus == '73' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="circle-outline"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <Text>Postal Dispatch</Text>
                        )}   
                      onPress={() => {
                        setsubFocus('73');
                        props.navigation.navigate("Postaldispatch");
                      }}
                  />

                  </>
                )}


                {permission.includes("viewpostalreceived") && (
                  <>
                  <DrawerItem 
                      focused={focus == '7' &&  subfocus == '74' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="circle-outline"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <Text>Postal Received</Text>
                        )}   
                      onPress={() => {
                        setsubFocus('74');
                        props.navigation.navigate("Postalreceived");
                      }}
                  />

                  </>
                )}

                </>
              ) }
                
                </>
              )}

              {/* End Front Desk  */}


              {/* Newstudent  */}
              {permission.includes("viewadmission") && (
                <>

                <DrawerItem 
                      focused={focus == '8' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="account"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text {...focused}>Add Student</Text>
                            </View>
                        )}   
                      onPress={() => {
                        setitemfocus('8');
                        props.navigation.navigate("Newstudent");
                        
                      }}
                  />
                  </>
              )}

{/* Newstudent  */}



{/* Students  */}
{permission.includes("viewallstudents") && (
  <>
  <DrawerItem 
        focused={focus == '9' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="account-group"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>All Students</Text>
                    {focus == '9' ? (
                        <Ionicons name='arrow-down' size={25} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={25} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('9');
        }}
    />

{focus == '9' && (
  <>
  {permission.includes("viewliststudents") && (
    <>
    <DrawerItem 
        focused={focus == '9' &&  subfocus == '91' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>All Students</Text>
          )}   
        onPress={() => {
          setsubFocus('91');
          props.navigation.navigate("Studentlist");
        }}
    />
    </>
  )}

{permission.includes("viewallactivestudents") && (
    <>
    <DrawerItem 
        focused={focus == '9' &&  subfocus == '92' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>All Active Students</Text>
          )}   
        onPress={() => {
          setsubFocus('92');
          props.navigation.navigate("Allactivestudents");
        }}
    />
    </>
  )}


{permission.includes("viewstoppedstudies") && (
    <>
    <DrawerItem 
        focused={focus == '9' &&  subfocus == '93' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>All Stopped Students</Text>
          )}   
        onPress={() => {
          setsubFocus('93');
          props.navigation.navigate("Allstoppedstudents");
        }}
    />
    </>
  )}


{permission.includes("viewdismissedstudents") && (
    <>
    <DrawerItem 
        focused={focus == '9' &&  subfocus == '94' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>All Dismissed Students</Text>
          )}   
        onPress={() => {
          setsubFocus('94');
          props.navigation.navigate("Alldismissedstudents");
        }}
    />
    </>
  )}


{permission.includes("viewcompletedstudents") && (
    <>
    <DrawerItem 
        focused={focus == '9' &&  subfocus == '95' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>All Completed Students</Text>
          )}   
        onPress={() => {
          setsubFocus('95');
          props.navigation.navigate("Allcompletedstudents");
        }}
    />
    </>
  )}

  </>
) }
  </>
)}

{/* End Students  */} 


{/* Accounts  */}
{permission.includes("viewaccountmanagement") && (
  <>
  <DrawerItem 
        focused={focus == '10' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="cash"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Accounts</Text>
                    {focus == '10' ? (
                        <Ionicons name='arrow-down' size={25} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={25} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('10');
        }}
    />

{focus == '10' && (
  <>
  {permission.includes("viewfees") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '101' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Fees</Text>
          )}   
        onPress={() => {
          setsubFocus('101');
          props.navigation.navigate("Fee");
        }}
    />
    </>
  )}
 
{checkfeemaster()}
{checkdispatch()}

 {permission.includes("viewfees") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '1018' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Billing</Text>
          )}   
        onPress={() => {
          setsubFocus('1018');
          props.navigation.navigate("Billing");
        }}
    />

    <DrawerItem 
        focused={focus == '10' &&  subfocus == '1019' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>View Bill</Text>
          )}   
        onPress={() => {
          setsubFocus('1019');
          props.navigation.navigate("ViewBill");
        }}
    />


    </>
  )}


{/* Accounts 0 */}
{accnt == "0" && (
  <>
  {permission.includes("viewviewdispatchedfees") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '105' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>View Dispatcted</Text>
          )}   
        onPress={() => {
          setsubFocus('105');
          props.navigation.navigate("Viewdispatched");
        }}
    />
    </>
  )}
  
  </>
 )}


{permission.includes("viewfeepayment") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '104' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Fee Payment</Text>
          )}   
        onPress={() => {
          setsubFocus('104');
          props.navigation.navigate("Feepayment");
        }}
    />
    </>
  )}


{permission.includes("viewtransactions") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '106' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>All Transactions</Text>
          )}   
        onPress={() => {
          setsubFocus('106');
          props.navigation.navigate("Alltransactions");
        }}
    />
    </>
  )}


{permission.includes("viewtransactions") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '107' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Transactions Per Term</Text>
          )}   
        onPress={() => {
          setsubFocus('107');
          props.navigation.navigate("Transactionsperterm");
        }}
    />
    </>
  )}

{permission.includes("viewtransactions") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '108' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Transactions Per Day</Text>
          )}   
        onPress={() => {
          setsubFocus('108');
          props.navigation.navigate("Transactionsperday");
        }}
    />
    </>
  )}

{permission.includes("viewtransactions") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '109' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Transactions Per Month</Text>
          )}   
        onPress={() => {
          setsubFocus('109');
          props.navigation.navigate("Transactionspermonth");
        }}
    />
    </>
  )}



{permission.includes("viewtransactions") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '1010' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Transaction Report</Text>
          )}   
        onPress={() => {
          setsubFocus('1010');
          props.navigation.navigate("Sendtransactionbymail");
        }}
    />
    </>
  )}


{permission.includes("viewdebtors") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '1011' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Debtors</Text>
          )}   
        onPress={() => {
          setsubFocus('1011');
          props.navigation.navigate("Debtors");
        }}
    />
    </>
  )}


{permission.includes("viewreceipts") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '1012' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Receipts</Text>
          )}   
        onPress={() => {
          setsubFocus('1012');
          props.navigation.navigate("Receipttrack");
        }}
    />
    </>
  )}


{/* {permission.includes("viewchartofaccounts") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '1013' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Chart of Accounts</Text>
          )}   
        onPress={() => {
          setsubFocus('1013');
          props.navigation.navigate("Chartofaccount");
        }}
    />
    </>
  )} */}


{permission.includes("viewbanktransactions") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '1014' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Bank Transaction</Text>
          )}   
        onPress={() => {
          setsubFocus('1014');
          props.navigation.navigate("Banktransaction");
        }}
    />
    </>
  )}


{permission.includes("viewvendors") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '1015' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Vendors</Text>
          )}   
        onPress={() => {
          setsubFocus('1015');
          props.navigation.navigate("Vendors");
        }}
    />
    </>
  )}


{/* Expenses  */}
{permission.includes("viewincomeexpense") && (
  <>
  <DrawerItem 
        focused={focus == '10' && subsubfocus == '30' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="cash"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Expense</Text>
                    {subsubfocus == '30' ? (
                        <Ionicons name='arrow-down' size={30} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={30} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setsubsubFocus('30');
        }}
    />

{subsubfocus == '30' && (
  <>
  {permission.includes("viewincomeexpense") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subsubfocus == '30' && subfocus == '301' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Category</Text>
          )}   
        onPress={() => {
          setsubFocus('301');
          props.navigation.navigate("Expensecategory");
        }}
    />
    </>
  )}

{permission.includes("viewincomeexpense") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subsubfocus == '30' && subfocus == '302' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Record Expenses</Text>
          )}   
        onPress={() => {
          setsubFocus('302');
          props.navigation.navigate("Expense");
        }}
    />
    </>
  )}
  </>
) }
  </>
)}
{/* End Expenses  */}


{/* Income  */}
{permission.includes("viewincomeexpense") && (
  <>
  <DrawerItem 
        focused={focus == '10' && subsubfocus == '31' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="cash"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Income</Text>
                    {subsubfocus == '31' ? (
                        <Ionicons name='arrow-down' size={30} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={30} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setsubsubFocus('31');
        }}
    />

{subsubfocus == '31' && (
  <>
  {permission.includes("viewincomeexpense") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subsubfocus == '31' && subfocus == '301' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Category</Text>
          )}   
        onPress={() => {
          setsubFocus('301');
          props.navigation.navigate("Incomecategory");
        }}
    />
    </>
  )}

{permission.includes("viewincomeexpense") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subsubfocus == '31' && subfocus == '302' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Record Income</Text>
          )}   
        onPress={() => {
          setsubFocus('302');
          props.navigation.navigate("Income");
        }}
    />
    </>
  )}
  </>
) }
  </>
)}
{/* End Income  */}



{permission.includes("viewincomeexpense") && (
    <>
    <DrawerItem 
        focused={focus == '10' &&  subfocus == '1016' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Income Expenses</Text>
          )}   
        onPress={() => {
          setsubFocus('1016');
          props.navigation.navigate("Incomeexpense");
        }}
    />
    </>
  )}


  </>
) }
  </>
)}

{/* End Accounts  */}



{/* Human Resource  */}
{permission.includes("viewhumanresource") && (
  <>
  <DrawerItem 
        focused={focus == '11' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="account-group"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Human Resource</Text>
                    {focus == '11' ? (
                        <Ionicons name='arrow-down' size={25} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={25} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('11');
        }}
    />

{focus == '11' && (
  <>
  {permission.includes("viewstaff") && (
    <>
    <DrawerItem 
        focused={focus == '11' &&  subfocus == '111' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Staff</Text>
          )}   
        onPress={() => {
          setsubFocus('111');
          props.navigation.navigate("Allstaff");
        }}
    />
    </>
  )}

{permission.includes("viewstaffattendance") && (
    <>
    <DrawerItem 
        focused={focus == '11' &&  subfocus == '112' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Staff Attendance</Text>
          )}   
        onPress={() => {
          setsubFocus('112');
          props.navigation.navigate("Staffattendance");
        }}
    />
    </>
  )}


{permission.includes("viewallattendance") && (
    <>
    <DrawerItem 
        focused={focus == '11' &&  subfocus == '113' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>All Attendance</Text>
          )}   
        onPress={() => {
          setsubFocus('113');
          props.navigation.navigate("Allstaffattendance");
        }}
    />
    </>
  )}


{permission.includes("viewpayroll") && (
    <>
    <DrawerItem 
        focused={focus == '11' &&  subfocus == '114' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Payroll</Text>
          )}   
        onPress={() => {
          setsubFocus('114');
          props.navigation.navigate("Allpayroll");
        }}
    />
    </>
  )}


{permission.includes("viewstaffleave") && (
    <>
    <DrawerItem 
        focused={focus == '11' &&  subfocus == '115' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Staff Leave</Text>
          )}   
        onPress={() => {
          setsubFocus('115');
          props.navigation.navigate("Leave");
        }}
    />
    </>
  )}


{permission.includes("viewteachersreview") && (
    <>
    <DrawerItem 
        focused={focus == '11' &&  subfocus == '116' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Teachers Review</Text>
          )}   
        onPress={() => {
          setsubFocus('116');
          props.navigation.navigate("AllStudents");
        }}
    />
    </>
  )}
  </>
) }
  </>
)}

{/* End Human Resource  */}




{/* Communicate  */}
{permission.includes("viewcommunicate") && (
  <>
  <DrawerItem 
        focused={focus == '12' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="email-box"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Communicate</Text>
                    {focus == '12' ? (
                        <Ionicons name='arrow-down' size={25} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={25} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('12');
        }}
    />

{focus == '12' && (
  <>
  {permission.includes("viewnoticeboard") && (
    <>
    <DrawerItem 
        focused={focus == '12' &&  subfocus == '121' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Noticeboard</Text>
          )}   
        onPress={() => {
          setsubFocus('121');
          props.navigation.navigate("Noticeboard");
        }}
    />
    </>
  )}

{permission.includes("viewmessagetemplate") && (
    <>
    <DrawerItem 
        focused={focus == '12' &&  subfocus == '122' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Message Template</Text>
          )}   
        onPress={() => {
          setsubFocus('122');
          props.navigation.navigate("Messagetemplate");
        }}
    />
    </>
  )}


{permission.includes("viewsendsms") && (
    <>
    <DrawerItem 
        focused={focus == '12' &&  subfocus == '123' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Send SMS</Text>
          )}   
        onPress={() => {
          setsubFocus('123');
          props.navigation.navigate("Sendsms");
        }}
    />
    </>
  )}


{permission.includes("viewsendmail") && (
    <>
    <DrawerItem 
        focused={focus == '12' &&  subfocus == '124' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Send Mail</Text>
          )}   
        onPress={() => {
          setsubFocus('124');
          props.navigation.navigate("Sendmail");
        }}
    />
    </>
  )}


{permission.includes("viewsendmail") && (
    <>
    <DrawerItem 
        focused={focus == '12' &&  subfocus == '125' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Send Notification</Text>
          )}   
        onPress={() => {
          setsubFocus('125');
          props.navigation.navigate("Sendpushnotification");
        }}
    />
    </>
  )}

  </>
) }
  </>
)}

{/* End Communicate  */}



{/* Hostel  */}
{permission.includes("viewhostel") && (
  <>
  <DrawerItem 
        focused={focus == '13' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="home-city-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Hostel</Text>
                    {focus == '13' ? (
                        <Ionicons name='arrow-down' size={25} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={25} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('13');
        }}
    />

{focus == '13' && (
  <>
  {permission.includes("viewaddhostel") && (
    <>
    <DrawerItem 
        focused={focus == '13' &&  subfocus == '131' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Add Hostel</Text>
          )}   
        onPress={() => {
          setsubFocus('131');
          props.navigation.navigate("Hostel");
        }}
    />
    </>
  )}

{permission.includes("viewallocatestudent") && (
    <>
    <DrawerItem 
        focused={focus == '13' &&  subfocus == '132' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Allocate Student</Text>
          )}   
        onPress={() => {
          setsubFocus('132');
          props.navigation.navigate("Allocatestudent");
        }}
    />
    </>
  )}


  </>
) }
  </>
)}

{/* End Hostel  */}


{/* teachinglog  */}
{permission.includes("viewteachinglog") && (
                <>

                <DrawerItem 
                      focused={focus == '14' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="post"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text {...focused}>Teaching Log</Text>
                            </View>
                        )}   
                      onPress={() => {
                        setitemfocus('14');
                        props.navigation.navigate("Teachinglogs");
                        
                      }}
                  />
                  </>
              )}

              {/* teachinglog  */}


{/* Weekly Report  */}
{permission.includes("viewterminalreportsignatures") && (
                <>

                <DrawerItem 
                      focused={focus == '15' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="draw-pen"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text {...focused}>Report Signature</Text>
                            </View>
                        )}   
                      onPress={() => {
                        setitemfocus('15');
                        props.navigation.navigate("Terninalreportsignature");
                        
                      }}
                  />
                  </>
              )}

              {/* Report Signature  */}



{/* Signature  */}
{permission.includes("viewteachersweeklyreport") && (
                <>

                <DrawerItem 
                      focused={focus == '16' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="chart-line"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text {...focused}>Weekly Report</Text>
                            </View>
                        )}   
                      onPress={() => {
                        setitemfocus('16');
                        props.navigation.navigate("Weekly Report");
                        
                      }}
                  />
                  </>
              )}

              {/* Signature  */}



{/* Online Quiz  */}
{permission.includes("viewonlinequiz") && (
  <>
  {role[0] == "Student" ? (
  <>

<DrawerItem 
          focused={focus == `111112` ? true: false}
          icon={({color, size}) => (
              <Icon 
                name="cash"
                  color={color}
                  size={size}
                  />
              )}
            label={({color, focused}) => (
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text {...focused}>Online Quiz</Text>
                </View>
            )}   
          onPress={() => {
            setitemfocus(`111112`);
            setsubFocus(0);
            props.navigation.navigate("Examination");

          }}
        />
  
  </>) : (
    <>
  <DrawerItem 
        focused={focus == '17' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="cast-education"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Online Quiz</Text>
                    {focus == '17' ? (
                        <Ionicons name='arrow-down' size={25} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={25} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('17');
        }}
    />

{focus == '17' && (
  <>
  {permission.includes("viewonlinequiz") && (
    <>
    <DrawerItem 
        focused={focus == '17' &&  subfocus == '171' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Questions Bank</Text>
          )}   
        onPress={() => {
          setsubFocus('171');
          props.navigation.navigate("Questionbank");
        }}
    />
    </>
  )}

{permission.includes("viewonlinequiz") && (
    <>
    <DrawerItem 
        focused={focus == '17' &&  subfocus == '172' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Examinations</Text>
          )}   
        onPress={() => {
          setsubFocus('172');
          props.navigation.navigate("Examination");
        }}
    />
    </>
  )}

  </>
) }

</>)}
  </>
)}

{/* End Online Quiz  */}


{/* Library  */}
{permission.includes("viewlibrary") && (
  <>
  <DrawerItem 
        focused={focus == '18' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="library"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Library</Text>
                    {focus == '18' ? (
                        <Ionicons name='arrow-down' size={25} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={25} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('18');
        }}
    />

{focus == '18' && (
  <>
  {permission.includes("viewlibrary") && (
    <>
    <DrawerItem 
        focused={focus == '18' &&  subfocus == '181' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Books</Text>
          )}   
        onPress={() => {
          setsubFocus('181');
          props.navigation.navigate("Books");
        }}
    />
    </>
  )}

{permission.includes("viewlibrary") && (
    <>
    <DrawerItem 
        focused={focus == '18' &&  subfocus == '182' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Issue Books</Text>
          )}   
        onPress={() => {
          setsubFocus('182');
          props.navigation.navigate("Issuebooks");
        }}
    />
    </>
  )}

  </>
) }
  </>
)}

{/* End Library  */}



{/* Inventory  */}
{permission.includes("viewinventory") && (
                <>
                <DrawerItem 
                      focused={focus == '19' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="post"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text {...focused}>Inventory</Text>
                            </View>
                        )}   
                      onPress={() => {
                        setitemfocus('19');
                        props.navigation.navigate("Inventory");
                        
                      }}
                  />
                  </>
              )}

              {/* Inventory  */}



{/* Transportation  */}
{permission.includes("viewtransportation") && (
  <>
  <DrawerItem 
        focused={focus == '20' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="bus-school"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Transportation</Text>
                    {focus == '20' ? (
                        <Ionicons name='arrow-down' size={25} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={25} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('20');
        }}
    />

{focus == '20' && (
  <>
  {permission.includes("viewtransportation") && (
    <>
    <DrawerItem 
        focused={focus == '20' &&  subfocus == '201' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Vehicle</Text>
          )}   
        onPress={() => {
          setsubFocus('201');
          props.navigation.navigate("Vehicle");
        }}
    />
    </>
  )}

{permission.includes("viewtransportation") && (
    <>
    <DrawerItem 
        focused={focus == '20' &&  subfocus == '202' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Waypoints</Text>
          )}   
        onPress={() => {
          setsubFocus('202');
          props.navigation.navigate("waypoint");
        }}
    />
    </>
  )}


{permission.includes("viewtransportation") && (
    <>
    <DrawerItem 
        focused={focus == '20' &&  subfocus == '203' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Routes</Text>
          )}   
        onPress={() => {
          setsubFocus('203');
          props.navigation.navigate("Routes");
        }}
    />
    </>
  )}

  </>
) }
  </>
)}

{/* End Transportation  */}




{/* E Learning  */}
{permission.includes("viewe-learning") && (
                <>
                <DrawerItem 
                      focused={focus == '21' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="video-vintage"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text {...focused}>E Learning</Text>
                            </View>
                        )}   
                      onPress={() => {
                        setitemfocus('21');
                        props.navigation.navigate("Onlinelearning");
                        
                      }}
                  />
                  </>
              )}

              {/* E Learning  */}



{/* 'Home work  */}
{permission.includes("viewonlineassignment") && (
                <>
                <DrawerItem 
                      focused={focus == '22' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="video-vintage"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text {...focused}>Home work</Text>
                            </View>
                        )}   
                      onPress={() => {
                        setitemfocus('22');
                        props.navigation.navigate("Listhomework");
                        
                      }}
                  />
                  </>
              )}

              {/* E Home work  */}



        {/* Student Attendance  */}
{permission.includes("viewstudentattendance") && (
  <>
{role[0] == 'Student' ? (
  <>
  <DrawerItem 
		focused={focus == `028` ? true: false}
		icon={({color, size}) => (
			<Icon 
			  name="account-check-outline"
				color={color}
				size={size}
				/>
			)}
		  label={({color, focused}) => (
			  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
				  <Text {...focused}>Attendance</Text>
			  </View>
		  )}   
		onPress={() => {
		  setitemfocus(`028`);
		  setsubFocus(0);
		  props.navigation.navigate("Myattendance");

		}}
	  />
  
  </>
) : (
  <>
  
  <DrawerItem 
        focused={focus == '23' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="account-check-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Student Attendance</Text>
                    {focus == '23' ? (
                        <Ionicons name='arrow-down' size={25} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={25} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('23');
        }}
    />

{focus == '23' && (
  <>
  {permission.includes("viewstudentattendance") && (
    <>
    <DrawerItem 
        focused={focus == '23' &&  subfocus == '231' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Record Attendance</Text>
          )}   
        onPress={() => {
          setsubFocus('231');
          props.navigation.navigate("Studentattendance");
        }}
    />
    </>
  )}

{permission.includes("viewstudentattendance") && (
    <>
    <DrawerItem 
        focused={focus == '23' &&  subfocus == '232' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Total Attendance</Text>
          )}   
        onPress={() => {
          setsubFocus('232');
          props.navigation.navigate("Totalattendance");
        }}
    />
    </>
  )}
  </>
)}

</>
)}
  </>
)}

{/* End Student Attendance  */}              


{/* Student Results  */}
{permission.includes("viewstudentresults") && (
  <>
  <DrawerItem 
        focused={focus == '24' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="chart-timeline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Student Results</Text>
                    {focus == '24' ? (
                        <Ionicons name='arrow-down' size={25} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={25} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('24');
        }}
    />

{focus == '24' && (
  <>
  {permission.includes("viewenterresults") && (
    <>
    <DrawerItem 
        focused={focus == '24' &&  subfocus == '241' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Enter Results</Text>
          )}   
        onPress={() => {
          setsubFocus('241');
          props.navigation.navigate("Enterresults");
        }}
    />
    </>
  )}

{permission.includes("viewresultsperstudent") && (
    <>
    <DrawerItem 
        focused={focus == '24' &&  subfocus == '242' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Results per subject</Text>
          )}   
        onPress={() => {
          setsubFocus('242');
          props.navigation.navigate("Resultspersubject");
        }}
    />
    </>
  )}
  </>
) }
  </>
)}

{/* End Student Results  */}



{/* Questionaires  */}
{permission.includes("viewquestionnaires") && (
  <>
  <DrawerItem 
        focused={focus == '25' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="help-circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Questionaires</Text>
                    {focus == '25' ? (
                        <Ionicons name='arrow-down' size={25} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={25} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('25');
        }}
    />

{focus == '25' && (
  <>
  {permission.includes("viewquestionnaires") && (
    <>
    <DrawerItem 
        focused={focus == '25' &&  subfocus == '251' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Questionaire 1</Text>
          )}   
        onPress={() => {
          setsubFocus('251');
          props.navigation.navigate("Questionnaire 1");
        }}
    />
    </>
  )}

{permission.includes("viewresultsperstudent") && (
    <>
    <DrawerItem 
        focused={focus == '25' &&  subfocus == '252' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Questionaire 2</Text>
          )}   
        onPress={() => {
          setsubFocus('252');
          props.navigation.navigate("Questionaire 2");
        }}
    />
    </>
  )}
  </>
) }
  </>
)}

{/* End Questionaires  */}


 {/* Newstudent  */}
 {permission.includes("viewadmission") && (
                <>

                <DrawerItem 
                      focused={focus == '26' ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="chart-line"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text {...focused}>Terminal Report</Text>
                            </View>
                        )}   
                      onPress={() => {
                        setitemfocus('26');
                        props.navigation.navigate("Normalreport");
                        
                      }}
                  />
                  </>
              )}

{/* Newstudent  */}

<DrawerItem 
                      focused={focus == `003330` ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="map-marker-circle"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text {...focused}>Track School Bus</Text>
                            </View>
                        )}   
                      onPress={() => {
                        setitemfocus(`003330`);
                        setsubFocus(0);
                        props.navigation.navigate("Trackroute");

                      }}
                     />


                   {role[0] == "Student" && (
                      <DrawerItem 
                      focused={focus == `002220` ? true: false}
                      icon={({color, size}) => (
                          <Icon 
                            name="cash"
                              color={color}
                              size={size}
                              />
                          )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text {...focused}>My Results</Text>
                            </View>
                        )}   
                      onPress={() => {
                        setitemfocus(`002220`);
                        setsubFocus(0);
                        props.navigation.navigate("Myresults");

                      }}
                     />
                    )}


{/* Settings  */}
{permission.includes("viewsettings") && (
  <>
  <DrawerItem 
        focused={focus == '27' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="cog"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Settings</Text>
                    {focus == '27' ? (
                        <Ionicons name='arrow-down' size={27} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={27} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('27');
        }}
    />

{focus == '27' && (
  <>
  {permission.includes("viewsettings") && (
    <>
    <DrawerItem 
        focused={focus == '27' &&  subfocus == '271' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>School Information</Text>
          )}   
        onPress={() => {
          setsubFocus('271');
          props.navigation.navigate("Schoolinformation");
        }}
    />
    </>
  )}

{permission.includes("viewsettings") && (
    <>
    <DrawerItem 
        focused={focus == '27' &&  subfocus == '272' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>SMS Settings</Text>
          )}   
        onPress={() => {
          setsubFocus('272');
          props.navigation.navigate("Smssettings");
        }}
    />
    </>
  )}


{permission.includes("viewsettings") && (
    <>
    <DrawerItem 
        focused={focus == '27' &&  subfocus == '273' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Notification Settings</Text>
          )}   
        onPress={() => {
          setsubFocus('273');
          props.navigation.navigate("Notificationsettings");
        }}
    />
    </>
  )}


{permission.includes("viewsettings") && (
    <>
    <DrawerItem 
        focused={focus == '27' &&  subfocus == '274' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Mail Settings</Text>
          )}   
        onPress={() => {
          setsubFocus('274');
          props.navigation.navigate("Mailsettings");
        }}
    />
    </>
  )}

<DrawerItem 
        focused={focus == '27' &&  subfocus == '275' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="help"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>help</Text>
          )}   
        onPress={() => {
          setsubFocus('275');
          props.navigation.navigate("Help");
        }}
    />
  </>
) }
  </>
)}

{/* End Settings  */}

                </Drawer.Section>
              )}

              
          </View>
          
      </DrawerContentScrollView>
    
      <Drawer.Section style={styles.bottomDrawerSection}>
      
          
          
          {checkpermission()}

          {/* <DrawerItem 
              icon={({color, size}) => (
                  <Icon 
                  name="share" 
                  color={color}
                  size={size}
                  />
              )}
              label="Share"
              onPress={() => {

                Sharing.isAvailableAsync().then((available) => {
                  if (available) {

                    Sharing.shareAsync("https://oguaschoolz.com/images/logo.png")
                      .then((data) => {
                        alert('Shared');
                      })
                      .catch((err) => {
                        alert('Error sharing image');
                        console.log(JSON.stringify(err));
                      });


                    //alert('Sharing is available');
                  } else {
                    alert('Sharing is NOT available');
                  }
                });

              }}
          /> */}
          
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


      {/* <View style={{marginLeft: 15, marginBottom: 10}}>

        <BannerAd
            unitId={adUnitId}
            size={'250x50'}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />

      </View> */}

      

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
