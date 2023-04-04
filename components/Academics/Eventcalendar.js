import { Stack, useRouter } from 'expo-router';
import { FlatList,Image, Platform,Button, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useEffect } from 'react';
import { Card, Searchbar } from 'react-native-paper';
import { useState } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Calendar,CalendarList,Agenda}from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { selecttoken } from '../../features/userinfoSlice';
import { schoolzapi } from '../constants';
import * as Imagepicker from 'expo-image-picker';

function Eventcalendar () {
    const token = useSelector(selecttoken);
    const [search, setSearch] = useState();
    const [isloading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filterdata, setFilterdata] = useState([]);
    const router = useRouter();
    const [markeddates, setMakeddates] = useState({})
    const [image, setimage] = useState();


    // useEffect(async ()=> {

    //   if(Platform.OS !== 'web'){
    //     const status = await Imagepicker.requestMediaLibraryPermissionsAsync();
    //     if(status !=='granted'){
    //       alert('Permission denied');
    //     }
    //   }

    // },[]);

    useEffect(()=> {
       loaddata();
    },[]);


    const pickimage = async () => {
        let result =  await Imagepicker.launchImageLibraryAsync({
          mediaTypes: Imagepicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4,3],
          quality: 1
        });

        console.log(result);

        if(!result.canceled){
          setimage(result.assets[0].uri);
        }
    }


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


    const setmarkeddates = () =>{

      filterdata.map((date) => function(){
        var mydate = date.created_at;
        setMakeddates({
          ...markeddates,
          mydate: {selected: true, marked: true, selectedColor: 'blue'}
         })
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
        />
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={isloading} onRefresh={loaddata} />
        }
        >
        {isloading ? null : (
           <View style={{marginVertical: 20}}>
                <View style={{flexDirection: 'row',justifyContent: 'space-between', marginHorizontal: 20}}>

                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.push('/admin/Academics/list-calendar')}>
                        <Ionicons name='list' size={22} color="#17a2b8"/>
                        <Text style={{fontSize: 18}}>List</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=> router.push('/admin/Academics/create-calendar')}>
                        <Ionicons name='add-circle' size={22} color="#17a2b8"/>
                        <Text style={{fontSize: 18}}>New</Text>
                    </TouchableOpacity>
                </View>
            </View>)}
            
            <Card>
                <Card.Content>

                <Button title="Pick an image from camera roll" onPress={pickimage} style={{fontSize: 20}} />
               {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}


                {/* <Calendar
                   markingType={'period'}
                   markedDates={{
                    '2023-04-01': {startingDay: true, color: 'green'},
                    '2023-04-04': {endingDay: true, color: 'green'}
                  }}
                /> */}

<Agenda 
  style={styles.calendarWrapper}
  // The list of items that have to be displayed in agenda. If you want to render item as empty date
  // the value of date key has to be an empty array []. If there exists no value for date key it is
  // considered that the date in question is not yet loaded
  items={{
    '2012-05-22': [{name: 'item 1 - any js object'}],
    '2012-05-23': [{name: 'item 2 - any js object', height: 80}],
    '2012-05-24': [],
    '2012-05-25': [{name: 'item 3 - any js object'}, {name: 'any js object'}]
  }}
  // Callback that gets called when items for a certain month should be loaded (month became visible)
  loadItemsForMonth={month => {
    console.log('trigger items loading');
  }}
  // Callback that fires when the calendar is opened or closed
  onCalendarToggled={calendarOpened => {
    console.log(calendarOpened);
  }}
  // Callback that gets called on day press
  onDayPress={day => {
    console.log('day pressed');
  }}
  // Callback that gets called when day changes while scrolling agenda list
  onDayChange={day => {
    console.log('day changed');
  }}
  // Initially selected day
  selected={'2012-05-16'}
  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  minDate={'2012-05-10'}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={'2012-05-30'}
  // Max amount of months allowed to scroll to the past. Default = 50
  pastScrollRange={50}
  // Max amount of months allowed to scroll to the future. Default = 50
  futureScrollRange={50}
  // Specify how each item should be rendered in agenda
  renderItem={(item, firstItemInDay) => {
    return <View />;
  }}
  // Specify how each date should be rendered. day can be undefined if the item is not first in that day
  renderDay={(day, item) => {
    return <View />;
  }}
  // Specify how empty date content with no items should be rendered
  renderEmptyDate={() => {
    return <View />;
  }}
  // Specify how agenda knob should look like
  renderKnob={() => {
    return <View />;
  }}
  // Override inner list with a custom implemented component
  renderList={listProps => {
    //return <MyCustomList {...listProps} />;
  }}
  // Specify what should be rendered instead of ActivityIndicator
  renderEmptyData={() => {
    return <View />;
  }}
  // Specify your item comparison function for increased performance
  rowHasChanged={(r1, r2) => {
    return r1.text !== r2.text;
  }}
  // Hide knob button. Default = false
  hideKnob={true}
  // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
  showClosingKnob={false}
  // By default, agenda dates are marked if they have at least one item, but you can override this if needed
  markedDates={{
    '2023-04-16': {selected: true, marked: true},
    '2023-05-17': {marked: true},
    '2023-05-18': {disabled: true}
  }}
  // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
  disabledByDefault={true}
  // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly
  onRefresh={() => console.log('refreshing...')}
  // Set this true while waiting for new data from a refresh
  refreshing={false}
  // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView
  refreshControl={null}

/>

           
                </Card.Content>
            </Card> 

        </ScrollView>
      </SafeAreaView>
    )
}

export default Eventcalendar;

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
