import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Accelerometer } from 'expo-sensors';  // For movement detection

const WakeSleepTracker = () => {
  const [wakeTime, setWakeTime] = useState<string | null>(null);
  const [sleepTime, setSleepTime] = useState<string | null>(null);
  const [lastMovement, setLastMovement] = useState<string | null>(null);
  const [appState, setAppState] = useState<string>(AppState.currentState);
  const [isUserSleeping, setIsUserSleeping] = useState<boolean>(false);

  // Save times to AsyncStorage
  const saveTime = async (key: string, time: string) => {
    try {
      await AsyncStorage.setItem(key, time);
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

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

  // App state change listener (background/active)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      const currentTime = new Date().toLocaleTimeString();

      if (nextAppState === 'background') {
        // App moves to background (sleep time)
        if (!sleepTime) {
          setSleepTime(currentTime);
          saveTime('sleepTime', currentTime);
          console.log('App is in background (Sleep):', currentTime);
        }
      } else if (nextAppState === 'active') {
        // App becomes active (wake time)
        if (!wakeTime) {
          setWakeTime(currentTime);
          saveTime('wakeTime', currentTime);
          console.log('App is active (Wake):', currentTime);
        }
      }

      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [sleepTime, wakeTime]);

  // Movement detection using Accelerometer
  useEffect(() => {
    const interval = 1000;  // Set update interval to 1 second

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const movement = Math.sqrt(x * x + y * y + z * z); // Calculate magnitude of movement

      if (movement < 1.5) {
        // Consider movement less than 1.5 as "still" (user might be asleep)
        if (!isUserSleeping) {
          setIsUserSleeping(true); // User has likely fallen asleep
          const currentTime = new Date().toLocaleTimeString();
          if (!sleepTime) {
            setSleepTime(currentTime);
            saveTime('sleepTime', currentTime);
            console.log('Detected sleep time (No movement):', currentTime);
          }
        }
      } else {
        // If movement is above threshold, consider it "waking up"
        if (isUserSleeping) {
          setIsUserSleeping(false); // User is waking up
          const currentTime = new Date().toLocaleTimeString();
          if (!wakeTime) {
            setWakeTime(currentTime);
            saveTime('wakeTime', currentTime);
            console.log('Detected wake time (Movement detected):', currentTime);
          }
        }
      }

      if (movement > 1.5) {
        // Only update the last movement if there's significant movement
        setLastMovement(new Date().toLocaleTimeString());
      }
    });

    Accelerometer.setUpdateInterval(interval);  // Set the update interval

    return () => {
      subscription.remove();
    };
  }, [sleepTime, wakeTime, isUserSleeping]);

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
// import { View, Text, StyleSheet, AppState } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const WakeSleepTracker = () => {
//   const [wakeTime, setWakeTime] = useState<string | null>(null);
//   const [sleepTime, setSleepTime] = useState<string | null>(null);
//   const [appState, setAppState] = useState<string>(AppState.currentState);

//   // Save times to AsyncStorage
//   const saveTime = async (key: string, time: string) => {
//     try {
//       await AsyncStorage.setItem(key, time);
//     } catch (error) {
//       console.error('Error saving data', error);
//     }
//   };

//   // App state change listener
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState: string) => {
//       if (nextAppState === 'background') {
//         // Save sleep time when app goes to background
//         const currentTime = new Date().toLocaleTimeString();
//         setSleepTime(currentTime);
//         saveTime('sleepTime', currentTime);
//         console.log('App is in background (Sleep):', currentTime);
//       } else if (nextAppState === 'active') {
//         // Save wake time when app comes to foreground
//         const currentTime = new Date().toLocaleTimeString();
//         setWakeTime(currentTime);
//         saveTime('wakeTime', currentTime);
//         console.log('App is active (Wake):', currentTime);
//       }
//       setAppState(nextAppState);
//     };

//     // Add event listener for app state changes
//     const subscription = AppState.addEventListener('change', handleAppStateChange);

//     // Cleanup the event listener when the component is unmounted
//     return () => {
//       subscription.remove();
//     };
//   }, []);

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
//         <Text style={styles.label}>App State:</Text>
//         <Text style={styles.value}>{appState}</Text>
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


