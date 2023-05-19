import { Redirect, Stack, useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, 
    TextInput, ToastAndroid, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken, setRoles,  setUserpermission, setPermissions, setMenu, setCurrency, selecttoken, setSchool, setStaffrole } from '../../features/userinfoSlice';
import { selectuser } from '../../features/userinfoSlice';
import { storeData, removeusertoken, gettokendata, selectusertoken } from '../../features/usertokenSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import { schoolzapi } from '../../components/constants';

function login() {
    
    const [email, setemail] = useState();
    const [password, setpassword] = useState();
    const [issumit, Setsubmiitting] = useState(false);
    const [googlesinin, disablegooglesinin] = useState(false);
    const emailref = useRef();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(selectuser);
    const token = useSelector(selecttoken);

    //console.log("user",user);

    

    useEffect(()=> {
        emailref.current.focus();
    },[]);

    useFocusEffect(() => {
        if(user !== null){
            router.replace("/admin/");
        }    
    });


    

    const cleartoken = async () => {
        //AsyncStorage.clear()
        //await AsyncStorage.setItem("user", "ogua lamere")
        const jsonValue = await AsyncStorage.getItem("user")
        console.log("user 1",jsonValue)
        console.log("user 2",user)
        console.log("user 3",JSON.parse(user))
    }

    const Userlogin = async () => {

        Setsubmiitting(true);

        const formdata = {
            email: email,
            password: password
        }

        axios.post(schoolzapi+'/auth-login',
        formdata,
        {
            headers: {Accept: 'application/json'}
        })
          .then(async (response) => {

            if(response.data.error){
               // ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
                alert(response.data.message);
                Setsubmiitting(false);
            }else{
                
                showMessage({
                    message: 'Login Successfully!',
                    type: "success",
                    position: 'bottom',
                });

              //  await AsyncStorage.setItem('token', response.data.token);
               
                dispatch(setUser(response.data.user));
                dispatch(setToken(response.data.token));
                dispatch(setRoles(response.data.roles));
                dispatch(setUserpermission(response.data.userpermission));
               // dispatch(setPermissions(response.data.permissions));
                dispatch(setCurrency(response.data.currency));
                dispatch(setSchool(response.data.school));
                dispatch(setStaffrole(response.data.staffrole));
                

                Setsubmiitting(false);
                router.push('/admin/');

            }

          })
          .catch(function (error) {
            Setsubmiitting(false);
            console.log(error);
            //console.log(schoolzapi+'/auth-login');
          });
        
    }

    return (
      <SafeAreaView>
        <Stack.Screen options={{
            headerShown: false
        }} />

        <ScrollView style={styles.maincontainer}>

            <View style={styles.formtitle}>
                <Text style={styles.logintext}>Login User</Text>
                <Text>
                    <Ionicons name="person" size={13} style={{marginRight: 5}} />Parent Login
                    </Text>
            </View>
            <View style={styles.formcontainer}>
                <View style={styles.formgroup}>
                    <Text>Email or Student ID</Text>
                    <View style={styles.inputextcontainer}>
                        <Ionicons name="mail" style={styles.formgroundinputicon} size={20} color="#fff" />
                       <TextInput ref={emailref} name="email" onChangeText={ (e) => setemail(e) } style={styles.formgroundinput} id="email" placeholder='Enter Email or Student ID' />
                    </View>
                </View>

                <View style={styles.formgroup}>
                    <Text>Password</Text>
                    <View style={styles.inputextcontainer}>
                        <Ionicons name="key-outline" style={styles.formgroundinputicon} size={20} color="#fff" />
                       <TextInput name="password" secureTextEntry={true} id="password" onChangeText={(e) => setpassword(e)} placeholder='Enter Password' style={styles.formgroundinput} />
                    </View>
                </View>

                <TouchableOpacity style={styles.loginbtn} onPress={Userlogin}>
                    {issumit ? <ActivityIndicator size="large" color="#fff" /> : <Text style={styles.loginbtntext}>Login</Text>}
                </TouchableOpacity>

                <Text style={styles.forgotpassword} onPress={cleartoken}>Forgot Password ?</Text>
                
                <TouchableOpacity style={styles.loginwithgoogle}>
                    <Text style={styles.logingoogletext}>
                        <Ionicons name="logo-google" size={20} color="red" /> Login with google
                    </Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
      </SafeAreaView>
    )
}

export default login;

const styles = StyleSheet.create({
    loginwithgoogle: {
        backgroundColor: '#1782b6',
        padding: 10,
        alignItems: 'center',
        marginTop: 20
    },
    logingoogletext: {
        fontSize: 20,
        color: '#fff',
        //textAlign: 'center'
    },
    maincontainer: {
       marginTop: 90
    },
    formtitle: {
        flexDirection:'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    logintext: {
        fontSize: 35,
        fontWeight: 600,
        color: '#1782b6'
    },
    loginparent: {
        
    },
    formcontainer: {
        margin: 20,
    },

    formgroup: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    inputextcontainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginVertical: 10,
        backgroundColor: '#ccc',
    },
    formgroundinputicon: {
        marginRight: 10,
        marginLeft: 10,
    },
    formgroundinput: {
        flex: 1,
        flexWrap: 'wrap',
        color: '#fff',
        fontSize: 18,
        padding: 10
    },

    logo: {
        width: 150,
        height: 20,
        marginLeft: 10,
    },
    loginbtn: {
        backgroundColor: '#1782b6',
        padding: 10,
        textAlign: 'center',
    },

    loginbtntext: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center'
    },
    forgotpassword: {
        textAlign: 'right',
        fontWeight: 500,
        marginVertical: 20,
        color: '#1782b6'
    }
});
