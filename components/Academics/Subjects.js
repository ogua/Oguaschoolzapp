import { Stack, useRouter } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter } from 'react-native'
import { useEffect } from 'react';
import { ActivityIndicator, Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, FAB } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { schoolzapi } from '../constants';
import { selecttoken } from '../../features/userinfoSlice';
import Subjectslist from '../../lists/subjectslist';

function Subjects () {
    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const [showdialog, setShowdialog] = useState(false);
    const showDialog = () => setShowdialog(true);
    const hideDialog = () => setShowdialog(false);
    const [showsnakbar, setShowsnakbar] = useState(false);


    

    useEffect(()=> {
      
      // DeviceEventEmitter.addListener("subject.added", (event)=>{
      //   console.log('how many time');
      //   loaddata();
      //   DeviceEventEmitter.removeAllListeners("event.test");
      // });

       loaddata();

    },[]);


    const loaddata = () => {
        setLoading(true);
        axios.get(schoolzapi+'/subject',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            console.log(response.data.data);
            setData(response.data.data);
            setFilterdata(response.data.data);
            setLoading(false);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }

    const deletedata = (id) => {

        setLoading(true);
  
        axios.delete(schoolzapi+'/subject/'+id,
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            const newData = data.filter((item) => item.id != id);
            setFilterdata(newData);
            setData(newData);
            setLoading(false);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }
  
      const searchFilterFunction = (text) => {
  
          if (text) {
              
            const newData = data.filter(function (item) {
              const itemData = item.name
                ? item.name.toUpperCase()
                : ''.toUpperCase();
              const textData = text.toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            setFilterdata(newData);
            setSearch(text);
          } else {
            setFilterdata(data);
            setSearch(text);
          }
      };

    return (
      <Provider>
      <SafeAreaView style={{flexGrow: 1}}>
        <Stack.Screen
        />
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={false} onRefresh={loaddata} />
        }
        >

         {isloading ? <ActivityIndicator size="large" /> : (
          <>
        
           {/* <View style={{marginVertical: 20}}>
                <View style={{flexDirection: 'row',justifyContent: 'flex-end', marginHorizontal: 20}}>
                    
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.push('/admin/Academics/create-subject')}>
                        <Ionicons name='add-circle' size={22} color="#17a2b8"/>
                        <Text style={{fontSize: 18}}>New</Text>
                    </TouchableOpacity>
                </View>
            </View> */}

            

            <Searchbar
                placeholder='Search....'
               onChangeText={(text) => searchFilterFunction(text)}
                value={search}
            />
            
            <Card>
                <Card.Content>
                <FlatList
                    data={filterdata}
                    renderItem={({item})=> <Subjectslist item={item} deletedata={deletedata} /> }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                         marginBottom: 10
                    }}
                    keyExtractor={item => item.id}
                />
                </Card.Content>
            </Card> 

            </>)}
        </ScrollView>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={()=> router.push('/admin/Academics/create-subject')}
        />

      </SafeAreaView>
      </Provider>
    )
}

export default Subjects;

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
    calendarWrapper: {
      padding: 0,
      margin: 0,
      height: '100%',
      width: '100%'
  }
});

