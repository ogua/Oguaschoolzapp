import { useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Card, Dialog, Divider, List, Menu, Portal, Snackbar, Text, TextInput } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { schoolzapi } from "../components/constants";
import axios from "axios";
import { useEffect } from "react";
import { showMessage } from "react-native-flash-message";
import { selecttoken } from "../features/userinfoSlice";
import { useSelector } from "react-redux";

function Billfeelist ({item,gettotal}) {

    const [visible, setVisible] = useState(false);
    const [fee, setfee] = useState(0);
    const [url, seturl] = useState("");
    const token = useSelector(selecttoken);
    const router = useRouter();

    useEffect(()=>{
        setfee(item.amount);
    },[])

    const paymntupd = (id) => {

        setVisible(true);
        const formdata = {
            id,
            amnt: fee,
        }

        axios.post(`${schoolzapi}/student-payment-update`,
        formdata,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        }).then(function (response) {

            showMessage({
                message: 'Info saved Successfully!',
                type: "success",
                position: 'bottom',
            });

            setVisible(false);
            gettotal();
            
          })
          .catch(function (error) {
            setVisible(false);
            console.log(error);
          });
    }

    const opaymntupd = (id) => {

        setVisible(true);
        const formdata = {
            id,
            amnt: fee,
        }

        axios.post(`${schoolzapi}/student-payment-oupdate`,
        formdata,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        }).then(function (response) {

            showMessage({
                message: 'Info saved Successfully!',
                type: "success",
                position: 'bottom',
            });

            setVisible(false);
            gettotal();
            
          })
          .catch(function (error) {
            setVisible(false);
            console.log(error);
          });
    }


    const tutionfeeupd = (id) => {

        setVisible(true);
        const formdata = {
            id,
            amnt: fee,
        }

        axios.post(`${schoolzapi}/student-payment-update-tutionfee`,
        formdata,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        }).then(function (response) {

            showMessage({
                message: 'Info saved Successfully!',
                type: "success",
                position: 'bottom',
            });

            setVisible(false);
            gettotal();
            
          })
          .catch(function (error) {
            setVisible(false);
            console.log(error);
          });
    }


    const apaymntupd = (id) => {

        setVisible(true);
        const formdata = {
            id,
            amnt: fee,
        }

        axios.post(`${schoolzapi}/student-payment-aupdate`,
        formdata,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        }).then(function (response) {

            showMessage({
                message: 'Info saved Successfully!',
                type: "success",
                position: 'bottom',
            });

            setVisible(false);
            gettotal();
            
          })
          .catch(function (error) {
            setVisible(false);
            console.log(error);
          });
    }



    const cpaymntupd = (id) => {

        setVisible(true);
        const formdata = {
            id,
            amnt: fee,
        }

        axios.post(`${schoolzapi}/student-payment-cupdate`,
        formdata,
        {
            headers: {Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer "+token
        }
        }).then(function (response) {

            showMessage({
                message: 'Info saved Successfully!',
                type: "success",
                position: 'bottom',
            });

            setVisible(false);
            gettotal();
            
          })
          .catch(function (error) {
            setVisible(false);
            console.log(error);
          });
    }
    
    

    return (
        <>
            <Text style={{fontSize: 20, fontWeight: 500, marginTop: 15}}>{item.fee}</Text>
                <TextInput
                    keyboardType="numeric"
                    placeholder='Amount'
                    mode="outlined"
                    value={fee}
                    onChangeText={(e) => setfee(e)}
                />

                {item.billtype == "credit" && (
                    <>
                    {visible ? <ActivityIndicator style={{marginTop: 10}} /> : (
                        <Button style={{marginTop: 10}} onPress={() => cpaymntupd(item.id)}>Save</Button>
                    )}
                    </>
                )}

                {item.billtype == "arrears" && (
                    <>
                    {visible ? <ActivityIndicator style={{marginTop: 10}} /> : (
                        <Button style={{marginTop: 10}} onPress={() => apaymntupd(item.id)}>Save</Button>
                    )}
                    </>
                )}

                {item.billtype == "other" && (
                    <>
                    {visible ? <ActivityIndicator style={{marginTop: 10}} /> : (
                        <Button style={{marginTop: 10}} onPress={() => opaymntupd(item.id)}>Save</Button>
                    )}
                    </>
                )}

                {item.billtype == "obill" && (
                    <>
                    {visible ? <ActivityIndicator style={{marginTop: 10}} /> : (
                        <Button style={{marginTop: 10}} onPress={() => tutionfeeupd(item.id)}>Save</Button>
                    )}
                    </>
                )}

                {item.billtype == "bill" && (
                    <>
                    {visible ? <ActivityIndicator style={{marginTop: 10}} /> : (
                        <Button style={{marginTop: 10}} onPress={() => paymntupd(item.id)}>Save</Button>
                    )}
                    </>
                )}
                
        
        </>
    )
}

export default Billfeelist;