import { Redirect, Stack, useFocusEffect, useRouter } from 'expo-router';
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
import Visitors from '../../components/Frontdesk/Visitors';
import Calllogs from '../../components/Frontdesk/Calllogs';
import Postaldispatch from '../../components/Frontdesk/Postaldispatch';
import Postalreceived from '../../components/Frontdesk/Postalreceived';
import Allstudents from '../../components/Studentinfo/Allstudents';
import Addstudent from '../../components/Studentinfo/Addstudent';
import Vehicle from '../../components/Transport/Vehicle';
import Waypoint from '../../components/Transport/Waypoints';
import Routes from '../../components/Transport/Route';
import { useState } from 'react';
import { useCallback } from 'react';
import Fee from '../../components/Accounts/Fee';
import Feemaster from '../../components/Accounts/Feemaster';
import Dispatchfees from '../../components/Accounts/Dispacthfee';
import Viewdispatched from '../../components/Accounts/Viewdispatched';
import Editdispatched from './Accounts/edit-dispatched';
import Alltransactions from '../../components/Accounts/Alltransactions';
import Transactionsperday from '../../components/Accounts/Transactionperday';
import Transactionsperterm from '../../components/Accounts/Transactionperterm';
import Transactionspermonth from '../../components/Accounts/Transactionpermonth';
import Feepayment from '../../components/Accounts/Feepayment';
import Debtors from '../../components/Accounts/Debtors';
import Receipttrack from '../../components/Accounts/Receipttrack';
import Chartofaccount from '../../components/Accounts/Chartofaccounts';
import Banktransaction from '../../components/Accounts/Banktransactions';
import Vendors from '../../components/Accounts/Vendors';
import Incomeexpense from '../../components/Accounts/Icomeexpense';
import Teachinglogs from '../../components/Teachinglogs';
import Terninalreportsignature from '../../components/Terminalreportsignature';
import Books from '../../components/library/Books';
import Issuebooks from '../../components/library/Issuebook';
import Studentattendance from '../../components/Attendance/Studentattendance';
import Onlinelearning from '../../components/Onlinelearning/Learning';
import Zoommeetings from '../../components/Zoom/Zoommetting';
import Totalattendance from '../../components/Attendance/Totalattendance';
import Hostel from '../../components/Hostel/Hostel';
import Allocatestudent from '../../components/Hostel/Allocatestudent';
import Listhomework from '../../components/Homework/Listhomework';
import Staffattendance from '../../components/Staff/Staffattendance';
import Allstaffattendance from '../../components/Staff/Allattendance';
import Leave from '../../components/Staff/Leave';
import Listexams from '../../components/Exams/Listexams';
import Allpayroll from '../../components/Staff/Payroll';
import Normalreport from '../../components/Terminalreport/Normalreport';
import Schoolinformation from '../../components/Settings/Schoolinfo';
import Smssettings from '../../components/Settings/Smssettings';
import Notificationsettings from '../../components/Settings/Notificationsetting';
import Mailsettings from '../../components/Settings/Mailsettings';
import Noticeboard from '../../components/Communicate/Noticeboard';
import Messagetemplate from '../../components/Communicate/Messagetemplates';
import Sendmail from '../../components/Communicate/Sendmail';
import Sendsms from '../../components/Communicate/Sendsms';
import Makepayment from '../../components/Payment/Makepayment';
import Allactivestudents from '../../components/Studentinfo/Allactivestudents';
import Allstoppedstudents from '../../components/Studentinfo/Allstoppedstudents';
import Alldismissedstudents from '../../components/Studentinfo/Alldismissedstudents';
import Allcompletedstudents from '../../components/Studentinfo/Allcompletedstudents';
import Profile from '../../components/Profile/Profile';
import AddStaff from '../../components/Staff/Addstaff';
import Allstaff from '../../components/Staff/Allstaff';
import Studenttransaction from '../../components/Accounts/Studenttransaction';
import Myattendance from '../../components/Attendance/Myattendance';
import Questionbank from '../../components/Exams/Questionbank';
import Examination from '../../components/Exams/Examination';
import Myresults from '../../components/Terminalreport/Myresults';
import Trackroute from '../../components/Transport/Trackroute';
import Enterresults from '../../components/Results/Enterresults';
import Resultspersubject from '../../components/Results/Resultspersubject';
import Questionaireone from '../../components/Questinnaire/Questionaireone';
import Questionnairetwo from '../../components/Questinnaire/Questionnairetwo';
import Sendtransactionbymail from '../../components/Accounts/Sendtransactionbymail';
import Sendpushnotification from '../../components/Communicate/Sendpushnotification';
import Help from '../../components/Help';
import Viewbill from '../../components/Accounts/Viewbill';
import Billing from '../../components/Accounts/Billing';
import Expense from '../../components/Accounts/Expense';
import Income from '../../components/Accounts/Income';
import Incomecategory from '../../components/Accounts/Incomecat';
import Expensecategory from '../../components/Accounts/Expensecat';

const Drawer = createDrawerNavigator();

function Maindashboard() {
  const user = useSelector(selectuser);
  // token = useSelector(selecttoken);
  const router = useRouter();
  const [token, setToken] = useState();


  useFocusEffect(() => {
    if(user == null){
        router.push("/expo-auth-session");
    }    
  });

    return (
    <Drawer.Navigator
      initialRouteName='Dashboard'
      useLegacyImplementation
      drawerContent={props => <Drawercontent user={user} {...props}/>}>

      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Academicterm" component={Academicterm} />
      <Drawer.Screen name="Academicyear" component={Academicyear} />
      <Drawer.Screen name="Calendar" component={Eventcalendar} />
      <Drawer.Screen name="Sujects" component={Subjects} />
      <Drawer.Screen name="Classroom" component={Classrooms} />
      <Drawer.Screen name="Promotestudent" component={Promotestudent} />
      <Drawer.Screen name="Enquiry" component={Enquiries} />
      <Drawer.Screen name="Visitors" component={Visitors} />
      <Drawer.Screen name="Calllogs" component={Calllogs} />
      <Drawer.Screen name="Postaldispatch" component={Postaldispatch} />
      <Drawer.Screen name="Postalreceived" component={Postalreceived} />
      
      <Drawer.Screen name="Newstudent" component={Addstudent} />
      <Drawer.Screen name="Studentlist" component={Allstudents} />
      <Drawer.Screen name="Allactivestudents" component={Allactivestudents} />
      <Drawer.Screen name="Allstoppedstudents" component={Allstoppedstudents} />
      <Drawer.Screen name="Alldismissedstudents" component={Alldismissedstudents} />
      <Drawer.Screen name="Allcompletedstudents" component={Allcompletedstudents} />

      

      <Drawer.Screen name="Fee" component={Fee} />
      <Drawer.Screen name="Feemaster" component={Feemaster} />
      <Drawer.Screen name="Dispacchfees" component={Dispatchfees} />
      <Drawer.Screen name="Viewdispatched" component={Viewdispatched} />
      <Drawer.Screen name="Alltransactions" component={Alltransactions} />
      <Drawer.Screen name="Transactionsperterm" component={Transactionsperterm} />
      <Drawer.Screen name="Transactionsperday" component={Transactionsperday} />
      <Drawer.Screen name="Transactionspermonth" component={Transactionspermonth} />
      <Drawer.Screen name="Sendtransactionbymail" component={Sendtransactionbymail} />
      <Drawer.Screen name="Studenttransaction" component={Studenttransaction} />
      <Drawer.Screen name="Feepayment" component={Feepayment} />
      <Drawer.Screen name="Debtors" component={Debtors} />
      <Drawer.Screen name="Receipttrack" component={Receipttrack} />
      <Drawer.Screen name="Chartofaccount" component={Chartofaccount} />
      <Drawer.Screen name="Banktransaction" component={Banktransaction} />
      <Drawer.Screen name="Vendors" component={Vendors} />
      <Drawer.Screen name="Incomeexpense" component={Incomeexpense} />
      <Drawer.Screen name="Teachinglogs" component={Teachinglogs} />
      <Drawer.Screen name="Terninalreportsignature" component={Terninalreportsignature} />
      <Drawer.Screen name="Books" component={Books} />
      <Drawer.Screen name="Issuebooks" component={Issuebooks} />
      <Drawer.Screen name="Billing" component={Billing} />
      <Drawer.Screen name="ViewBill" component={Viewbill} />
      <Drawer.Screen name="Expense" component={Expense} />
      <Drawer.Screen name="Income" component={Income} />
      <Drawer.Screen name="Incomecategory" component={Incomecategory} />
      <Drawer.Screen name="Expensecategory" component={Expensecategory} />

      
      <Drawer.Screen name="Allstaff" component={Allstaff} />
      <Drawer.Screen name="Staffattendance" component={Staffattendance} />
      <Drawer.Screen name="Allstaffattendance" component={Allstaffattendance} />
      <Drawer.Screen name="Myattendance" component={Myattendance} />
      
      <Drawer.Screen name="Leave" component={Leave} />
      <Drawer.Screen name="Allpayroll" component={Allpayroll} />

      
      
      <Drawer.Screen name="Questionbank" component={Questionbank} />
      <Drawer.Screen name="Examination" component={Examination} />
      
      <Drawer.Screen name="Listexams" component={Listexams} />
      


      <Drawer.Screen name="Onlinelearning" component={Onlinelearning} />
      <Drawer.Screen name="Zoommeetings" component={Zoommeetings} />


      <Drawer.Screen name="Studentattendance" component={Studentattendance} />
      <Drawer.Screen name="Totalattendance" component={Totalattendance} />

      <Drawer.Screen name="Hostel" component={Hostel} />
      <Drawer.Screen name="Allocatestudent" component={Allocatestudent} />
      
      <Drawer.Screen name="Listhomework" component={Listhomework} />


      <Drawer.Screen name="vehicle" component={Vehicle} />
      <Drawer.Screen name="waypoint" component={Waypoint} />
      <Drawer.Screen name="Routes" component={Routes} />
      <Drawer.Screen name="Trackroute" component={Trackroute} />


      <Drawer.Screen name="Enterresults" component={Enterresults} />
      <Drawer.Screen name="Resultspersubject" component={Resultspersubject} />

      <Drawer.Screen name="Questionnaire 1" component={Questionaireone} />
      <Drawer.Screen name="Questionnaire 2" component={Questionnairetwo} />
      
      
      
      
      <Drawer.Screen name="Normalreport" component={Normalreport} />
      <Drawer.Screen name="Myresults" component={Myresults} />


      <Drawer.Screen name="Makepayment" component={Makepayment} />

      <Drawer.Screen name="Noticeboard" component={Noticeboard} />
      <Drawer.Screen name="Messagetemplate" component={Messagetemplate} />
      <Drawer.Screen name="Sendmail" component={Sendmail} />
      <Drawer.Screen name="Sendsms" component={Sendsms} />
      <Drawer.Screen name="Sendpushnotification" component={Sendpushnotification} />
      
      

      <Drawer.Screen name="Schoolinformation" component={Schoolinformation} />
      <Drawer.Screen name="Smssettings" component={Smssettings} />
      <Drawer.Screen name="Notificationsettings" component={Notificationsettings} />
      <Drawer.Screen name="Mailsettings" component={Mailsettings} />

      <Drawer.Screen name="Help" component={Help} />

      
      
      
      
      <Drawer.Screen name="TextBottomsheet" component={TextBottomsheet} />
    </Drawer.Navigator>
    )
}

export default Maindashboard;

const styles = StyleSheet.create({
    
});
