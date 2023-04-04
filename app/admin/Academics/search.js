import { Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Chip, Searchbar, TextInput } from 'react-native-paper';

function Search () {
  const [searchvalue, Seachvalue] = useState();
  const [search, setSearch] = useState();
  
    return (
      <SafeAreaView >
         <Stack.Screen
         options={{
            headerTitle: 'Search'
         }}
         />

            
          <Searchbar
              placeholder='Search....'
              onChangeText={(e) => setSearch(e)}
              defaultValue={search}
           />
                
            <Card>
                <Card.Content>
                    <FlatList
                      data={searchvalue}
                      renderItem={() => (
                        <TouchableOpacity>
                          <Text>Search Value Here</Text>
                        </TouchableOpacity>
                      )}
                    />
                </Card.Content>
            </Card>

      </SafeAreaView>
    )
}


export default Search;
