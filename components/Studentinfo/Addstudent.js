import axios from 'axios';
import { Redirect, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView,
   StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Button, Card, List, Modal, Portal, Switch, TextInput, Provider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { DatePickerInput, DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCallback } from 'react';
import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import { selecttoken } from '../../features/userinfoSlice';
import { schoolzapi } from '../constants';
import AnimatedMultistep from "react-native-animated-multistep";


/* Define the steps  */
import Step1 from './admissionsteps/Personalinfo';
import Academicinfo from './admissionsteps/Academicinfo';
import Gurdianinformation from './admissionsteps/Gurdianinformation';
import Paymentinformation from './admissionsteps/Paymentinformation';


import { ScrollView } from 'react-native-gesture-handler';

const allSteps = [
  { name: "step 1", component: Step1 },
  { name: "step 2", component: Academicinfo },
  { name: "step 3", component: Gurdianinformation },
  { name: "step 4", component: Paymentinformation }
];

function Addstudent(props) {

  //console.log('my ptops', props);

  const token = useSelector(selecttoken);    
  const router = useRouter();


  onNext = () => {
    //console.log("Next");
  };

  /* define the method to be called when you go on back step */

  onBack = () => {
    //console.log("Back");
  };

  /* define the method to be called when the wizard is finished */
  finish = () => {
    //console.log(props.getState());
  };



    return (
    <Provider>
        <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen  options={{
            headerTitle: 'New Student'
        }} />
        <AnimatedMultistep
            steps={allSteps}
            onFinish={this.finish}
            onBack={this.onBack}
            onNext={this.onNext}
            comeInOnNext="bounceInUp"
            OutOnNext="bounceOutDown"
            comeInOnBack="bounceInDown"
            OutOnBack="bounceOutUp"
        />
        </SafeAreaView>
    </Provider>
    )
}

export default Addstudent;

const styles = StyleSheet.create({

  separator: {
      height: 0.5,
      backgroundColor: 'rgba(0,0,0,0.4)',
  },
});