import { Slot, Stack } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../store'

const Root = () => {
    console.log('main layout directory');

    return (
      <Provider store={store}>
        <Slot />
      </Provider>
    );
}

export default Root;