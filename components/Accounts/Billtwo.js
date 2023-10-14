import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import {  Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { ActivityIndicator, Avatar, Button, Card, Divider, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
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
import { selectaccstatus, selecttoken, selectuser } from '../../features/userinfoSlice';
import { oguaschoolz, schoolzapi } from '../constants';
import { Linking } from 'react-native';

function Billtwo({stclass,term,year,studentid}) {

    const token = useSelector(selecttoken);
    const [amount, setamount] = useState("0");
    const [ofee, setofee] = useState("0");

    const [ismail, setismail] = useState(false);
    const [issms, setissms] = useState(false);


    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);

    const [addmore,setaddmore] = useState([]);
    const [SubTotal, setSubTotal] = useState(0);
    const [Arrears, setArrears] = useState(0);
    const [Credit, setCredit] = useState(0);
    const [Discount, setDiscount] = useState(0);
    const [Total, setTotal] = useState(0);

    const user = useSelector(selectuser);
    const accnt = useSelector(selectaccstatus);

    const [openfee, setOpenfee] = useState(false);
    const [fee, setfee] = useState("");
    const [feeitems, setfeeItems] = useState([]);


    const router = useRouter();
    const {id} = useSearchParams();

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");
      loaddata();
    },[]);


     function getfee() {

        return axios.get(schoolzapi+'/schoolfees',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }

     function getdata() {
        stclass,term,year
        return axios.get(`${schoolzapi}/student-billing/${stclass}/${studentid}/${term}/${year}/${user?.uniqueid}`,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }

     const sendmail = () => {
      setismail(true);
      
      axios.get(`${schoolzapi}/send-student-bill-mail/${term}/${year}/${studentid}/${stclass}/${user?.uniqueid}`,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
      .then(function (results) {
        showMessage({
          message: 'Mail sent Successfully!',
          type: "success",
          position: 'bottom',
        });
          
        setismail(false);
      }).catch(function(error){
        setismail(false);
          
      });
  }

  const sendsms = () => {
    setissms(true);
    
    axios.get(`${schoolzapi}/send-student-bill-sms/${term}/${year}/${studentid}/${stclass}/${user?.uniqueid}`,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
    .then(function (results) {
      showMessage({
        message: 'Mail sent Successfully!',
        type: "success",
        position: 'bottom',
      });
        
      setissms(false);
    }).catch(function(error){
      setissms(false);
        
    });
}


const download = () => {
  let url = `${oguaschoolz}/view-bill/${term}/${year}/${studentid}/${stclass}/${user?.uniqueid}`;
  Linking.openURL(url);
}


     const loaddata = () => {
        setLoading(true);
        
        Promise.all([getfee(),getdata()])
        .then(function (results) {
            ///setLoading(false);
            const fee = results[0];
            loadfee(fee.data.data);

            const data = results[1];
            setaddmore([]);
            setSubTotal(data.data.bill.subtotal);
            setArrears(data.data.bill.arrears);
            setCredit(data.data.bill.credit);
            setDiscount(data.data.bill.dscnt);
            setTotal(data.data.bill.totalamount);
            loadfeedata(data.data.bill);
            

        }).catch(function(error){
            setLoading(false);
            const acct = error[0];
            const studeclass = error[1];
            
        });
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

    const loadfeedata = (data) => {

      const mddatas = data.fees;
        
        let mdata = [];
         mddatas.map(item =>  mdata.push({id: parseInt(item?.id), fee: parseInt(item?.fee), amount: item?.feeamount, qty: item?.qty, dscnt: item?.discnt, total: item?.total}));
         setaddmore(mdata);
         console.log("data2",mdata);
      
    }


    const savebill = () => {

        if(SubTotal == ""){
          alert('SubTotal cant be empty');
          return;
        }

        if(Total == ""){
            alert('Total cant be empty');
            return;
        }

      setIssubmitting(true);
        const formdata = {
          term,
          year,
          stclass,
          student: studentid,
          fees: addmore,
          subtotal: SubTotal,
          arrears: Arrears ?? 0,
          credit: Credit ?? 0,
          dscnt: Discount ?? 0,
          total: Total
        }

        axios.post(schoolzapi+'/student-billing',
        formdata,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {

            console.log(response.data); 

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
            
           // DeviceEventEmitter.emit('subject.added', {});
           // router.back();
           
            
          })
          .catch(function (error) {
            setIssubmitting(false);
            console.log("error",error);
          });
    }


  const addmorefee = () => {
    //const newfee = [...addmore,Math.random(0,10)];
    const newfee = [...addmore,{id: 0, fee: "", amount: "0", qty: "1", dscnt: "0", total: "0"}];
    console.log("newfee",newfee);
    setaddmore(newfee);
   }

   const removefee = (index) => {
    const updatedItems = [...addmore];
    updatedItems.splice(index, 1);
    setaddmore(updatedItems);
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

  const getbalance = (index,amnt) => {

    const value = addmore.map((item,nindex) => {
      if(nindex === index){
        const myamnt = amnt == "" ? 0 : amnt;
        const total = parseInt(myamnt) * parseInt(item.qty);
        const mydcnt = parseInt(item.dscnt);

        if(user.uniqueid == "e6ddc0c0-2e7e-4735-bfe1-4ee02f53834f"){
          let totalpx = total - mydcnt;
          return {...item, amount: amnt == "" ? "" : amnt, total: `${totalpx}`};
        }else{
          let dscpx = (mydcnt/100)*total;
	    		let totalpx = total - dscpx;
          return {...item, amount: amnt == "" ? "" : amnt, total: `${totalpx}`};
        }

      }
      return item;
    });

    console.log("value",value);
    setaddmore(value);
    subAmount(value);
  }

  
  const updateqty = (index,qty) => {

    const value = addmore.map((item,nindex) => {
      if(nindex === index){
        const myamnt = qty == "" ? 1 : qty;
        const total = parseInt(myamnt) * parseInt(item.amount);
        const mydcnt = parseInt(item.dscnt);

        if(user.uniqueid == "e6ddc0c0-2e7e-4735-bfe1-4ee02f53834f"){
          let totalpx = total - mydcnt;
          return {...item, qty: qty == "" ? "" : `${qty}`, total: `${totalpx}`};
        }else{
          let dscpx = (mydcnt/100)*total;
	    		let totalpx = total - dscpx;
          return {...item, qty: qty == "" ? "" : `${qty}`, total: `${totalpx}`};
        }

      }
      return item;
    });

    setaddmore(value);
    subAmount(value);
  }


  const subAmount = (value) => {

    let totalSubAmount = 0;
    value.map((item,nindex) => {
      totalSubAmount+=Number(item.total);
    });
    console.log("totalSubAmount",totalSubAmount);
    setSubTotal(`${totalSubAmount}`);
    gettotal(totalSubAmount);
  }


  const gettotal = (totalSubAmount) => {
    let total = Number(totalSubAmount) + Number(Arrears) - Number(Credit);
    let dsc = Number(Discount);
		let dscpx = (dsc/100)*total;
		let totalpx = total - dscpx;
    console.log("totaltotalpx",totalpx);
    setTotal(`${totalpx}`);
  }

  
  const calculatedsc = (e) => {
    let total = Number(SubTotal) + Number(Arrears) - Number(Credit);
    let dsc = Number(e);
		let dscpx = (dsc/100)*total;
		let totalpx = total - dscpx;
    setTotal(`${totalpx}`);
    setDiscount(e);
}


const getarrears = (arrears) => {
  let total = Number(SubTotal) - Number(Credit) + Number(arrears);
  let dscpx = (Number(Discount)/100)*total;
	let totalpx = total - dscpx;
  setTotal(`${totalpx}`);
  setArrears(arrears);

}

const getCredit = (credit) => {
  let total = Number(SubTotal) - Number(credit) + Number(Arrears);
  let dscpx = (Number(Discount)/100)*total;
	let totalpx = total - dscpx;
  setTotal(`${totalpx}`);
  setCredit(credit);

}


const updatedsnt = (index,newvalue) => {
  const value = addmore.map((item,nindex) => {
    if(nindex === index){

      let unitpx = Number(item.amount);
      let  qty = Number(item.qty);
      let  dscnt = Number(newvalue);

        if(qty == 0 || qty == ""){
          return;
        }else{

          let total = Number(unitpx) * Number(qty);

          // check if its gracedew
        if(user.uniqueid == "e6ddc0c0-2e7e-4735-bfe1-4ee02f53834f"){
          let totalpx = total - dscnt;
          return {...item, dscnt: newvalue, total: `${totalpx}`};
        }else{

          let dscpx = (dscnt/100)*total;
          let totalpx = total - dscpx;
          return {...item, dscnt: newvalue, total: `${totalpx}`};
        }
        }

    }
    return item;
  });
      
  setaddmore(value);
  subAmount(value);
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
        <ScrollView style={{marginBottom: 30}}
        >
        <KeyboardAvoidingView
            behavior="height"
            >
        {isloading ? <ActivityIndicator size="large" color="#1782b6" /> : (
        <Card>

          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>

          <Button icon="download" onPress={download}>Download</Button>

            {ismail ? <ActivityIndicator /> : (
              <Button icon="mail" onPress={sendmail}>Mail</Button>
            )}

            {issms ? <ActivityIndicator /> : (
              <Button icon="mail" onPress={sendsms}>Sms</Button>
            )}

          </View>      

            {addmore.map((item,index) => (
              <>
              <Divider />
          <View style={{backgroundColor: '#fff', padding: 5, marginTop: 10}} key={item}>
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

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            
                <View>
                  <Text>Amount</Text>
                    <TextInput
                      keyboardType="numeric"
                      placeholder=''
                      mode="outlined"
                      value={addmore[index]?.amount}
                      onChangeText={(e) => getbalance(index,e)}
                  />
                </View>

                <View>
                  <Text>Qty</Text>
                    <TextInput
                      keyboardType="numeric"
                      placeholder=''
                      mode="outlined"
                      value={addmore[index]?.qty}
                      onChangeText={(e) => updateqty(index,e)}
                  />
                </View>

                
                <View>
                  <Text>Discount</Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder=''
                    mode="outlined"
                    value={addmore[index]?.dscnt}
                    onChangeText={(e) => updatedsnt(index,e)}
                />
                </View>
                
                
                <View>
                  <Text>Balance</Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder=''
                    mode="outlined"
                    value={addmore[index]?.total}
                    //onChangeText={(e) => updateamount(index,e)}
                />
                </View>
                

            </View>

            <Button icon="delete" onPress={()=> removefee(index)} textColor='red'>
             Remove Fee
            </Button>

          </View>
            <Divider />

              </>
          ))}


        <Button icon="plus" onPress={addmorefee} style={{marginVertical: 20}}>
           {addmore.length > 0 ? 'Add More Fees' : 'Add Fees'}
        </Button>

        <Divider />
        <Text>SubTotal</Text>   
        <TextInput
            keyboardType="numeric"
            placeholder='
            '
            mode="outlined"
            value={SubTotal}
            onChangeText={(e) => setSubTotal(e)}
        />

        <Text>Arrears</Text>
        <TextInput
            keyboardType="numeric"
            placeholder=''
            mode="outlined"
            value={Arrears}
            onChangeText={(e) => getarrears(e)}
        />

        <Text>Credit</Text>
        <TextInput
            keyboardType="numeric"
            placeholder=''
            mode="outlined"
            value={Credit}
            onChangeText={(e) => getCredit(e)}
        />

        <Text>Discount</Text>
        <TextInput
            keyboardType="numeric"
            placeholder=''
            mode="outlined"
            value={Discount}
            onChangeText={(e) => calculatedsc(e)}
        />

        <Text>Total</Text>
        <TextInput
            keyboardType="numeric"
            placeholder=''
            mode="outlined"
            value={Total}
            onChangeText={(e) => setTotal(e)}
        />


        {issubmitting ? <ActivityIndicator size="large" color="#1782b6" style={{marginTop: 30}} /> : (
        <Button mode="contained" onPress={savebill} style={{marginTop: 30}}>
        Save
        </Button>
        )}


        </Card>
        )}
        </KeyboardAvoidingView>
        </ScrollView>


      </SafeAreaView>
    )
}

export default Billtwo;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});