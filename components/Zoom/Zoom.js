import React, { useEffect, useState } from 'react';
import ZoomUs from "react-native-zoom-us";
import { Button, Alert } from "react-native";


const CLIENT_KEY = 'FBVoBsHcSsW5qMn2X-Abeg';
const CLIENT_SECRET = 'SBahAeK1jysAhM0Bdsfq5WVZhYVoqlXxSNkI';

const Zoom = () => {
  const [isInitialized, setIsInitialized] = useState(false);
   useEffect(() => {
     (async () => {
       try{
         const message = await ZoomUs.initialize({
           clientKey: 'FBVoBsHcSsW5qMn2X-Abeg',
           clientSecret: 'SBahAeK1jysAhM0Bdsfq5WVZhYVoqlXxSNkI',
           domain: 'zoom.us'
         });
         console.log('message is ', message);
         setIsInitialized(true);
       }catch(error){
         Alert.alert('error is ', error.toString());
       }

     })();
   },[]);


   return (
     <Button title={"Join a meeting"} disabled={!isInitialized}/>
   )
};

export default Zoom;