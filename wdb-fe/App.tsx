import { createContext, useEffect, useMemo, useReducer, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./components/LoginScreen";
import axios, { HttpStatusCode } from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./components/AppScreen";
import { plainToClass } from "class-transformer";
import { LoggedInDto, LoginDto } from "./dto/AuthDto";
import { CreateUserDto, UserCreatedDto } from "./dto/UserDto";
import "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingsScreen from "./components/SettingsScreen";
import AuthScreen from "./components/AuthScreen";
import ItemBrowserScreen from "./components/ItemBrowserScreen";
import OutfitBrowserScreen from "./components/OutfitBrowserScreen";

const Tab = createBottomTabNavigator();
export const AuthContext = createContext(null);

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
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
          `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}auth/profile`
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
          `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}auth/login`,
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
            `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}users`,
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
        dispatch({ type: "LOG_OUT" });
      },
      userToken: state.userToken,
    }),
    [state.userToken]
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          {state.userToken == null ? (
            <>
              {/* <Tab.Screen name="Home" component={HomeScreen} options={{"tabBarIcon": "home"}} /> */}
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Login" component={AuthScreen} />
            </>
          ) : (
            <>
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Clothes" component={ItemBrowserScreen} />
              <Tab.Screen name="Outfits" component={OutfitBrowserScreen} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
