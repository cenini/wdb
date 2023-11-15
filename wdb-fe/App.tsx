import { createContext, useEffect, useMemo, useReducer, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, View} from "react-native";

import Button from './components/PhotoButton'; 
import ImageViewer from './components/ImageViewer';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from './components/SignupScreen';
import LoginScreen from './components/LoginScreen';
import axios, { HttpStatusCode } from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlaceholderImage = require("./assets/images/background-image.png");
const Stack = createNativeStackNavigator();
export const AuthContext = createContext(null);

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );


  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken: string;

      try {
        userToken = await AsyncStorage.getItem('userToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
      } catch (e) {
        // Restoring token failed
        // User has to sign in again
        return
      }

      // After restoring token, we may need to validate it in production apps
      try {
        const response = await axios.get(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}auth/profile`)
        if (response.status != HttpStatusCode.Ok) {
          // log that the user token has expired
          return
        }
      } catch (error) {
        // log that the token has expired
        return
      }

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      login: async (email: string, password: string) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        const response = await axios.post(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}auth/login`, { "email": email, "password": password})
        const userToken = response.data.access_token;
        await AsyncStorage.setItem('userToken', userToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
        dispatch({ type: 'SIGN_IN', token: response.data.token });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    []
  );

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 10,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,

    });

    if (!result.canceled) {
      console.log(result);
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  return (
    // <View style={styles.container}>
    //   <View style={styles.imageContainer}>
    //     <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
    //   </View>
    //   <View style={styles.footerContainer}>
    //     <PhotoButton theme="primary" label="Choose a photo" onPress={pickImageAsync} />
    //     {/* <Button label="Use this photo" /> */}
    //   </View>
    //   <StatusBar style="auto" />
    // </View>
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});


// import * as React from 'react';
// import { View, Text } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// function HomeScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Home Screen</Text>
//     </View>
//   );
// }

// function SignupScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Signup Screen</Text>
//     </View>
//   );
// }

// const Stack = createNativeStackNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Signup" component={SignupScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


// export default App;



