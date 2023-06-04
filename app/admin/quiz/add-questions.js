import React, { Component, useCallback, useRef } from 'react'
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, 
  View, DeviceEventEmitter, Alert, StatusBar, ActivityIndicator } from 'react-native'
  import { useEffect } from 'react';
  import { RadioButton, Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, Avatar, TextInput, Divider } from 'react-native-paper';
  import { useState } from 'react';
  import axios from 'axios';
  import Ionicons from '@expo/vector-icons/Ionicons';
  import { useSelector } from 'react-redux';
  import * as Imagepicker from 'expo-image-picker';
  import { showMessage } from "react-native-flash-message";
  import { selecttoken } from '../../../features/userinfoSlice';
  import { schoolzapi } from '../../../components/constants';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  import DropDownPicker from 'react-native-dropdown-picker';
  //import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
  import {produce} from "immer";

  
  function Addquestions () {
    
    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [isubmitting, setisubmitting] = useState(false);
    const [data, setData] = useState(null);
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const {id} = useSearchParams();
    const scrollViewRef = useRef();
    const questions = [];

    const [openanswer, setOpenanswer] = useState(false);
    const [answer, setanswer] = useState("");
    const [answeritems, setanswerItems] = useState([
        { label: 'Option A', value: 'a'},
        { label: 'Option B', value: 'b'},
        { label: 'Option C', value: 'c'},
        { label: 'Option D', value: 'd'},
    ]);
    
   
    useEffect(()=> {
      loaddata();
    },[]);
    
    
    const loaddata = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/all-bank-questions/'+id,
      {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
      }
    })
    .then(function (results) {
      
      //console.log(results.data.data);
      //setData(results.data.data);

      loadqestions(results.data.data);

      setLoading(false);
      
      
    }).catch(function(error){
      setLoading(false);
      console.log(error);
    });
  }

  const loadqestions = (data) => {
            
    const mddatas = data;
    
    let mdata = [];

     mddatas.map(item =>  mdata.push(
        {id: "que_" + Math.random(),exam_id: item?.exam_id, question: item?.question, optiona: item?.optiona, optionb: item?.optionb, optionc: item?.optionc, optiond: item?.optiond, answer: item?.answer}
    ))
    
     setData(mdata);
}
  
  
//console.log("data",data);
  
  const updateearnval = (index,newvalue) => {
    const newname = earn.map((item,nindex) => {
      if(nindex === index){
        return {...item, value: newvalue};
      }
      
      return item;
    });
    
    //console.log(newname);
    
    setearning(newname);
  }
  
  const addmorearnings = () => {
    const newearn = [...earn,{name: '', value: '0'}];
    console.log(newearn);
    
    setearning(newearn);
  }
  
  const removeearn = (index) => {
    //setearning([...earn.slice(0,index)]);
  }
  

  
  const paycalculate = () => {
    
    setcalculating(true);

    setearnnames([]);
    setearnalues([]);
    setearntotal(0);
    setdeductnames([]);
    setdeductalues([]);
    setdeducttotal(0);
    
    
    const earns = [];
    const earnpx = [];
    let totearn = 0;

    const newearns = [...earn];
    console.log("calearn",newearns);

    newearns.map((item) => {
      earns.push(item.name);
      earnpx.push(item.value);
      totearn+=parseInt(item.value);
    });

    setearnnames(earns);
    setearnalues(earnpx);
    setearntotal(""+totearn);

    console.log("earnnames",earns);
    console.log("earnalues",earnpx);
    console.log("earntotal",totearn);

    const newduducts = [...deduct];

    const deducts = [];
    const deductpx = [];
    let totdeduct = 0;

    newduducts.map((item) => {
      deducts.push(item.name);
      deductpx.push(item.value);
      totdeduct+=parseInt(item.value);      
    });

    setdeductnames(deducts);
    setdeductalues(deductpx);
    setdeducttotal(""+totdeduct);

    console.log("deductnames",deducts);
    console.log("deductalues",deductpx);
    console.log("deducttotal",totdeduct);

   const initail =  (parseInt(totearn) + parseInt(basic)) - parseInt(totdeduct);
   let netgross = 0;
   let netsalary = 0;
   if(parseInt(tax) > 0){
    netgross = (parseInt(tax)/100) * initail;
    netsalary = parseInt(initail) - parseInt(netgross);
   }else{
    netsalary = initail;
   }

   setgross(""+initail);
   setnetsalary(""+netsalary);

   setcalculating(false);
    
  return;
    
    
    
    
    
    
    const formdata = {
      earning: earn,
      deduction: deduct
    }

    setcalculating(true);
    
    axios.post(schoolzapi+'/staff-approve-leave',
    formdata,
    {
      headers: {Accept: 'application/json',
      Authorization: "Bearer "+token
    }
  })
  .then(function (response) {
    
    setcalculating(false);
    
  })
  .catch(function (error) {
    setcalculating(false);
    console.log(error);
  });
  

  
}


const savequestions = () => {
  
    const formdata = {
      examid: id,
      data
    }


    setisubmitting(true);
    
    axios.post(schoolzapi+'/add-questions-to-bank',
    formdata,
    {
      headers: {Accept: 'application/json',
      Authorization: "Bearer "+token
    }
  })
  .then(function (response) {
    
    setisubmitting(false);

    showMessage({
      message: 'Questions Saved Successfully!',
      type: "success",
      position: 'bottom',
    });

    //router.back();
    
  })
  .catch(function (error) {
    setisubmitting(false);
    console.log(error);
  });

}


// const addmore = () => {
//  const newearn = [...data,{exam_id: id, question: '', optiona: '', optionb: '', optionc: '', optiond: '', answer: ''}];
    
// setData(newearn);
// }

const addmore = useCallback(()=>{

  setData(
    produce((draft) => {
      draft.push(
        {
        id: "que_" + Math.random(),
        exam_id: id, 
        question: '',
        optiona: '',
        optionb: '',
        optionc: '',
        optiond: '',
        answer: ''
        });
    })
  );


},[]);


const remove = (index) => {
  const Items = data.filter(item => item.id !== index);
  setData(Items);
}

// const updatequestion = (index,e) => {
//   produce(data,(draft) => {
//     draft[index].question = e;
//   })
//   console.log(data);
// }


const updatequestion = (index,newvalue) => {
  const newname = data.map((item,nindex) => {
    if(nindex === index){
      return {...item, question: newvalue};
    }
    return item;
  });
    
  setData(newname);
}

const updateoptiona = (index,newvalue) => {
  const newname = data.map((item,nindex) => {
    if(nindex === index){
      return {...item, optiona: newvalue};
    }
    return item;
  });
    
  setData(newname);
}

const updateoptionb = (index,newvalue) => {
  const newname = data.map((item,nindex) => {
    if(nindex === index){
      return {...item, optionb: newvalue};
    }
    return item;
  });
    
  setData(newname);
}

const updateoptionc = (index,newvalue) => {
  const newname = data.map((item,nindex) => {
    if(nindex === index){
      return {...item, optionc: newvalue};
    }
    return item;
  });
    
  setData(newname);
}


const updateoptiond = (index,newvalue) => {
  const newname = data.map((item,nindex) => {
    if(nindex === index){
      return {...item, optiond: newvalue};
    }
    return item;
  });
    
  setData(newname);
}

console.log(answer);

const updateanswer = (index,newvalue) => {
  console.log("new value",newvalue);
  const newname = data.map((item,nindex) => {
    if(nindex === index){
      return {...item, answer: newvalue};
    }
    return item;
  });
    
  setData(newname);
}




return (
  
  <Provider>
  <SafeAreaView>
  <Stack.Screen
  options={{
    headerShown: false
  }}
  />
  
  <StatusBar hidden={true} />

  <View style={{marginHorizontal:20}}>

  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop: 20}}>
    <TouchableOpacity onPress={()=> router.back()}>
       <Ionicons name="close-circle" size={30} />
    </TouchableOpacity>
    <Text style={{fontWeight: 600}}>Total Questions: {data !== null ? data.length : 0}</Text>
  </View>

  {/* <CountdownCircleTimer
    isPlaying
    duration={7}
    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
    colorsTime={[7, 5, 2, 0]}
  >
    {({ remainingTime }) => <Text>{remainingTime}</Text>}
  </CountdownCircleTimer> */}

  
  
  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
  <Text style={{fontSize: 18}}>Add More</Text>
  <TouchableOpacity style={{flexDirection: 'row',marginTop: 20}} onPress={()=> addmore()}>
  <Ionicons name="add-circle" size={35} />
  </TouchableOpacity>
  </View>

   </View>



  <KeyboardAwareScrollView>   
  <ScrollView
  ref={scrollViewRef}
  onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
  style={{marginBottom: 150}}
  refreshControl={
    <RefreshControl refreshing={isloading} onRefresh={loaddata} />
  }
  > 
  <Card>
  <Card.Content>
  
    {data !== null && (
        <>
        {data.map((item,index) => (
        <>    
        <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{fontSize: 18}}>Question {index+1}</Text>
                {/* <TouchableOpacity onPress={() => removeearn(`index`)}>
                    <Ionicons name="remove-circle" size={35} color="red" />
                </TouchableOpacity> */}
            </View>
                <TextInput
                multiline={true}
                numberOfLines={5}
                label="Question"
                style={styles.Forminputhelp}
                value={item.question}
                onChangeText={(e) => updatequestion(index,e)}
                mode="outlined"
                />

                <TextInput
                label="Option A"
                style={styles.Forminputhelp}
                mode="outlined"
                onChangeText={(e) => updateoptiona(index,e)}
                value={item.optiona}
                />

            <TextInput
                label="Option B"
                style={styles.Forminputhelp}
                mode="outlined"
                onChangeText={(e) => updateoptionb(index,e)}
                value={item.optionb}
                />

            <TextInput
                label="Option C"
                style={styles.Forminputhelp}
                mode="outlined"
                onChangeText={(e) => updateoptionc(index,e)}
                value={item.optionc}
                />

            <TextInput
                label="Option D"
                style={styles.Forminputhelp}
                mode="outlined"
                onChangeText={(e) => updateoptiond(index,e)}
                value={item.optiond}
                />


            <Text style={{marginTop: 15}}>Choose Answer</Text>

            <RadioButton.Group onValueChange={newValue => updateanswer(index,newValue)} value={item?.answer}>
              <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>

              
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <RadioButton value="a" />
                      <Text>A</Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <RadioButton value="b" />
                      <Text>B</Text>
                      
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <RadioButton value="c" />
                      <Text>C</Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <RadioButton value="d" />
                      <Text>D</Text>
                  </View>
              </View>

            </RadioButton.Group>

          <Button style={{marginTop: 15}} onPress={() => remove(item?.id)} textColor='red'>Remove</Button>
        </View>
        
        <Divider bold={true} style={{marginVertical: 20}} />
        </>
    ))}
    </>
)}
          {isubmitting ? <ActivityIndicator size="large" /> : (
           <Button onPress={savequestions} mode="contained" style={{marginBottom: 40}}>Save</Button>
           )}  
      </Card.Content>
      </Card> 
      
      </ScrollView>
      </KeyboardAwareScrollView>
      </SafeAreaView>
      </Provider>
      
      )
    }
    
    export default Addquestions;
    
    const styles = StyleSheet.create({
      
      separator: {
        height: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
      },
      calendarWrapper: {
        padding: 0,
        margin: 0,
        height: '100%',
        width: '100%'
      }
    });