import { createContext, useEffect, useMemo, useReducer, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, View} from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from './components/SignupScreen';
import LoginScreen from './components/LoginScreen';
import axios, { HttpStatusCode } from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './components/HomeScreen';
import { plainToClass, classToPlain } from 'class-transformer';
import { LoggedInDto, LoginDto } from './dto/AuthDto';
import { CreateUserDto, UserCreatedDto } from './dto/UserDto';

const Stack = createNativeStackNavigator();
export const AuthContext = createContext(null);

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'LOG_IN':
          return {
            ...prevState,
            isLogout: false,
            userToken: action.token,
          };
        case 'SIGN_UP':
          return {
            ...prevState,
            isLogout: false,
            userToken: action.token,
          };
        case 'LOG_OUT':
          return {
            ...prevState,
            isLogout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isLogout: false,
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
        const response = await axios.post(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}auth/login`, plainToClass(LoginDto, { "email": email, "password": password}))
        const accessToken = plainToClass(LoggedInDto, response.data).accessToken 
        await AsyncStorage.setItem('userToken', accessToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        dispatch({ type: 'LOG_IN', token: accessToken });
      },
      signup: async (email: string, password: string) => {
        const response = await axios.post(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}users`, plainToClass(CreateUserDto, { "email": email, "password": password}))
        const accessToken = plainToClass(UserCreatedDto, response.data).accessToken 
        await AsyncStorage.setItem('userToken', accessToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        dispatch({ type: 'SIGN_UP', token: accessToken });
      },
      logout: async () => {
        await AsyncStorage.removeItem('userToken')
        dispatch({ type: 'LOG_OUT' })
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {state.userToken == null 
          ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              {/* <Stack.Screen name="ResetPassword" component={ResetPassword} /> */}
            </>) 
          : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
            </>)
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
