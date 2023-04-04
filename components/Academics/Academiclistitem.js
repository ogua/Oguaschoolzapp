import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button, Dialog, List, Menu, Portal, Snackbar, Text } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";

function Academiclistitem ({items,deletedata}) {
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const [showdialog, setShowdialog] = useState(false);
    const showDialog = () => setShowdialog(true);
    const hideDialog = () => setShowdialog(false);
    const [showsnakbar, setShowsnakbar] = useState(false);
    
    const onshowSnackBar = () => {
        setShowdialog(false);
        setShowsnakbar(true);
    }
    
    const onDismissSnackBar = () => setShowsnakbar(false);

    return (
        <>
        <TouchableOpacity style={{backgroundColor: '#fff', padding: 10}}
        onPress={() => setVisible(! visible)}
        >
            {/* <View style={{flexDirection: 'row'}}>
                <Ionicons name="calendar" size={20} />
                <View style={{flex: 1, flexDirection: 'row',marginHorizontal: 10}}>
                    <Text style={{flex: 1}}> {item.name}</Text>
                    <Text style={{fontSize: 10}}>{item.created_at}</Text>
                </View>
                <Ionicons name="reorder-three-sharp" size={20} />
            </View> */}

    <List.Item
        title={items.name}
        titleEllipsizeMode="middle"
        //description={`Created_at `+items.created_at}
        left={props => <Ionicons name="calendar" {...props} size={20} />}
        right={props => <Ionicons name="ellipsis-vertical-sharp" {...props} size={20} />}
    />
            
        </TouchableOpacity>

        {visible && (
            <View style={{backgroundColor: '#fff', borderBottomColor: '#000', borderBottomWidth: 1 }}>
                <Menu.Item style={{marginLeft: 10}} leadingIcon="square-edit-outline" onPress={()=> router.push(`/admin/Academics/edit-academic?id=${items.id}`)} title="Edit" />
                <Menu.Item style={{marginLeft: 10}} leadingIcon="delete-forever-outline" onPress={showDialog} title="Delete" />
            </View>
        )}

        {/* <Menu
            visible={visible}
            onDismiss={closeMenu}
            style={{width:'100%'}}
            anchor={<Button onPress={openMenu} mode="contained">Show menu</Button>}>
            <List.Item onPress={() => {closeMenu()}} title="Item 1" />
            <List.Item onPress={() => {}} title="Item 2" />
            <List.Item onPress={() => {}} title="Item 3" />
        </Menu> */}

        <Portal>
          <Dialog visible={showdialog} onDismiss={hideDialog}>
           <Dialog.Icon icon="alert" />
            <Dialog.Title style={{textAlign: 'center'}}>Alert</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Are you sure you want to delete {items.name}</Text>
            </Dialog.Content>
            <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={() => deletedata(items.id)}>Yes</Button>
        </Dialog.Actions>
          </Dialog>
        </Portal>

        <Snackbar
        style={{backgroundColor: '#17a2b8'}}
         visible={showsnakbar}
         onDismiss={onDismissSnackBar}
        action={{
          label: 'Undo',
          onPress: () => {
            // Do something
          },
        }}>
        <Text>{items.name} delected successfully</Text>
      </Snackbar>

        </>
    )
}

export default Academiclistitem;
