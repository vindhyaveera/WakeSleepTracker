import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Accelerometer } from 'expo-sensors';  // Correct import

const WakeSleepTracker = () => {
  const [wakeTime, setWakeTime] = useState<string | null>(null);
  const [sleepTime, setSleepTime] = useState<string | null>(null);
  const [lastMovement, setLastMovement] = useState<string | null>(null);
  const [appState, setAppState] = useState<string>(AppState.currentState);

  // Load saved times
  useEffect(() => {
    const loadTimes = async () => {
      const savedWakeTime = await AsyncStorage.getItem('wakeTime');
      const savedSleepTime = await AsyncStorage.getItem('sleepTime');
      if (savedWakeTime) setWakeTime(savedWakeTime);
      if (savedSleepTime) setSleepTime(savedSleepTime);
    };

    loadTimes();
  }, []);

  // Save times to AsyncStorage
  const saveTime = async (key: string, time: string) => {
    try {
      await AsyncStorage.setItem(key, time);
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  // Movement detection using Accelerometer from expo-sensors
  useEffect(() => {
    // Set accelerometer update interval to 1 second
    const interval = 1000;

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const movement = Math.sqrt(x * x + y * y + z * z);
      if (movement > 1.2) {
        const currentTime = new Date().toLocaleTimeString();
        setLastMovement(currentTime);
        console.log('Movement detected:', currentTime);
      }
    });

    // Set the update interval for the accelerometer
    Accelerometer.setUpdateInterval(interval);

    return () => subscription.remove();
  }, []);

  // App state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      const currentTime = new Date().toLocaleTimeString();

      if (nextAppState === 'background') {
        setSleepTime(currentTime);
        saveTime('sleepTime', currentTime);
        console.log('App moved to background (Sleep):', currentTime);
      } else if (nextAppState === 'active') {
        setWakeTime((prevWakeTime) => {
          if (!prevWakeTime) return currentTime; // Set initial wake time
          return prevWakeTime;
        });
        saveTime('wakeTime', currentTime);
        console.log('App became active (Wake):', currentTime);
      }

      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wake & Sleep Tracker</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Wake Time:</Text>
        <Text style={styles.value}>{wakeTime || 'Not recorded yet'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Sleep Time:</Text>
        <Text style={styles.value}>{sleepTime || 'Not recorded yet'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Last Movement:</Text>
        <Text style={styles.value}>{lastMovement || 'No movement detected yet'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>App State:</Text>
        <Text style={styles.value}>{appState}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3d5afe',
    marginBottom: 30,
  },
  card: {
    width: '90%',
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3d5afe',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#424242',
  },
});

export default WakeSleepTracker;


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   AppState,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const WakeSleepTracker = () => {
//   const [wakeTime, setWakeTime] = useState<string | null>(null);
//   const [sleepTime, setSleepTime] = useState<string | null>(null);
//   const [lastActiveTime, setLastActiveTime] = useState<string | null>(null);

//   // Load persisted data when the app starts
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const storedWakeTime = await AsyncStorage.getItem('wakeTime');
//         const storedSleepTime = await AsyncStorage.getItem('sleepTime');
//         const storedLastActiveTime = await AsyncStorage.getItem('lastActiveTime');
        
//         if (storedWakeTime) setWakeTime(storedWakeTime);
//         if (storedSleepTime) setSleepTime(storedSleepTime);
//         if (storedLastActiveTime) setLastActiveTime(storedLastActiveTime);
//       } catch (error) {
//         console.error('Failed to load data', error);
//       }
//     };

//     loadData();
//   }, []);

//   useEffect(() => {
//     const handleAppStateChange = (nextAppState: string) => {
//       const currentTime = new Date().toLocaleTimeString();

//       if (nextAppState === 'background') {
//         // App moved to background
//         setSleepTime(currentTime);
//         saveData('sleepTime', currentTime); // Save sleep time to storage
//         console.log('App moved to background:', currentTime);
//       } else if (nextAppState === 'active') {
//         // App came to foreground
//         setWakeTime((prevWakeTime) => {
//           if (!prevWakeTime) {
//             saveData('wakeTime', currentTime); // Save wake time to storage
//             return currentTime;
//           }
//           return prevWakeTime;
//         });

//         setLastActiveTime(currentTime);
//         saveData('lastActiveTime', currentTime); // Save last active time to storage
//         console.log('App came to foreground:', currentTime);
//       }
//     };

//     const subscription = AppState.addEventListener('change', handleAppStateChange);

//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   const saveData = async (key: string, value: string) => {
//     try {
//       await AsyncStorage.setItem(key, value);
//     } catch (error) {
//       console.error(`Failed to save ${key}`, error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Wake & Sleep Tracker</Text>

//       <View style={styles.card}>
//         <Text style={styles.label}>Wake Time:</Text>
//         <Text style={styles.value}>{wakeTime || 'Not recorded yet'}</Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.label}>Sleep Time:</Text>
//         <Text style={styles.value}>{sleepTime || 'Not recorded yet'}</Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.label}>Last Active Time:</Text>
//         <Text style={styles.value}>{lastActiveTime || 'Not recorded yet'}</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f4ff',
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#3d5afe',
//     marginBottom: 30,
//   },
//   card: {
//     width: '90%',
//     backgroundColor: '#ffffff',
//     padding: 16,
//     marginVertical: 10,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#3d5afe',
//     marginBottom: 4,
//   },
//   value: {
//     fontSize: 18,
//     color: '#424242',
//   },
// });

// export default WakeSleepTracker;




// import React, { useState, useEffect } from 'react';
// import { Alert, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { DeviceMotion } from 'expo-sensors';

// const WakeSleepTracker = () => {
//   const [wakeTime, setWakeTime] = useState<string | null>(null);
//   const [sleepTime, setSleepTime] = useState<string | null>(null);
//   const [lastActiveTime, setLastActiveTime] = useState<string | null>(null);

//   useEffect(() => {
//     const requestPermission = async () => {
//       const { status } = await DeviceMotion.requestPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Motion sensor access is required to track wake and sleep times.');
//         return;
//       }

//      // Check if DeviceMotion is available
//      const isAvailable = await DeviceMotion.isAvailableAsync();
//      console.log('DeviceMotion available:', isAvailable);
//      if (!isAvailable) {
//        Alert.alert('Error', 'DeviceMotion is not available on this device.');
//        return;
//      }

//       // Set the motion sensor to check for updates every second (1000ms)
//       DeviceMotion.setUpdateInterval(1000);

//       const subscription = DeviceMotion.addListener((motion) => {
//         if (!motion || !motion.acceleration) return;

//         const { acceleration } = motion;
//         console.log('Motion detected:', acceleration);

//         if (Math.abs(acceleration.x) > 0.1 || Math.abs(acceleration.y) > 0.1 || Math.abs(acceleration.z) > 0.1) {
//           const currentTime = new Date().toLocaleTimeString();

//           // Record wake time only once
//           setWakeTime((prevWakeTime) => {
//             if (!prevWakeTime) return currentTime; // Set wake time if it hasn't been set
//             return prevWakeTime; // Keep the existing wake time
//           });

//           // Update the last active time
//           setLastActiveTime(currentTime);
//         }
//       });

//       return () => {
//         subscription.remove(); // Clean up the listener when the component unmounts
//       };
//     };

//     requestPermission();
//   }, []);

//   // Logs sleep time when button is pressed
//   const logSleepTime = () => {
//     if (!wakeTime) {
//       Alert.alert('Wake Time Not Recorded', 'Wake time needs to be recorded first!');
//       return;
//     }
//     const currentTime = new Date().toLocaleTimeString();
//     setSleepTime(currentTime);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Wake & Sleep Tracker</Text>

//       <View style={styles.card}>
//         <Text style={styles.label}>Wake Time:</Text>
//         <Text style={styles.value}>{wakeTime || 'Not recorded yet'}</Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.label}>Sleep Time:</Text>
//         <Text style={styles.value}>{sleepTime || 'Not recorded yet'}</Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.label}>Last Active Time:</Text>
//         <Text style={styles.value}>{lastActiveTime || 'Not recorded yet'}</Text>
//       </View>

//       <TouchableOpacity style={styles.button} onPress={logSleepTime}>
//         <Text style={styles.buttonText}>Log Sleep Time</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f4ff',
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#3d5afe',
//     marginBottom: 30,
//   },
//   card: {
//     width: '90%',
//     backgroundColor: '#ffffff',
//     padding: 16,
//     marginVertical: 10,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#3d5afe',
//     marginBottom: 4,
//   },
//   value: {
//     fontSize: 18,
//     color: '#424242',
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: '#3d5afe',
//     paddingVertical: 12,
//     paddingHorizontal: 32,
//     borderRadius: 25,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     textAlign: 'center',
//   },
// });

// export default WakeSleepTracker;
