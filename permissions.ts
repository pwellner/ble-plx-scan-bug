
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// Needed for Android 10? https://github.com/dotintent/react-native-ble-plx/pull/940/commits


export async function checkBluetoothPermissionsAsync() {
  if (Platform.OS === 'ios') {
    // Handled in static pList
    return true;
  }
  let status = "";
  status = await check(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
  if (status !== RESULTS.GRANTED) {
    return false;
  }
  status = await check(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
  if (status !== RESULTS.GRANTED) {
    return false;
  }
  return true;
}

export async function requestBluetoothPermissionsAsync() {
  if (Platform.OS === 'ios') {
    // Handled in static pList
    return true;
  }
  let status = "";
  status = await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
  if (status !== RESULTS.GRANTED) {
    if (status === RESULTS.BLOCKED) {
      throw new Error('Use phone settings, or uninstall & reinstall');
    }
    console.log(`requestBluetoothPermissionsAsync() connect status=${status}. returning false`);
    return false;
  }
  status = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
  if (status !== RESULTS.GRANTED) {
    if (status === RESULTS.BLOCKED) {
      throw new Error('Use phone settings, or uninstall & reinstall');
    }
    console.log(`requestBluetoothPermissionsAsync() scan status=${status}. returning false`);
    return false;
  }
  return true;
}



const neededPermissions = Platform.OS === 'android' ?
  [
    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  ]
  :
  [ // IOS permissions are requested through plist instead (See app.json)
    // PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
  ];




export async function requestNeededPermissionsAsync(): Promise<boolean> {

  console.log("requestNeededPermissionsAsync()");

  /*
  let gotLocationPermissions = await getLocationPermissionsAsync();
  console.log(`gotLocationPermissions=${gotLocationPermissions}`);
 
  if (!gotLocationPermissions) {
    throw new Error("Need foreground and background location permission.");
  }
*/

  for (const permission of neededPermissions) {
    let status = await request(permission);
    console.log(`Permission ${permission} status=${status}`);
    if (status == RESULTS.GRANTED) {
      continue;
    }
    if (status == RESULTS.UNAVAILABLE) {
      continue;
    }
    if (status == RESULTS.DENIED || status == RESULTS.BLOCKED) {
      throw new Error(`Permission ${permission} denied`);
    }
    // RESULTS.LIMITED some actions possible. Hoping for the best
  }

  console.log("requestNeededPermissionsAsync() returning successfully");
  return true;
}
