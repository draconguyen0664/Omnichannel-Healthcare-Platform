import messaging from "@react-native-firebase/messaging";

export async function registerForPushNotifications() {
  await messaging().requestPermission();
  return messaging().getToken();
}

export function listenForPushNotifications(onMessage: (title: string) => void) {
  return messaging().onMessage(async (message) => {
    onMessage(message.notification?.title ?? "Thông báo mới");
  });
}
