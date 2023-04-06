import {View,StyleSheet, FlatList } from 'react-native';

import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';

import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { images } from './constants';
import { useRouter } from 'expo-router';
import Customdrawerlist from '../lists/draweritemlist';

 function Drawercontent(props) {
 const [ispressed, setIspressed] = useState(false);
 const [focus, setFocus] = useState();
 const [subfocus, setsubFocus] = useState();
 const router = useRouter();

 const drawerlist = [
  {
    key: 1,
    name: 'Dashboard',
    icon: 'monitor-dashboard',
    route: 'Dashboard',
    permission: '',
    children: []
  },
  {
    key: 2,
    name: 'Academics',
    icon: 'calendar-month',
    route: 'Academics',
    permission: '',
    children: [
    {
      key: 21,
      name: 'Academic Term',
      icon: 'circle-outline',
      route: 'Academicterm',
      permission: '',
    },
    {
      key: 22,
      name: 'Academic Year',
      icon: 'circle-outline',
      route: 'Academicyear',
      permission: '',
    },
    {
      key: 23,
      name: 'Academic Calendar',
      icon: 'circle-outline',
      route: 'Calendar',
      permission: '',
    },
    {
      key: 24,
      name: 'Subject',
      icon: 'circle-outline',
      route: 'Sujects',
      permission: '',
    },
    {
      key: 25,
      name: 'Classes',
      icon: 'circle-outline',
      route: 'Classroom',
      permission: '',
    },
    {
      key: 26,
      name: 'Promote Student',
      icon: 'circle-outline',
      route: 'Promotestudent',
      permission: '',
    },
  ]
  },
  {
    key: 3,
    name: 'Front Desk',
    icon: 'remote-desktop',
    route: 'Front Desk',
    permission: '',
    children: [
      {
        key: 31,
        name: 'Enquiries',
        icon: 'circle-outline',
        route: 'Enquiry',
        permission: '',
      },
      {
        key: 32,
        name: 'Visitors',
        icon: 'circle-outline',
        route: 'Visitors',
        permission: '',
      },
      {
        key: 33,
        name: 'Call Logs',
        icon: 'circle-outline',
        route: 'Promotestudent',
        permission: '',
      },
      {
        key: 34,
        name: 'Postal Dispatch',
        icon: 'circle-outline',
        route: 'Promotestudent',
        permission: '',
      },
      {
        key: 35,
        name: 'Postal Received',
        icon: 'circle-outline',
        route: 'Promotestudent',
        permission: '',
      },
    ]
  },
  {
    key: 4,
    name: 'Add Student',
    icon: 'circle-outline',
    route: 'Promotestudent',
    permission: '',
    children: []
  },
  {
    key: 5,
    name: 'All Students',
    icon: 'account-group',
    route: 'All Students',
    permission: '',
    children: [
      {
        key: 51,
        name: 'All Students',
        icon: 'circle-outline',
        route: 'Promotestudent',
        permission: '',
      },
      {
        key: 52,
        name: 'All Stopped Students',
        icon: 'circle-outline',
        route: 'Promotestudent',
        permission: '',
      },
      {
        key: 53,
        name: 'All Dismissed Students',
        icon: 'circle-outline',
        route: 'Promotestudent',
        permission: '',
      },
      {
        key: 54,
        name: 'All Completed Students',
        icon: 'circle-outline',
        route: 'Promotestudent',
        permission: '',
      },
    ]
  },
 ];

const setfocustate  = (key) => {
  //console.log("Focus",focus);
  if(focus > 0){
    setFocus(0);
  }else{
    setFocus(key);
  }
}

    const paperTheme = useTheme();
        return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={{backgroundColor: '#fff',
                    flexDirection: 'row', alignItems: 'center',padding: 10}}>
                       <Avatar.Image 
                            source={images.softwarelogo}
                            size={30}
                        />

                        <Text style={{fontSize: 15, marginLeft: 10}}>OSMS</Text>
                    </View>

                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',padding: 10, alignItems: 'center'}}>
                            <Avatar.Image 
                                source={{uri: props.user.avatar}}
                                size={50}
                            />
                            <View style={{ marginLeft: 10}}>
                                <Title style={styles.title}>{props.user.name}</Title>
                            </View>
                        </View>
                    </View>
                   
                    <Drawer.Section style={styles.drawerSection}>

                    {drawerlist.map(item => (
                        <>
                          <DrawerItem 
                            focused={focus == item.key ? true: false}
                            icon={({color, size}) => (
                                <Icon 
                                  name={item.icon}
                                    color={color}
                                    size={size}
                                    />
                                )}
                              label={({color, focused}) => (
                                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                      <Text {...focused}>{item.name}</Text>
                                      {item.children.length > 0 && (
                                        <>
                                        {focus == item.key ? (
                                            <Ionicons name='arrow-down-circle' size={25} color={color} />
                                        ): (
                                          <Ionicons name='arrow-up-circle' size={25} color={color} />
                                        )}
                                        </>
                                      )}
                                  </View>
                              )}   
                            onPress={() => {
                              setFocus(item.key);
                              //setfocustate(item.key);
                              if(item.children.length > 0){
                              }else{
                                setsubFocus(0);
                                props.navigation.navigate(item.route);
                              }

                            }}
                        />

                        {focus == item.key && (
                          <>
                          {item.children.map(children => (

                            <DrawerItem 
                            focused={focus == item.key &&  subfocus == children.key ? true: false}
                            icon={({color, size}) => (
                                <Icon 
                                  name={children.icon}
                                    color={color}
                                    size={size}
                                    />
                                )}
                                label={({color, focused}) => (
                                  <Text>{children.name}</Text>
                              )}  
                            onPress={() => {
                                setsubFocus(children.key);
                                props.navigation.navigate(children.route);
                            }}
                            />

                          ))}

                        </>
                       )}

                        </>

                        
                    ))}
                

                <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="bookmark-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Bookmarks"
                            onPress={() => {props.navigation.navigate('BookmarkScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-check-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => {props.navigation.navigate('SettingsScreen')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-check-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                            label="Support"
                            onPress={() => {props.navigation.navigate('SupportScreen')}}
                        />
                    </Drawer.Section>

                    <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

export default Drawercontent;

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
      marginTop: -4
    },
    userInfoSection: {
      backgroundColor: '#fff',
      borderBottomColor: '#000',
      borderTopWidth: 1,
      borderBottomWidth: 1
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color:'#000',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 10,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#000',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
