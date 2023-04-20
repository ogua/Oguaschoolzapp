import { Slot, Stack } from 'expo-router';
import { Provider } from 'react-redux';
import store, { persistor } from '../store'
import { PersistGate } from 'redux-persist/integration/react';
import { Text } from 'react-native';

const Root = () => {
    console.log('main layout directory');

    return (
      <Provider store={store}>
         <Slot />
      </Provider>
    );
}

export default Root;