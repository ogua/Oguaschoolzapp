import {View,StyleSheet } from 'react-native';

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

 function Drawercontent(props) {
 const [ispressed, setIspressed] = useState(false);
 const [focus, setFocus] = useState();
 const router = useRouter();

    const paperTheme = useTheme();
        return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={{backgroundColor: '#4b545c',
                    flexDirection: 'row', alignItems: 'center',padding: 10}}>
                       <Avatar.Image 
                            source={images.softwarelogo}
                            size={30}
                        />

                        <Text style={{color: '#fff',fontSize: 15, marginLeft: 10}}>OSMS</Text>
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

                    <DrawerItem 
                        focused={focus == 'Dashboard' ? true: false}
                        icon={({color, size}) => (
                            <Icon 
                               name="monitor-dashboard" 
                                color={color}
                                size={size}
                                />
                            )}
                        label="Dashboard"    
                        onPress={() => {
                            setFocus('Dashboard');
                            props.navigation.navigate('Dashboard');
                            //setIspressed(! ispressed);
                        }}
                    /> 


                    {/* Academics */}

                    <DrawerItem
                        focused={focus == 'Academics' ? true: false}
                        icon={({color, size}) => (
                            <Icon 
                               name="calendar-month"
                                color={color}
                                size={size}
                                />
                            )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text>Academics</Text>
                                {focus == 'Academics' && ispressed ? (
                                    <Ionicons name='arrow-down-circle' size={25} color={color} />
                                ) : (
                                    <Ionicons name='arrow-up-circle' size={25} color={color} />
                                )}
                            </View>
                        )}
                        onPress={() => {
                            setFocus('Academics');
                            setIspressed(! ispressed);
                        }}
                    /> 
                                   
                   {focus == 'Academics' && ispressed && (
                     <>
                     <DrawerItem
                      style={{marginLeft: 65}}
                      label="Academic Term"
                      onPress={() => {
                        props.navigation.navigate('Academicterm');
                        //router.push("/admin/Academics/academic-term");
                      }}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="Academic Year"
                      onPress={() => {props.navigation.navigate('Academicyear')}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="Academic Calendar"
                      onPress={() => {props.navigation.navigate('Calendar')}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="Subject"
                      onPress={() => {props.navigation.navigate('Sujects')}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="Classes"
                      onPress={() => {props.navigation.navigate('Classroom')}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="Promote Student"
                      onPress={() => {props.navigation.navigate('Promotestudent')}}
                    />


                     </>
                   )}


                {/* Front Desk */}

                <DrawerItem
                        focused={focus == 'Front Desk' ? true: false}
                        icon={({color, size}) => (
                            <Icon 
                               name="remote-desktop"
                                color={color}
                                size={size}
                                />
                            )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text>Front Desk</Text>
                                {focus == 'Front Desk' && ispressed ? (
                                    <Ionicons name='arrow-down-circle' size={25} color={color} />
                                ) : (
                                    <Ionicons name='arrow-up-circle' size={25} color={color} />
                                )}
                            </View>
                        )}
                        onPress={() => {
                            setFocus('Front Desk');
                            setIspressed(! ispressed);
                        }}
                    /> 
                                   
                   {focus == 'Front Desk' && ispressed && (
                     <>
                     <DrawerItem
                      style={{marginLeft: 65}}
                      label="Enquiries"
                      onPress={() => {props.navigation.navigate('Enquiry')}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="Visitors"
                      onPress={() => {props.navigation.navigate('Visitors')}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="Call Logs"
                      onPress={() => {}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="Postal Dispatch"
                      onPress={() => {}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="Postal Received"
                      onPress={() => {}}
                    />

                     </>
                   )}    


                     {/* Add Student */}
                    <DrawerItem 
                        focused={focus == 'Add Student' ? true: false}
                        icon={({color, size}) => (
                            <Icon 
                               name="account-plus-outline" 
                                color={color}
                                size={size}
                                />
                            )}
                        label="Add Student"    
                        onPress={() => {
                            setFocus('Add Student');
                           // props.navigation.navigate('Dashboard');
                        }}
                    /> 


                {/* All Students */}

                <DrawerItem
                        focused={focus == 'All Students' ? true: false}
                        icon={({color, size}) => (
                            <Icon 
                               name="account-group"
                                color={color}
                                size={size}
                                />
                            )}
                        label={({color, focused}) => (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text>All Students</Text>
                                {focus == 'All Students' && ispressed ? (
                                    <Ionicons name='arrow-down-circle' size={25} color={color} />
                                ) : (
                                    <Ionicons name='arrow-up-circle' size={25} color={color} />
                                )}
                            </View>
                        )}
                        onPress={() => {
                            setFocus('All Students');
                            setIspressed(! ispressed);
                        }}
                    /> 
                                   
                   {focus == 'All Students' && ispressed && (
                     <>
                     <DrawerItem
                      style={{marginLeft: 65}}
                      label="All Students"
                      onPress={() => {}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="Student ID"
                      onPress={() => {}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="All Active Students"
                      onPress={() => {}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="All Stopped Students"
                      onPress={() => {}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="All Dismissed Students"
                      onPress={() => {}}
                    />

                    <DrawerItem
                      style={{marginLeft: 65}}
                      label="All Completed Students"
                      onPress={() => {}}
                    />

                     </>
                   )}          














                
                    

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
      backgroundColor: '#4f5962',
      borderBottomColor: '#fff',
      borderBottomWidth: 0.2
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color:'#fff',
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
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
