import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import {  Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { ActivityIndicator, Avatar, Button, Card, Divider, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { schoolzapi } from '../../../components/constants';
import { selectaccstatus, selecttoken, selectuser } from '../../../features/userinfoSlice';
import { useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { TimePickerModal } from 'react-native-paper-dates';
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import MultiSelect from 'react-native-multiple-select';
import { cos } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { showMessage } from "react-native-flash-message";

function Updatefeemaster() {

    const token = useSelector(selecttoken);
    const [amount, setamount] = useState("0");
    const [ofee, setofee] = useState("0");

    const [openstudentclass, setOpenstudentclass] = useState(false);
    const [studentclass, setstudentclass] = useState("");
    const [studentclassitems, setstudentclassItems] = useState([]);
    
    const [openyear, setOpenyear] = useState(false);
    const [year, setYear] = useState("");
    const [yearitems, setyearItems] = useState([]);

    const [isdeleting, setisdeleting] = useState(false);


    const [opendscnt, setOpendscnt] = useState(false);
    const [dscnt, setdscnt] = useState(0);
    const [dscntitems, setdscntItems] = useState([
      { label: 'Yes', value: 1},
      { label: 'No', value: 0}
    ]);


    const [openacdemicterm, setOpenacdemicterm] = useState(false);
    const [acdemicterm, setacdemicterm] = useState("");
    const [acdemictermitems, setacdemictermItems] = useState([]);


    const [openfee, setOpenfee] = useState(false);
    const [fee, setfee] = useState("");
    const [feeitems, setfeeItems] = useState([]);

    
    const [creatoredit, isCreatedorEdit] = useState();
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);

    const [addmore, setaddmore] = useState([]);

    const user = useSelector(selectuser);
    const accnt = useSelector(selectaccstatus);


    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");

      loaddata();
      loadademicterm();

      if(id == undefined){
        isCreatedorEdit('New Fee master');
      }else{
        loadedit();
        isCreatedorEdit('Edit Fee master');
      }

    },[]);


    const loadademicterm = () => {
            
      const mddatas = [0,1,2,3,4,5];
      let mdata = [];
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      mddatas.map(item =>  mdata.push(
        { label: item == '0' ? `${currentYear} - ${currentYear + item + 1}` : `${currentYear + item} - ${currentYear + item + 1}`, value: currentYear + item}
        ))
      setyearItems(mdata);
  }

      
      function getstudentclass() {

        return axios.get(schoolzapi+'/student-classes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
      }

      function getacademicterm() {

        return axios.get(schoolzapi+'/academicterms',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }

     function getfee() {

        return axios.get(schoolzapi+'/schoolfees',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }


     const loaddata = () => {
        setLoading(true);
        
        Promise.all([getstudentclass(), getacademicterm(), getfee()])
        .then(function (results) {
            ///setLoading(false);
            const stclass = results[0];
            const academicterm = results[1];
            const fee = results[2];

            loadstclass(stclass.data.data);
            loadacademicterm(academicterm.data.data);
            loadfee(fee.data.data);

            // if(id == undefined){
            //   setLoading(false);
            // }

        }).catch(function(error){
            setLoading(false);
            const acct = error[0];
            const studeclass = error[1];
            
        });
    }


    const loadfees = (data) => {

      const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({id: parseInt(item?.id), fee: parseInt(item?.feeid), amount: item?.exfeeamount, other: item?.exofeeamount, dscnt: parseInt(item?.status)}))
        
         setaddmore(mdata);            
      
    }


    const loadedit = () => {
      setLoading(true);
      
      axios.get(schoolzapi+'/fee-master/show/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      }).then(function (results) {
          
          setstudentclass(parseInt(results.data.data.classid));
          setacdemicterm(parseInt(results.data.data.semesterid));
          //setfee(parseInt(results.data.data.feeid));
          //setamount(results.data.data.feeamount);
          //setofee(results.data.data.ofeeamount);
          //setYear(results.data.data.year);
          setYear(parseInt(results.data.data.year));

          loadfees(results.data.data.fees);

         // console.log("year",results.data.data.year);

          setLoading(false);
          

      }).catch(function(error){
          setLoading(false);
          const acct = error[0];
          const studeclass = error[1];
          
      });
  }

    const loadstclass = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setstudentclassItems(mdata);
    }


    const loadacademicterm = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
        
         setacdemictermItems(mdata);
    }


    const loadfee = (data) => {
            
        const mddatas = data;
        
        let mdata = [];
  
         mddatas.map(item =>  mdata.push({ label: item?.title, value: item?.id}))
        
         setfeeItems(mdata);


         if(id == undefined){
              setLoading(false);
          }

         //setLoading(false);
    }


    const createdata = () => {

        if(studentclass == ""){
          alert('student class cant be empty');
          return;
        }

        if(acdemicterm == ""){
            alert('Acdemic term cant be empty');
            return;
        }

    
      if(year == ""){
        alert('Year cant be empty');
        return;
      }

      setIssubmitting(true);

        const formdata = {
         studentclass: studentclass,
         fee: addmore,
         acdemicterm: acdemicterm,
         year: year
        }

        axios.post(schoolzapi+'/fee-master',
        formdata,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {

            setIssubmitting(false);

            showMessage({
              message: 'Info saved Successfully!',
              type: "success",
              position: 'bottom',
            });

            // if( response.data.error !== undefined){
            //     alert('Fee Already Added!');
            // }else{
            //     showMessage({
            //       message: 'Info saved Successfully!',
            //       type: "success",
            //       position: 'bottom',
            //     });

            //     DeviceEventEmitter.emit('subject.added', {});
            //     router.back();
            // }
            
            DeviceEventEmitter.emit('subject.added', {});
            router.back();
           
            
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log("error",error);
          });
    }

    const updatedata = () => {

      if(studentclass == ""){
        alert('student class cant be empty');
        return;
      }

      if(acdemicterm == ""){
          alert('Acdemic term cant be empty');
          return;
      }

  
    if(year == ""){
      alert('Year cant be empty');
      return;
    }

    setIssubmitting(true);

      const formdata = {
       studentclass: studentclass,
       fee: addmore,
       acdemicterm: acdemicterm,
       year: year
      }

      console.log("formdata",formdata);
    
      axios.post(schoolzapi+'/fee-master/'+id,
      formdata,
      {
          headers: {Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setIssubmitting(false);

          showMessage({
            message: 'Info updated Successfully!',
            type: "success",
            position: 'bottom',
          });
          
          DeviceEventEmitter.emit('subject.added', {});
          router.back();
        })
        .catch(function (error) {
          setIssubmitting(false);
          console.log(error.response);
        });
  }

  const refresh = () => {
    loaddata();

    if(id !== undefined){
      loadedit();
    }
    
  }


  const addmorefee = () => {
    //const newfee = [...addmore,Math.random(0,10)];
    const newfee = [...addmore,{id: 0, fee: '', amount: 0, other: 0, dscnt: user.uniqueid == "23cd37b8-9657-420c-b9d2-6651f5c080ce" || user.uniqueid == "c542417f-0671-439e-8f76-6c8ddb729f02" ? 1 : 0}];
    console.log("newfee",newfee);
    setaddmore(newfee);
   }

   const removefee = (index,id) => {

    return Alert.alert(
      "Are your sure?",
      "You want to remove fee",
      [
        {
          text: "No",
        },
        {
          text: "Yes Remove",
          onPress: () => {

            if(id == "0"){

              const updatedItems = [...addmore];
              updatedItems.splice(index, 1);
              setaddmore(updatedItems);

            }else{

              setisdeleting(true);
              axios.delete(schoolzapi+'/fee-item-delete/'+id,
              {
                  headers: {Accept: 'application/json',
                  Authorization: "Bearer "+token
              }
              })
                  .then(function (response) {
                    const updatedItems = [...addmore];
                    updatedItems.splice(index, 1);
                    setaddmore(updatedItems);
                    setisdeleting(false);
                  })
                  .catch(function (error) {
                   setisdeleting(false);
                  console.log(error);
                  });

            }
          },
        },
      ]
    )


   }

  const updatefee = (index,newvalue) => {
    const value = addmore.map((item,nindex) => {
      if(nindex === index){
        return {...item, fee: newvalue};
      }
      console.log("newfee",item);
      return item;
    });
        
    setaddmore(value);
  }


  const updateamount = (index,newvalue) => {
    const value = addmore.map((item,nindex) => {
      if(nindex === index){
        return {...item, amount: newvalue};
      }
      return item;
    });
        
    setaddmore(value);
  }

  const updateother = (index,newvalue) => {
    const value = addmore.map((item,nindex) => {
      if(nindex === index){
        return {...item, other: newvalue};
      }
      return item;
    });
        
    setaddmore(value);
  }


  const updatedscnt = (index,newvalue) => {
    const value = addmore.map((item,nindex) => {
      if(nindex === index){
        return {...item, dscnt: newvalue};
      }
      return item;
    });
        
    setaddmore(value);
  }


    return (
      <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: creatoredit,
                //headerShown: false,
                presentation: "card",
                // headerRight: () => (
                //     <>
                //       <TouchableOpacity onPress={refresh}>
                //         <Ionicons name="refresh" size={30} />
                //       </TouchableOpacity>
                //     </>
                //   )
            }}

        />
        <ScrollView style={{marginBottom: 30}}
        >
        <KeyboardAvoidingView
            behavior="height"
            >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>
        <Card.Content>


<Text style={{fontSize: 15, fontWeight: 500}}>Student Class</Text>
               <DropDownPicker
                    open={openstudentclass}
                    value={studentclass}
                    items={studentclassitems}
                    setOpen={setOpenstudentclass}
                    setValue={setstudentclass}
                    setItems={setstudentclassItems}
                    placeholder={"Student Class"}
                    placeholderStyle={{
                        color: "#456A5A",
                    }}
                    listMode="MODAL"
                    dropDownContainerStyle={{
                        borderWidth: 0,
                        borderRadius: 30,
                        backgroundColor: "#fff"
                    }}
                    labelStyle={{
                        color: "#000",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 50,
                        marginTop: 10,
                        marginBottom: 20
                    }}
                    />

            {addmore.map((item,index) => (
              <>

              <Divider  style={{marginBottom: 10}} />

             <Text style={{fontSize: 15, fontWeight: 500}}>Fee</Text>
              <DropDownPicker
                    open={openfee}
                    value={addmore[index]?.fee}
                    items={feeitems}
                    setOpen={setOpenfee}
                    onSelectItem={(item) => {
                      updatefee(index,item.value);
                    }}
                    setItems={setfeeItems}
                    placeholder={"Choose Fee"}
                    placeholderStyle={{
                        color: "#456A5A",
                    }}
                    listMode="MODAL"
                    dropDownContainerStyle={{
                        borderWidth: 0,
                        borderRadius: 30,
                        backgroundColor: "#fff"
                    }}
                    labelStyle={{
                        color: "#000",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 50
                    }}
                    />

      <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>School Fees Amount</Text>
        <TextInput
        keyboardType="numeric"
        mode="outlined"
        value={addmore[index]?.amount}
        onChangeText={(e) => updateamount(index,e)}
        />

        {accnt == "0" && (
          <>
          {user.uniqueid == "23cd37b8-9657-420c-b9d2-6651f5c080ce" || user.uniqueid == "c542417f-0671-439e-8f76-6c8ddb729f02" ? (
            <>

      <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Other Fees Total</Text>
        <TextInput
        keyboardType="numeric"
        mode="outlined"
        value={addmore[index]?.other}
        onChangeText={(e) => updateother(index,e)}
        />
 
            </>
          ) : (
            <>

      <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Other Fees Total</Text>
        <TextInput
        keyboardType="numeric"
        mode="outlined"
        value={addmore[index]?.other}
        onChangeText={(e) => updateother(index,e)}
        />

            <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Will Discount Affect Fee ?</Text>
              <DropDownPicker
                    open={opendscnt}
                    value={addmore[index]?.dscnt}
                    items={dscntitems}
                    setOpen={setOpendscnt}
                    onSelectItem={(item) => {
                      updatedscnt(index,item.value);
                    }}
                    setItems={setdscntItems}
                    placeholder={""}
                    placeholderStyle={{
                        color: "#456A5A",
                    }}
                    listMode="MODAL"
                    dropDownContainerStyle={{
                        borderWidth: 0,
                        borderRadius: 30,
                        backgroundColor: "#fff"
                    }}
                    labelStyle={{
                        color: "#000",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 50,
                        marginBottom: 20
                    }}
                    />
            
            </>
          )}
          </>
        )}

      {accnt == "1" && (
          <>
          <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Will Discount Affect Fee ?</Text>
              <DropDownPicker
                    open={opendscnt}
                    value={addmore[index]?.dscnt}
                    items={dscntitems}
                    setOpen={setOpendscnt}
                    onSelectItem={(item) => {
                      updatedscnt(index,item.value);
                    }}
                    setItems={setdscntItems}
                    placeholder={""}
                    placeholderStyle={{
                        color: "#456A5A",
                    }}
                    listMode="MODAL"
                    dropDownContainerStyle={{
                        borderWidth: 0,
                        borderRadius: 30,
                        backgroundColor: "#fff"
                    }}
                    labelStyle={{
                        color: "#000",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 50,
                        marginBottom: 20
                    }}
                    />
          
          </>
        )}


        {isdeleting ? (
          <ActivityIndicator />
        ) : (
          <>
          <Button icon="delete" onPress={()=> removefee(index,addmore[index]?.id)} textColor='red'>
           Remove Fee
          </Button>
          </>
        )}

         

        <Divider />

</>
          ))}


        <Button icon="plus" onPress={addmorefee} style={{marginVertical: 20}}>
           {addmore.length > 0 ? 'Add More Fees' : 'Add Fees'}
        </Button>

        <Text style={{fontSize: 15, fontWeight: 500}}>Academic Term</Text>
              <DropDownPicker
                    open={openacdemicterm}
                    value={acdemicterm}
                    items={acdemictermitems}
                    setOpen={setOpenacdemicterm}
                    setValue={setacdemicterm}
                    setItems={setacdemictermItems}
                    placeholder={"Choose Academic Term"}
                    placeholderStyle={{
                        color: "#456A5A",
                    }}
                    listMode="MODAL"
                    dropDownContainerStyle={{
                        borderWidth: 0,
                        borderRadius: 30,
                        backgroundColor: "#fff"
                    }}
                    labelStyle={{
                        color: "#000",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 50,
                        marginBottom: 20
                    }}
                    />

        <Text style={{fontSize: 15, fontWeight: 500, marginTop: 20}}>Academic Year</Text>
        <DropDownPicker
                    open={openyear}
                    value={year}
                    setValue={setYear}
                    items={yearitems}
                    setOpen={setOpenyear}
                    setItems={setyearItems}
                    placeholder={""}
                    placeholderStyle={{
                        color: "#456A5A",
                    }}
                    listMode="MODAL"
                    dropDownContainerStyle={{
                        borderWidth: 0,
                        borderRadius: 30,
                        backgroundColor: "#fff"
                    }}
                    labelStyle={{
                        color: "#000",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 50,
                        marginBottom: 20
                    }}
                    />

        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" style={{marginTop: 30}} /> : (
        <Button mode="contained" onPress={id == undefined ? createdata : updatedata} style={{marginTop: 30}}>
        Save
        </Button>
        )}

</Card.Content>
        </Card>
        )}
        </KeyboardAvoidingView>
        </ScrollView>


      </SafeAreaView>
    )
}

export default Updatefeemaster;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});