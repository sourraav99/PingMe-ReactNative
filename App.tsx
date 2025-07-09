import { View, Text, PermissionsAndroid, Alert } from 'react-native'
import React, { useEffect } from 'react'
import BootSplash from "react-native-bootsplash";
import messaging from '@react-native-firebase/messaging';
import notifee,{AndroidStyle} from '@notifee/react-native';

const App = () => {

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
    requestAndroidPermissions();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      onDisplayNotification(remoteMessage);
    });
    return unsubscribe;

  }, [])

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('TOKEN:', token);

  }

  const requestAndroidPermissions = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // Alert.alert('Notification Permission Granted');
      getToken();
    } else {
      // Alert.alert('Notification Permission Denied');
    }

  }

  const onDisplayNotification = async (remoteMessage: any) => {


    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'sound',
      name: 'Default Channel',
    });
    const image = remoteMessage.data?.image;

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId,
        smallIcon: 'ic_notification',
        sound: 'snapnotifi',
        largeIcon: image,
        // style: {
        //   type: AndroidStyle.BIGPICTURE,
        //   picture: image, // same image
        // },
        pressAction: {
          id: 'default',
        },
      },
    });
  }


  return (
    <View>
      <Text>App</Text>
    </View>
  )
}

export default App