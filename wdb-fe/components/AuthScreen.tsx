import { createContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';

const Stack = createNativeStackNavigator();
export const NewItemsContext = createContext(null);

export default function AppScreen() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </>
    </Stack.Navigator>
  )
}
