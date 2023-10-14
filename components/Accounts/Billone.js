import axios from 'axios';
import { Redirect, Stack, useRouter, useSearchParams } from 'expo-router';
import { useState } from 'react';
import {  Alert, DeviceEventEmitter, KeyboardAvoidingView, PermissionsAndroid, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { ActivityIndicator, Avatar, Button, Card, Divider, TextInput } from 'react-native-paper';
import { Modal, Portal, Switch, Provider, Dialog } from 'react-native-paper';
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
import { selectaccstatus, selectcurrency, selecttoken, selectuser } from '../../features/userinfoSlice';
import { oguaschoolz, schoolzapi } from '../constants';
import { LocaleConfig, Calendar } from "react-native-calendars";
import Billfeelist from '../../lists/Billfeelist';
import { Linking } from 'react-native';

function Billone({stclass,term,year,studentid}) {

    const token = useSelector(selecttoken);
    const [amount, setamount] = useState("0");
    const [ofee, setofee] = useState("0");

    const [ismail, setismail] = useState(false);
    const [issms, setissms] = useState(false);
    
    const [isloading, setLoading] = useState(false);
    const [issubmitting, setIssubmitting] = useState(false);

    const [addcredit,setaddcredit] = useState([]);
    const [addarrear,setaddarrear] = useState([]);
    const [addbill,setaddbill] = useState([]);
    
    const [addmore,setaddmore] = useState([]);
    const [SubTotal, setSubTotal] = useState(0);
    const [Arrears, setArrears] = useState(0);
    const [Credit, setCredit] = useState(0);
    const [bill, setbill] = useState(0);
    const [Discount, setDiscount] = useState(0);
    const [Total, setTotal] = useState(0);

    const user = useSelector(selectuser);
    const accnt = useSelector(selectaccstatus);
    const currency = useSelector(selectcurrency);

    const [openfee, setOpenfee] = useState(false);
    const [fee, setfee] = useState("");
    const [feeitems, setfeeItems] = useState([]);


    const router = useRouter();
    const {id} = useSearchParams();

    const [openyear, setOpenyear] = useState(false);
    const [myear, setYear] = useState("");
    const [yearitems, setyearItems] = useState([]);

    const [startdate, setstartdate] = useState();
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const [showdialogstart, setShowdialogstart] = useState(false);
    const [selecteddate, setSelecteddate] = useState(false);
    const hideDialog = () => setShowdialog(false);

  

    useEffect(()=>{
      DeviceEventEmitter.removeAllListeners("event.test");
      loaddata();
      loadademicterm();
    },[]);


    const loadademicterm = () => {
            
        const mddatas = [0,1,2,3,4,5];
        let mdata = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
    
        mdata.push(
          { label: `${currentYear + 1} - ${currentYear + 2}`, value: currentYear + 1}
          );
    
        mddatas.map(item =>  mdata.push(
        { label: `${currentYear - item} - ${currentYear - item + 1}`, value: currentYear - item}
        ))
        setyearItems(mdata);
    }




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
        return axios.get(`${schoolzapi}/student-billing-one/${stclass}/${studentid}/${term}/${year}/${user?.uniqueid}`,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        });
     }


     const sendmail = () => {
      setismail(true);
      
      axios.get(`${schoolzapi}/send-student-bill-zero-mail/${term}/${year}/${studentid}/${stclass}/${user?.uniqueid}`,
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
    
    axios.get(`${schoolzapi}/send-student-bill-zero-sms/${term}/${year}/${studentid}/${stclass}/${user?.uniqueid}`,
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
  let url = `${oguaschoolz}/view-bill-zero/${term}/${year}/${studentid}/${stclass}/${user?.uniqueid}`;
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
            loadcredit(data.data.credit);
            loadarrears(data.data.arrears);
            loadbill(data.data.bill);

            console.log("bill",data.data.bill);

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

    const loadcredit = (data) => {

      const mddatas = data;
      let credit = 0;
        
        let mdata = [];
        setaddcredit([]);

         mddatas.map((item,nindex) => {
            credit+=Number(item.credit);
            mdata.push({id: parseInt(item?.id), billtype: "credit", fee: `${item?.schoolfee.title} - Balance`, amount: item?.credit});
        });

        setCredit(credit);
        setaddcredit(mdata);

        console.log("credit",credit);
      
    }


    const loadarrears = (data) => {

        const mddatas = data;
        let arrears = 0;
          
          let mdata = [];
          setaddarrear([]);
  
           mddatas.map((item,nindex) => {
              arrears+=Number(item.arrears);
              mdata.push({id: parseInt(item?.id), billtype: "arrears", fee: `${item?.schoolfee.title} - Arrears`, amount: item?.arrears});
          });
  
          setArrears(arrears);
          setaddarrear(mdata);
  
          console.log("arrears",arrears);
        
    }

    const loadbill = (data) => {

        const mddatas = data;
        let bill = 0;
          
          let mdata = [];
          setaddbill([]);
  
           mddatas.map((item,nindex) => {
            bill+=Number(item.feesubtotal);

             if(Number(item.otherfee) > 0){
                mdata.push({id: parseInt(item?.id), billtype: "obill", fee: `${item?.schoolfee.title}`, amount: item?.tutionfee});
                mdata.push({id: parseInt(item?.id), billtype: "other", fee: "Other Fees", amount: item?.otherfee});
             }else{
                mdata.push({id: parseInt(item?.id), billtype: "bill", fee: `${item?.schoolfee.title}`, amount: item?.tutionfee});
             }
          });
  
          setbill(bill);
          setaddbill(mdata);
  
          console.log("bill",bill);
          gettotal();
        
    }


    const gettotal = () => {
        let total = Number(Arrears) + Number(bill) - Number(Credit);
        setTotal(`${total}`);
        console.log("total",total);
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


    return (
        <Provider>
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
        

            {addcredit.map((item,index) => (
              <>
              <Divider />
          
              <Billfeelist item={item} gettotal={gettotal} />

              </>
            ))}

            {addarrear.map((item,index) => (
              <>
              <Divider />
              <Billfeelist item={item} gettotal={gettotal} />

              </>
            ))}


            {addbill.map((item,index) => (
              <>
              <Divider />
              <Billfeelist item={item} gettotal={gettotal} />
              </>
            ))}

        <Text style={{fontSize: 15, fontWeight: 500, marginVertical: 20}}>Total: {currency}{Total}</Text>

        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
              <Text>Next Term Begins </Text>
              <Button icon="calendar-range" onPress={() => setShowdialogstart(true)}> select Date</Button>
          </View>

          <Portal>
                <Dialog visible={showdialogstart} onDismiss={hideDialog}>
                    <Dialog.Content>

                    <Calendar
                       visible={true}
                        onDayPress={(day) => {
                            setSelecteddate(day.dateString);
                            setstartdate(day.dateString);
                            setShowdialogstart(false);
                        }}
                        markedDates={{
                            [selecteddate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                        }}
                        enableSwipeMonths={true}
                    />

                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Cancel</Button>
                    </Dialog.Actions>
                </Dialog>
             </Portal>


            <TextInput
                value={startdate}
                onChange={(d) => setstartdate(d)}
                mode="outlined"
                style={{marginBottom: 20}}
            />  
        

        <Text>Academic Year</Text>
        <DropDownPicker
            open={openyear}
            value={myear}
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
        <Button mode="contained" onPress={savebill} style={{marginTop: 30}}>
        Save
        </Button>
        )}


        </Card>
        )}
        </KeyboardAvoidingView>
        </ScrollView>


      </SafeAreaView>
      </Provider>
    )
}

export default Billone;

const styles = StyleSheet.create({
    Forminput: {
        marginBottom: 20
    },
    Forminputhelp: {
        marginBottom: 20
    }
});