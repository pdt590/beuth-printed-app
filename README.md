# PrintED

Android and iOS application for PrintED project

## Compatibility

- Node v10.18.1
- [esp32-ble/clip](https://github.com/pdthang/beuth-esp32-ble/tree/clip) using LIS3DH and BME680 sensors

## ReactNative

### References

- https://github.com/vhpoet/react-native-styling-cheat-sheet
- https://medium.com/tuanbinhblog/rn-react-native-cheat-sheet-784a6bd07d73
- https://rationalappdev.com/react-native-cheat-sheet/ 

### Creating Project

```bash
react-native init AppName
cd AppName
```

### Running App in the iOS Simulator

```bash
react-native run-ios
```

### Running App in the Android Simulator

```bash
react-native run-android
```

### Specifying a Simulator Device

```bash
react-native run-ios --simulator "iPhone 7 Plus"
```

### To list available devices execute

```bash
xcrun simctl list devices
```

### Linking Dependencies

```bash
react-native link
```

### Setup Hot Reloading

```bash
CTRL + M on emulator
```

### Running your app on real Android devices

- Enable Debugging over USB
  - Settings → About phone and then tapping the Build number row at the bottom seven times
  - Settings → Developer options to enable "USB debugging"
- Plug in your device via USB

```bash  
adb devices
```

- Run your app

```bash
react-native run-android
```

- Setup Hot Reloading

```bash
adb shell input keyevent 82
```

- Reload device manually

```bash
adb shell input text "RR"
```

### [Generate APK](https://www.instamobile.io/android-development/generate-react-native-release-build-android/)

```bash
cd android
.\gradlew.bat assembleRelease
```

## Issues

- FAILURE: Build failed with an exception

  ```bash
  FAILURE: Build failed with an exception.
  * What went wrong:
  Could not determine the dependencies of task ':app:preDebugBuild'.
  > Could not resolve all task dependencies for configuration ':app:debugRuntimeClasspath'.
  > Could not find com.github.Polidea:MultiPlatformBleAdapter:58c87b49f12f4a5ab6f7af31f8085249e206400a.
  ```

  `Solution`: Reinstall react-native-ble-plx as in main page

- Fix issue Device not authorized to use BluetoothLE
  - https://github.com/Polidea/react-native-ble-plx/issues/248

- Android Dex issue
  - https://github.com/invertase/react-native-firebase/issues/1836

- [How to fix issue app:processDebugResources FAILED](https://github.com/oblador/react-native-vector-icons/issues/429)

  ```bash
  cd android
  .\gradlew.bat clean
  ```