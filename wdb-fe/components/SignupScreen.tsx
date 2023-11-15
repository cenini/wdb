import * as React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Button from './Button';
import axios, { HttpStatusCode } from 'axios';
import Constants from 'expo-constants';

const signupUrl = `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}users`

export default function SignupScreen() {
  const navigation = useNavigation()
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [userCreatedText, setUserCreatedText] = React.useState('');
  const [userCreatedSuccessfully, setUserCreatedSuccessfully] = React.useState(false);

  async function signUp(email: string, password: string) : Promise<void> {
    try {
      const response = await axios.post(signupUrl, { "email": email, "password": password})
      if (response.status != HttpStatusCode.Created) {
        setUserCreatedText('User creation was accepted, but not yet created. Wait a moment before attempting a sign-in.')
        setUserCreatedSuccessfully(false)
        return;
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        if (error.response.status == HttpStatusCode.Conflict) {
          setUserCreatedText('A user with that e-mail has already been registered.')
          setUserCreatedSuccessfully(false)
        } else if (error.response.status < 500 ) {
          setUserCreatedText('The user was not accepted. You know what you did.')
          setUserCreatedSuccessfully(false)
        } else {
          setUserCreatedText('There was a server error. Try again later.')
          setUserCreatedSuccessfully(false)
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        setUserCreatedText('The user could not be created at this time. Try again later.')
        setUserCreatedSuccessfully(false)
      } else {
        // Something happened in setting up the request that triggered an Error
        // Client side issue, should be traced.
        setUserCreatedText('The user could not be created at this time. Try again later.')
        setUserCreatedSuccessfully(false)
        console.log('Error', error.message);
      }
      return;
    }
    setUserCreatedText('User creation successful!')
    setUserCreatedSuccessfully(true)
  }

  return (
    <>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder='email'
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder='password'
        secureTextEntry
      />
      <Button label="Sign up" theme="primary" onPress={async () => await signUp(email, password)} />
      <Text style={styles.text} onPress={() => navigation.navigate('Login')}>Already have a user? Log in!</Text>
      <Text style={[styles.text, userCreatedSuccessfully ? styles.userCreatedSuccessText : styles.userCreatedFailText]}>{userCreatedText}</Text>
    </>
  );
}


const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  text: {
    height: 40,
    margin: 12,
    padding: 10,
  },
  userCreatedSuccessText: {
    color: 'green',
  },
  userCreatedFailText: {
    color: 'red',
  }
});
