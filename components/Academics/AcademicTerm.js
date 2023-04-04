import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Card, Chip, List, Menu, Provider, Searchbar, TextInput } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { schoolzapi } from '../constants';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selecttoken } from '../../features/userinfoSlice';
import Academiclistitem from './Academiclistitem';

function Academicterm ({navigation}) {
    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [academicterm, setAcadmicterm] = useState([]);
    const [filterterm, setFilterterm] = useState([]);
    const router = useRouter();
    const[refreshing, setRefreshing] = useState(true);

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
            setAcadmicterm(response.data.data);
            setFilterterm(response.data.data);
            setLoading(false);
          })
          .catch(function (error) {
            setLoading(false);
            console.log(error);
          });
    }


    const deletedata = (id) => {

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
            headerTitle: 'Academic Term'
         }}
         />
            {isloading ? null : (
           <View style={{alignItems: 'flex-end', marginRight: 20, marginVertical: 20}}>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.push('/admin/Academics/create')}>
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
                        data={filterterm}
                        renderItem={({item})=> <Academiclistitem deletedata={deletedata} items={item} /> }
                        ItemSeparatorComponent={()=> (<View style={styles.separator} />)}
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


export default Academicterm;

const styles = StyleSheet.create({

    separator: {
        height: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
});