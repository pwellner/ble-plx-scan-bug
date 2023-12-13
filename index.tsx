
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { checkBluetoothPermissionsAsync, requestNeededPermissionsAsync } from './permissions';
import { ScanScenario, scanForDevices } from './scan';
import { registerRootComponent } from 'expo';
registerRootComponent(TestApp);


export function TestApp() {
  const [permissionsOk, setPermissionsOk] = useState(false);
  const [message, setMessage] = useState("");


  checkBluetoothPermissionsAsync()
    .then(isOk => {
      setPermissionsOk(isOk);
    })
    .catch(err => {
      setMessage("" + err);
    })

  function scanPressHandler(scenario: ScanScenario) {
    scanForDevices(10, scenario);
  }

  return (
    <View style={styles.container}>
      {
        permissionsOk ?
          <Text>Permissions granted</Text>
          :
          <Button
            title="Get permissions"
            onPress={() => {
              requestNeededPermissionsAsync()
                .then(isOk => {
                  setPermissionsOk(isOk);
                })
                .catch(err => {
                  setMessage("" + err)
                })
            }}
          />
      }
      <Button
        title="Scan selected"
        onPress={() => scanPressHandler(ScanScenario.Selected)}
      />
      <Button
        title="Scan everything"
        onPress={() => scanPressHandler(ScanScenario.Everything)}
      />
      <Text>
        {message}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 7,
  },
});

