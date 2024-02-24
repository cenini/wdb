import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useState, useEffect, createContext, useReducer, useMemo, useContext } from "react";
import axios, { HttpStatusCode } from "axios";
import Constants from "expo-constants";
import { plainToClass, plainToInstance } from "class-transformer";
import { CreateItemTagsDto, ItemDto } from "../dto/ItemDto";
import { ItemModel, TagType } from "../models/ItemModel";
import { ButtonStyles, CommonStyles } from "../components/Styles";
import { KvpTagModel, NameTagModel } from "../models/TagModel";
import Button from "../components/Button";
import { useFocusEffect } from "@react-navigation/native";
import { CreateOutfitWithItemsDto } from "../dto/OutfitDto";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedInDto, LoginDto } from '../dto/AuthDto';
import { CreateUserDto, UserCreatedDto } from '../dto/UserDto';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const AuthContext = createContext(null);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [state, dispatch] = useReducer(
    (prevState: any, action: { type: any; token: any; }) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "LOG_IN":
          return {
            ...prevState,
            isLogout: false,
            userToken: action.token,
          };
        case "SIGN_UP":
          return {
            ...prevState,
            isLogout: false,
            userToken: action.token,
          };
        case "LOG_OUT":
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
        userToken = await AsyncStorage.getItem("userToken");
        axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
      } catch (e) {
        // Restoring token failed
        // User has to sign in again
        return;
      }

      // After restoring token, we may need to validate it in production apps
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}auth/profile`
        );
        if (response.status != HttpStatusCode.Ok) {
          // log that the user token has expired
          return;
        }
      } catch (error) {
        // log that the token has expired
        return;
      }

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      login: async (email: string, password: string) => {
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}auth/login`,
          plainToClass(LoginDto, { email: email, password: password })
        );
        const accessToken = plainToClass(
          LoggedInDto,
          response.data
        ).accessToken;
        await AsyncStorage.setItem("userToken", accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        dispatch({ type: "LOG_IN", token: accessToken });
      },
      signup: async (email: string, password: string) => {
        try {
          const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URL}users`,
            plainToClass(CreateUserDto, { email: email, password: password })
          );
          const accessToken = plainToClass(
            UserCreatedDto,
            response.data
          ).accessToken;
          await AsyncStorage.setItem("userToken", accessToken);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          dispatch({ type: "SIGN_UP", token: accessToken });
        } catch (error) {
          if (error.response) {
            if (error.response.status == HttpStatusCode.Conflict) {
              const errorText =
                "A user with that e-mail has already been registered.";
              throw new Error(errorText);
            } else if (error.response.status < 500) {
              const errorText =
                "The user was not accepted. You know what you did.";
              throw new Error(errorText);
            } else {
              const errorText = "There was a server error. Try again later.";
              throw new Error(errorText);
            }
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            const errorText =
              "The user could not be created at this time. Try again later.";
            throw new Error(errorText);
          } else {
            // Something happened in setting up the request that triggered an Error
            // Client side issue, should be traced.
            const errorText =
              "The user could not be created at this time. Try again later.";
            throw new Error(errorText);
          }
        }
      },
      logout: async () => {
        await AsyncStorage.removeItem("userToken");
        dispatch({
          type: "LOG_OUT",
          token: undefined
        });
      },
      userToken: state.userToken,
    }),
    [state.userToken]
  );


  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <RootLayoutNav />
    </AuthContext.Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { userToken } = useContext(AuthContext);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack> */}
    <>
      <Tabs>
        <Tabs.Screen name="home" />
        {/* <Tabs.Screen name="login" options={{href: userToken == null ? "/login" : null}} /> */}
        <Tabs.Screen name="login" options={{href: userToken == null ? "/login" : "/login"}} />
        <Tabs.Screen name="signup" options={{href: userToken == null ? null : null}} />
        <Tabs.Screen name="clothes" options={{href: userToken == null ? null : "clothes"}} />
        <Tabs.Screen name="outfits" options={{href: userToken == null ? null : "outfits"}} />
      </Tabs>
      {/* <Header /> */}
      {/* <Slot /> */}
      {/* <Footer /> */}
    </>
    </ThemeProvider>
  );
}
