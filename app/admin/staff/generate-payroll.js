import React, { Component } from 'react'
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, 
  View, DeviceEventEmitter, Alert, StatusBar, ActivityIndicator } from 'react-native'
  import { useEffect } from 'react';
  import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, Avatar, TextInput, Divider } from 'react-native-paper';
  import { useState } from 'react';
  import axios from 'axios';
  import Ionicons from '@expo/vector-icons/Ionicons';
  import { useSelector } from 'react-redux';
  import * as Imagepicker from 'expo-image-picker';
  import { showMessage } from "react-native-flash-message";
  import { selecttoken } from '../../../features/userinfoSlice';
  import { schoolzapi } from '../../../components/constants';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  
  function Generatepayroll () {
    
    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [isubmitting, setisubmitting] = useState(false);
    const [data, setData] = useState({});
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const [showdialog, setShowdialog] = useState(false);
    const showDialog = () => setShowdialog(true);
    const hideDialog = () => setShowdialog(false);
    const [showsnakbar, setShowsnakbar] = useState(false);
    const [active, setActive] = useState("0");
    const {userid,month,year} = useSearchParams();
    const enames = [''];
    const evalues = [''];
    const earnings = [
      {name: '', value: '0'}
    ];
    
    const [earn,setearning] = useState(earnings);
    
    
    const deduction = [
      {name: '', value: '0'}
    ];
    
    const [deduct,setdeduct] = useState(deduction);
    
    const [basic,setbasic] = useState("");
    const [earns,setearns] = useState("");
    const [deductions,setdeductions] = useState("");
    const [gross,setgross] = useState("");
    const [tax,settax] = useState("");
    const [netsalary,setnetsalary] = useState("");

    const [calculating, setcalculating] = useState(false);

    const [earnnames,setearnnames] = useState([]);
    const [earnalues,setearnalues] = useState([]);
    const [earntotal,setearntotal] = useState(0);

    const [deductnames,setdeductnames] = useState([]);
    const [deductalues,setdeductalues] = useState([]);
    const [deducttotal,setdeducttotal] = useState(0);
   
    useEffect(()=> {
      loaddata();
    },[]);
    
    
    const loaddata = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/generate-staff-payroll/'+userid+"/"+month+"/"+year,
      {
        headers: {Accept: 'application/json',
        Authorization: "Bearer "+token
      }
    })
    .then(function (results) {
      
      setData(results.data.data);
      console.log("pic",results.data.data.pic);
      
      setbasic(results.data.data.salary);
      //setearns();
      //setdeductions();
      // setgross();
      settax("0");
      // setnetsalary();
      loadpayroll(results.data.data.payroll);

      setLoading(false);
      
    }).catch(function(error){
      setLoading(false);
      console.log(error);
    });
  }
  
  function loadpayroll(payroll){
     if(payroll !== null){

       console.log("payroll",payroll);
       setbasic(payroll.basicsalary);
       setearntotal(payroll.totalearn);
       setdeducttotal(payroll.totalded);
       setgross(payroll.grosssalary);
       settax(payroll.tax);
       setnetsalary(payroll.netsalary);

       let earn = payroll.earning;
       let arearn = earn.split(",");
       let totearn = [];
       let earname = [];
       let earnvalues = [];

       let earnvalue = payroll.earnamnts;
       let arearnvalue = earnvalue.split(",");

       arearn.map((item,index) => {
        if(item !== ""){
          totearn.push({name: item, value: arearnvalue[index]});
          earname.push(item);
          earnvalues.push(arearnvalue[index]);
        }
       });

       setearnnames(earname);
       setearnalues(earnvalues);
       setearning(totearn);


       let deduct = payroll.deduction;
       let ardeduct = deduct.split(",");
       let todeduct = [];
       let deductname = [];
       let deductvalues = [];

       let deductvalue = payroll.deductamnts;
       let ardeductvalue = deductvalue.split(",");

       ardeduct.map((item,index) => {
        if(item !== ""){
          todeduct.push({name: item, value: ardeductvalue[index]});
          deductname.push(item);
          deductvalues.push(arearnvalue[index]);
        }
       });

       setdeductnames(deductname);
       setdeductalues(deductvalues);
       setdeduct(todeduct);


     }
  }
  
  
  const updateearnname = (index,newvalue) => {
    const newname = earn.map((item,nindex) => {
      if(nindex === index){
        return {...item, name: newvalue};
      }
      return item;
    });
    
    console.log(newname);
    
    setearning(newname);
  }
  
  const updateearnval = (index,newvalue) => {
    const newname = earn.map((item,nindex) => {
      if(nindex === index){
        return {...item, value: newvalue};
      }
      
      return item;
    });
    
    console.log(newname);
    
    setearning(newname);
  }
  
  const addmorearnings = () => {
    const newearn = [...earn,{name: '', value: '0'}];
    console.log(newearn);
    
    setearning(newearn);
  }
  
  const removeearn = (index) => {
    setearning([...earn.slice(0,index)]);
    console.log(earn);
  }
  
  
  
  const updatedeductname = (index,newvalue) => {
    const newname = deduct.map((item,nindex) => {
      if(nindex === index){
        return {...item, name: newvalue};
      }
      return item;
    });
    
    console.log(newname);
    
    setdeduct(newname);
  }
  
  const updatedeductval = (index,newvalue) => {
    const newname = deduct.map((item,nindex) => {
      if(nindex === index){
        return {...item, value: newvalue};
      }
      
      return item;
    });
    
    console.log(newname);
    
    setdeduct(newname);
  }
  
  const addmorededuct = () => {
    const newearn = [...deduct,{name: '', value: '0'}];
    console.log(newearn);
    
    setdeduct(newearn);
  }
  
  const removededuct = (index) => {
    setdeduct([...deduct.slice(0,index)]);
    console.log(deduct);
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


const savepayoll = () => {
  
    const formdata = {
      stafid: data.id,
      role: data.role,
      month,
      year,
      earning: earn,
      deduction: deduct,
      deductnames,
      deductalues,
      earnnames,
      earnalues,
      basic,
      earntotal,
      deducttotal,
      gross,
      tax,
      netsalary
    }


    //console.log(formdata);
    //return;

    setisubmitting(true);
    
    axios.post(schoolzapi+'/staff-payroll-save',
    formdata,
    {
      headers: {Accept: 'application/json',
      Authorization: "Bearer "+token
    }
  })
  .then(function (response) {
    
    setisubmitting(false);

    showMessage({
      message: 'Payroll Generated Successfully!',
      type: "success",
      position: 'bottom',
    });

    DeviceEventEmitter.emit('subject.added', {});

    router.back();
    
  })
  .catch(function (error) {
    setisubmitting(false);
    console.log(error);
  });

}


return (
  
  <Provider>
  <SafeAreaView>
  <Stack.Screen
  options={{
    headerShown: true,
    headerTitle: 'Generate'
  }}
  />
  
  <StatusBar hidden={true} />
  <KeyboardAwareScrollView>   
  <ScrollView
  refreshControl={
    <RefreshControl refreshing={isloading} onRefresh={loaddata} />
  }
  > 
  <Card>
  <Card.Content>
  
  {/* <TouchableOpacity style={{flexDirection: 'row',marginTop: 20}} onPress={()=> router.back()}>
  <Ionicons name="close-circle" size={30} />
  </TouchableOpacity> */}

  {isloading ? <ActivityIndicator /> : (
    <>
  
  <View style={{alignItems: 'center'}}>
  
  <Avatar.Image 
  source={{uri: data?.pic}}
  size={150}
  />
  
  <Text style={{fontSize: 20}}>{data?.fullname}</Text>
  <Text>{data?.eployid}</Text>
  <Text>{data?.role}</Text>
  
  </View>
  
  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
  <Text>Earnings</Text>
  <TouchableOpacity style={{flexDirection: 'row',marginTop: 20}} onPress={()=> addmorearnings()}>
  <Ionicons name="add-circle" size={35} />
  </TouchableOpacity>
  </View>
  
  {earn.map((item,index) => (
    
    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff',  marginTop: 15}} key={index}>
    <View style={{flex: 2}}>
    <TextInput
    label="Name"
    value={earn[index]?.name}
    onChangeText={(e) => updateearnname(index,e)}
    mode="outlined"
    />
    </View>
    <View style={{flex: 1,marginLeft: 10}}>
    <TextInput 
    label="Value"
    mode="outlined"
    value={earn[index]?.value}
    onChangeText={(e) => updateearnval(index,e)}
    keyboardType="numeric"
    />
    </View>
    <View style={{marginLeft: 10}}>
    <TouchableOpacity onPress={() => removeearn(index)} disabled={earn.length < 2 ? true: false}>
    <Ionicons name="remove-circle" size={30} color="red" />
    </TouchableOpacity>
    </View>
    
    </View>
    
    ))}
    
    <Divider bold={true} style={{marginTop: 30}} />
    
    
    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
    <Text>Deductions</Text>
    <TouchableOpacity style={{flexDirection: 'row',marginTop: 20}} onPress={()=> addmorededuct()}>
    <Ionicons name="add-circle" size={35} />
    </TouchableOpacity>
    </View>
    
    {deduct.map((item,index) => (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', marginTop: 15}} key={index}>
      <View style={{flex: 2}}>
      <TextInput
      label="Name"
      value={deduct[index]?.name}
      onChangeText={(e) => updatedeductname(index,e)}
      mode="outlined"
      />
      </View>
      <View style={{flex: 1,marginLeft: 10}}>
      <TextInput 
      label="Value"
      mode="outlined"
      value={deduct[index]?.value}
      onChangeText={(e) => updatedeductval(index,e)}
      keyboardType="numeric"
      />
      </View>
      <View style={{marginLeft: 10}}>
      <TouchableOpacity onPress={() => removededuct(index)} disabled={deduct.length < 2 ? true: false}>
      <Ionicons name="remove-circle" size={30} color="red" />
      </TouchableOpacity>
      </View>
      
      </View>
      
      ))}
      
      <Divider bold={true} style={{marginTop: 30}} />

      {calculating ? <ActivityIndicator size="large" /> : null}
      
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
      <Text>Payroll Summary</Text>
      <Button onPress={paycalculate}>Calculate</Button>
      </View>
      
      <TextInput
      label="Basic Salary"
      keyboardType="numeric"
      mode="outlined"
      value={basic}
      onChangeText={(e) => setbasic(e)}
      />
      
      <TextInput
      style={{marginTop: 10}}
      keyboardType="numeric"
      mode="outlined"
      label="Total Earning"
      value={earntotal}
      onChangeText={(e) => setearntotal(e)}
      
      />
      
      <TextInput
      style={{marginTop: 10}}
      keyboardType="numeric"
      mode="outlined"
      label="Total Deductions"
      value={deducttotal}
      onChangeText={(e) => setdeducttotal(e)}
      
      />
      
      <TextInput
      style={{marginTop: 10}}
      keyboardType="numeric"
      mode="outlined"
      label="Gross Salary"
      value={gross}
      onChangeText={(e) => setgross(e)}
      
      />
      
      <TextInput
      style={{marginTop: 10}}
      keyboardType="numeric"
      mode="outlined"
      label="Tax (%)"
      value={tax}
      onChangeText={(e) => settax(e)}
      />
      
      <TextInput
      style={{marginTop: 10}}
      keyboardType="numeric"
      mode="outlined"
      label="Net Salary"
      value={netsalary}
      onChangeText={(e) => setnetsalary(e)}
      
      />
      
      {isubmitting ? <ActivityIndicator size="large"  style={{marginVertical: 20}} /> : (
          <Button onPress={savepayoll} mode="contained" style={{marginVertical: 20}}>Save Payroll</Button>
      )}
      
      </>
  )}
      </Card.Content>
      </Card> 
      
      </ScrollView>
      </KeyboardAwareScrollView>
      </SafeAreaView>
      </Provider>
      
      )
    }
    
    export default Generatepayroll;
    
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