import { Redirect } from 'expo-router';
import { View } from 'react-native-web';

 function index () {
   return <Redirect href="/login" />;
}

export default index;
