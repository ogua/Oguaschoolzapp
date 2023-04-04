import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Card, Chip, List, Menu, Provider, Searchbar, TextInput } from 'react-native-paper';
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

        loaddata();

    },[]);


    const loaddata = () => {

        axios.get(schoolzapi+'/academicyear',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            setAcadmicterm(response.data.data);
            setfilteritem(response.data.data);
            setLoading(false);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }

    const updatedatastatus = (id,status) => {

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

    const deletedata = (id) => {
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
          setfilteritem(newData);
          setAcadmicterm(newData);
          loaddata();
          //setLoading(false);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
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
      <SafeAreaView >
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loaddata} />
        }
        >
        <Stack.Screen
         options={{
            headerTitle: 'Academic Year'
         }}
         />
            
            {isloading ? null : (

                <View style={{alignItems: 'flex-end', marginRight: 20, marginVertical: 20}}>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.push('/admin/Academics/create-academic-term')}>
                            <Ionicons name='add-circle' size={22} color="#17a2b8"/>
                            <Text style={{fontSize: 18}}>New</Text>
                        </TouchableOpacity>
                    </View>
               </View>
            )}
           

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

                       {/* <TouchableOpacity style={{backgroundColor: '#ccc', padding: 10}}>
                            <Text>item 1</Text>
                        </TouchableOpacity> */}
                </Card.Content>
            </Card> 
        </ScrollView>
      </SafeAreaView>
      </Provider>
    )
}


export default Academicyear;

const styles = StyleSheet.create({

    separator: {
        height: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
});
