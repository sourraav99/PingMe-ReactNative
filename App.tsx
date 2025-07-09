import { View, Text, PermissionsAndroid, Alert } from 'react-native'
import React, { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const App = () => {
  useEffect(() => {
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
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId,
        sound: 'snapnotifi',
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