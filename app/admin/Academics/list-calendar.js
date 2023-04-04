import { Stack, useRouter } from 'expo-router';
import { FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useEffect } from 'react';
import { Card, Searchbar } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Calendar,CalendarList,Agenda}from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { selecttoken } from '../../../features/userinfoSlice';
import { schoolzapi } from '../../../components/constants';

function Listcalendar () {
    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();

    useEffect(()=> {
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
  
        axios.delete(schoolzapi+'/academicterms/'+id,
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
      <SafeAreaView>
        <Stack.Screen
         options={{
            headerTitle: 'Calendar List'
         }}
        />
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loaddata} />
        }
        >
        {isloading ? null : (
           <View style={{alignItems: 'flex-end', marginRight: 20, marginVertical: 20}}>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.push('/admin/Academics/create-calendar')}>
                        <Ionicons name='add-circle' size={22} color="#17a2b8"/>
                        <Text style={{fontSize: 18}}>New</Text>
                    </TouchableOpacity>
                </View>
        </View>)}

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
                        data={data}
                        renderItem={({item})=> <View><Text>Our List</Text></View> }
                        ItemSeparatorComponent={()=> (<View style={styles.separator} />)}
                        keyExtractor={item => item.id}
                />
                </Card.Content>
            </Card> 

        </ScrollView>
      </SafeAreaView>
    )
}

export default Listcalendar;

const styles = StyleSheet.create({

    separator: {
        height: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
});

