import { Stack, useRouter } from 'expo-router';
import { FlatList,Image, Platform, RefreshControl, SafeAreaView,
   ScrollView, StyleSheet, Text, TouchableOpacity, 
   View, DeviceEventEmitter } from 'react-native'
import { useEffect } from 'react';
import { Card, Dialog, List, Menu, Portal,Button, Provider, Searchbar, Chip } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import * as Imagepicker from 'expo-image-picker';
import { schoolzapi } from '../constants';
import { selecttoken } from '../../features/userinfoSlice';
import Promotestudentlist from '../../lists/Promotestudentlist';
import DropDownPicker from 'react-native-dropdown-picker';

function Promotestudent () {

    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [stclass, setStclass] = useState([]);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [visible, setVisible] = useState(0);
    const [showdialog, setShowdialog] = useState(false);
    const showDialog = () => setShowdialog(true);
    const hideDialog = () => setShowdialog(false);
    const [showsnakbar, setShowsnakbar] = useState(false);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    

    useEffect(()=> {
      // loadstudents();
       loadclasses();
    },[]);

    const loadata = () => {

      setLoading(true);
      axios.get(schoolzapi+'/student-info',
      {
          headers: {Accept: 'application/json',
          Authorization: "Bearer "+token
      }
      })
        .then(function (response) {
          setData(response.data.data);
          setFilterdata(response.data.data);
          setLoading(false);

          //console.log(data);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
        });
  }

    const loadstudents = () => {

      setLoading(true);
      axios.get(schoolzapi+'/student-info-by-class/'+value,
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


    const loadclasses = () => {
        setLoading(true);
        axios.get(schoolzapi+'/student-classes',
        {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+token
        }
        })
          .then(function (response) {
            console.log(response.data.data);
            loaddropdown(response.data.data);
            setLoading(false);
          })
          .catch(function (error) {
            console.log(error);
            setLoading(false);
          });
    }

    const loaddropdown = (studclass) => {
            
      const mddatas = studclass;
      
      let mdata = [
        { label: "All", value: "All"},
        { label: "Completed", value: "COMPLETED"}
      ];

       mddatas.map(item =>  mdata.push({ label: item?.name, value: item?.id}))
      
      setItems(mdata);

      //console.log(items);
      
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
      <SafeAreaView>
        <Stack.Screen
         options={{
            headerTitle: 'Promote Student'
         }}
        />
          {/* <Chip icon="info" selected showSelectedOverlay>Begin from the highest class to the lowers</Chip> */}
               <View style={{marginHorizontal: 20}}>

               
               <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    onChangeValue={loadstudents}
                    placeholder={"Students Class"}
                    placeholderStyle={{
                        color: "#456A5A",
                    }}
                    listMode="MODAL"
                    dropDownContainerStyle={{
                        borderWidth: 0,
                        borderRadius: 30,
                        backgroundColor: "#fff"
                    }}
                    labelStyle={{
                        color: "#456A5A",
                    }}
                    listItemLabelStyle={{
                        color: "#456A5A",
                    }}
                    style={{
                        borderWidth: 1,
                        //backgroundColor: "#F5F7F6",
                        minHeight: 40,
                        marginTop: 20
                    }}
                    />
                </View>

            <Searchbar
                placeholder='Search....'
               onChangeText={(text) => searchFilterFunction(text)}
               mode="outlined"
                value={search}
            />

        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loadata} />
        }
        >
            <Card>
                <Card.Content>
                
                <FlatList
                    data={filterdata}
                    renderItem={({item})=> <Promotestudentlist classdata={items} item={item} /> }
                    ItemSeparatorComponent={()=> <View style={styles.separator} />}
                      contentContainerStyle={{
                         marginBottom: 200
                    }}
                    keyExtractor={item => item.id}
                />
                </Card.Content>
            </Card> 

        </ScrollView>
      </SafeAreaView>
      </Provider>
    )
}

export default Promotestudent;

const styles = StyleSheet.create({

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

