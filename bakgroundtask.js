import { useEffect } from 'react';
import BackgroundService from 'react-native-background-actions';
import BackgroundJob from 'react-native-background-actions';
import { Platform, Linking } from 'react-native';


const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

  
BackgroundService.on('expiration', () => {
  console.log('iOS: I am being closed!');
});

const taskRepeat = async taskData => {

// console.log('Reached function');
if (Platform.OS === 'ios') {
    console.warn(
        'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
        'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.'
    );
}
await new Promise(async (_resolve) => {
    // For loop with a delay
    const { delay } = taskData;

    console.log(BackgroundService.isRunning(),delay);

    for (let i = 0; BackgroundService.isRunning(); i++) {
        await BackgroundService.updateNotification({ taskDesc: 'Running (' + i + ')' });
        await sleep(delay);
    }
});
};

// Define options for background action
let options = {
taskName: 'Example',
taskTitle: 'ExampleTask title',
taskDesc: 'ExampleTask desc',
taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
},
color: '#ff00ff',
linkingURI: 'exampleScheme://chat/jane',
parameters: {
    delay: 5000,
},
};

// Define what to do when user clicks on notification
function handleOpenURL(evt) {
console.log(evt.url);
// do something with the url ??
}

Linking.addEventListener('url', handleOpenURL);




useEffect(()=>{

  initiateBackgroundTask();

},[]);


const initiateBackgroundTask = async () => {

  const isRunning = BackgroundService.isRunning();

  try {
      console.log('Trying to start background service');
      const taskName = options.taskName;

      if (!isRunning) {
        await BackgroundService.start(taskRepeat, options);
        console.log('Running process with identifier : "' + taskName + '".');
    }
    else {
        console.log("Failed to start. Another process already running.");
    }
    console.log('Successful start!');
  } catch (e) {
      console.log('Error', e);
  }
};


const stopBackgroundTask = async () => {

console.log('Stopping background service');
await BackgroundService.stop();

};