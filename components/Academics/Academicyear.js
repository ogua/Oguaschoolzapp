import { Stack, useRouter } from 'expo-router';
import { Alert, DeviceEventEmitter, FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import {  TouchableOpacity } from 'react-native-gesture-handler';
import {ActivityIndicator, Button, Card, Chip, FAB, List, Menu, Provider, Searchbar, TextInput } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { schoolzapi } from '../constants';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selecttoken, selectuser } from '../../features/userinfoSlice';
import Academiclistitem from './Academiclistitem';
import Academicyearlistitem from './Academicyearlistitem';

function Academicyear () {

    const token = useSelector(selecttoken);
    const user = useSelector(selectuser);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [academicyear, setAcadmicterm] = useState(null);
    const [filteritem, setfilteritem] = useState([]);
    const router = useRouter();
    const[refreshing, setRefreshing] = useState(true);

    useEffect(()=> {

      // DeviceEventEmitter.addListener("subject.added", (event)=>{
      //   loaddata();
      //   DeviceEventEmitter.removeAllListeners("event.test");
      // });

        loaddata();

    },[]);


    const loaddata = () => {

      setLoading(true);
      
      axios.get(schoolzapi+'/academicyear',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {

            setLoading(false);
                      
            if(response.data.planexpire){
              alert(response.data.planexpire);
              return;
            }

            setAcadmicterm(response.data.data);
            setfilteritem(response.data.data);

          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }


    const updatedatastatus = (id,status,termname) => {

      return Alert.alert(
          "Are your sure?",
         `You want to proceed with the action`,
          [
            {
              text: "No",
            },
            {
              text: `Yes Proceed`,
              onPress: () => {

                setLoading(true);
      
                  const formdata = {
                    status: status,
                    uniqueid: user.uniqueid
                  }

                  axios.post(schoolzapi+'/academicyear-update-status/'+id,
                  formdata,
                  {
                      headers: {Accept: 'application/json',
                      Authorization: "Bearer "+token
                  }
                  })
                    .then(function (response) {
                      console.log(response.data);
                      loaddata();
                      //setLoading(false);
                    })
                    .catch(function (error) {
                      setLoading(false);
                      console.log(error);
                    });
                  
              },
            },
          ]
        );

  }

    const supdatedatastatus = (id,status) => {

      setLoading(true);
      
      const formdata = {
        status: status,
        uniqueid: user.uniqueid
      }

      axios.post(schoolzapi+'/academicyear-update-status/'+id,
      formdata,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          console.log(response.data);
          loaddata();
          //setLoading(false);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }

    const sdeletedata = (id) => {
      setLoading(true);
      console.log(id);
      axios.delete(schoolzapi+'/academicyear/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {

          console.log(response.data);

          const newData = academicyear.filter((item) => item.id != id);
          
          setAcadmicterm(newData);
          setfilteritem(newData);
         // loaddata();
          setLoading(false);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }

    const deletedata = (id,delname) => {

      return Alert.alert(
          "Are your sure?",
          "You want to delete "+delname+" info",
          [
            {
              text: "No",
            },
            {
              text: "Yes Delete",
              onPress: () => {
                  setLoading(true);
                  axios.delete(schoolzapi+'/academicyear/'+id,
                  {
                      headers: {Accept: 'application/json',
                      Authorization: "Bearer "+token
                  }
                  })
                    .then(function (response) {
                      const newData = academicyear.filter((item) => item.id != id);
                      setfilteritem(newData);
                      setAcadmicterm(newData);
                      setLoading(false);
                    })
                    .catch(function (error) {
                      setLoading(false);
                      console.log(error);
                    });
              },
            },
          ]
        );

  }


    const searchFilterFunction = (text) => {

        if (text && filteritem.length > 0) {
            
          const newData = academicyear.filter(function (item) {
            const itemData = item.term
              ? item.term.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setfilteritem(newData);
          setSearch(text);
        } else {
           setfilteritem(academicyear);
           setSearch(text);
        }
    };


    return (
      <Provider>
      <SafeAreaView style={{flexGrow: 1}}>
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={false} onRefresh={loaddata} />
        }
        >
        <Stack.Screen
         options={{
            headerTitle: 'Academic Year'
         }}
         />
            
            {isloading ? <ActivityIndicator size="large" /> : (
              <>

                {/* <View style={{alignItems: 'flex-end', marginRight: 20, marginVertical: 20}}>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.push('/admin/Academics/create-academic-term')}>
                            <Ionicons name='add-circle' size={22} color="#17a2b8"/>
                            <Text style={{fontSize: 18}}>New</Text>
                        </TouchableOpacity>
                    </View>
               </View> */}
           

            <View>
               <Searchbar
                    placeholder='Search....'
                    onChangeText={(text) => searchFilterFunction(text)}
                    value={search}
                />
            </View>
            
            <Card>
                <Card.Content>
                    

                        <FlatList
                          data={filteritem}
                          renderItem={({item})=> <Academicyearlistitem loaddata={loaddata} updatedatastatus={updatedatastatus} deletedata={deletedata} items={item} /> }
                          ItemSeparatorComponent={()=> <View style={styles.separator} />}
                          contentContainerStyle={{
                              marginBottom: 10
                          }}
                          keyExtractor={item => item.id}
                      />

                                       
                </Card.Content>
            </Card> 
            </> )}
        </ScrollView>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={()=> router.push('/admin/Academics/create-academic-term')}
        />
      </SafeAreaView>
      </Provider>
    )
}


export default Academicyear;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
    separator: {
        height: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
});
