import { Checkbox } from "react-native-paper";
import { Text, View } from "react-native";


function Permissionheader({item,permission,addpermission}){
    return (
        <>
        <View style={{marginTop: 20}}>
                <Text style={{backgroundColor: '#17a2b8',color: '#fff', padding: 10}}>{item.mname}</Text>  
                    <View style={{flexDirection: 'row'}}>
                       <Checkbox.Item label="V" status={permission.includes(`view${item.name}`) ? `checked` : `unchecked`}  onPress={()=> addpermission(`view${item.name}`)} />
                       <Checkbox.Item label="E" status={permission.includes(`edit${item.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`edit${item.name}`)} />
                       <Checkbox.Item label="C"  status={permission.includes(`create${item.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`create${item.name}`)} />
                      <Checkbox.Item label="D"  status={permission.includes(`delete${item.name}`) ? `checked` : `unchecked`} onPress={()=> addpermission(`delete${item.name}`)} />
                    </View>
           </View>
        </>
    );
}

export default Permissionheader;