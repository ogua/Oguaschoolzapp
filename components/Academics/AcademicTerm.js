import { Stack, useRouter } from 'expo-router';
import { Alert, DeviceEventEmitter, FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, Button, Card, Chip, FAB, List, Menu, Provider, Searchbar, TextInput } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useEffect, useState } from 'react';
import { schoolzapi } from '../constants';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selecttoken } from '../../features/userinfoSlice';
import Academiclistitem from './Academiclistitem';
import { SwipeListView } from 'react-native-swipe-list-view';
import Academictermlist from '../../lists/Academictermlist';

function Academicterm ({navigation}) {
    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(false);
    const [academicterm, setAcadmicterm] = useState([]);
    const [filterterm, setFilterterm] = useState([]);
    const router = useRouter();
    const[refreshing, setRefreshing] = useState(true);

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

        axios.get(schoolzapi+'/academicterms',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {

            setLoading(false);
            
            if(response.data.planexpire){
              alert(response.data.planexpire);
            }

            setAcadmicterm(response.data.data);
            setFilterterm(response.data.data);
            
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }


    const sdeletedata = (id) => {

      setLoading(true);

      console.log(id);
      axios.delete(schoolzapi+'/academicterms/'+id,
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          const newData = academicterm.filter((item) => item.id != id);
          setFilterterm(newData);
          setAcadmicterm(newData);
          
          setLoading(false);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
    }

    const searchFilterFunction = (text) => {

        if (text) {
            
          const newData = academicterm.filter(function (item) {
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilterterm(newData);
          setSearch(text);
        } else {
          setFilterterm(academicterm);
          setSearch(text);
        }
    };

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
                  axios.delete(schoolzapi+'/academicterms/'+id,
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

                      const newData = academicterm.filter((item) => item.id != id);
                      setFilterterm(newData);
                      setAcadmicterm(newData);
                      
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

    return (
      <Provider>
      <SafeAreaView style={{flexGrow: 1}}> 
        <ScrollView>
        <Stack.Screen
         options={{
            headerTitle: 'Academic Term',
          //   headerRight: ()=>(
          //     <TouchableOpacity style={{flexDirection: 'row', marginRight: 10}} onPress={()=> router.push('/admin/Academics/create')}>
          //         <Ionicons name='add-circle' size={22} color="#17a2b8"/>
          //         <Text style={{fontSize: 18}}>New</Text>
          //     </TouchableOpacity>
          // )
         }}
         />
  
            <>

            <View>
                <Searchbar
                    placeholder='Search....'
                    onChangeText={(text) => searchFilterFunction(text)}
                    value={search}
                />
            </View>
            
            <Card>
                <Card.Content>

          {isloading ? <ActivityIndicator size="large" /> : (

          

                    <FlatList
                        data={filterterm}
                        initialNumToRender={5}
                        refreshControl={
                          <RefreshControl refreshing={isloading} onRefresh={loaddata} />
                         }
                        refreshing={true}
                        renderItem={({item})=> <Academictermlist deletedata={deletedata} item={item} /> }
                        ItemSeparatorComponent={()=> (<View style={styles.separator} />)}
                        keyExtractor={item => item.id}
                    />

                        )}
                </Card.Content>
            </Card> 
            </>
        </ScrollView>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={()=> router.push('/admin/Academics/create')}
        />
      </SafeAreaView>
      </Provider>
    )
}


export default Academicterm;

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
    rowBack: {
      alignItems: 'center',
      backgroundColor: '#ccc',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 30
    },
});