import * as React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Button from './Button';
import axios, { HttpStatusCode } from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../App';

const loginUrl = "http://localhost:3000/v1/auth/login"

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginText, setLoginText] = React.useState('');
  const [loginSuccessful, setLoginSuccessful] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const navigation = useNavigation()

  // async function login(email: string, password: string) : Promise<void> {
  //   try {
  //     const response = await axios.post(loginUrl, { "email": email, "password": password})
  //     if (response.status != HttpStatusCode.Ok) {
  //       setLoginText('Login failed.')
  //       setLoginSuccessful(false)
  //       return;
  //     }
  //   } catch (error) {
  //     // if (error.response) {
  //     //   // The request was made and the server responded with a status code
  //     //   // that falls out of the range of 2xx
  //     //   console.log(error.response.data);
  //     //   console.log(error.response.status);
  //     //   console.log(error.response.headers);
  //     //   if (error.response.status == HttpStatusCode.Conflict) {
  //     //     setLoginText('A user with that e-mail has already been registered.')
  //     //     setLoginSuccessful(false)
  //     //   } else if (error.response.status < 500 ) {
  //     //     setLoginText('The user was not accepted. You know what you did.')
  //     //     setLoginSuccessful(false)
  //     //   } else {
  //     //     setLoginText('There was a server error. Try again later.')
  //     //     setLoginSuccessful(false)
  //     //   }
  //     // } else if (error.request) {
  //     //   // The request was made but no response was received
  //     //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //     //   // http.ClientRequest in node.js
  //     //   console.log(error.request);
  //     //   setLoginText('The user could not be created at this time. Try again later.')
  //     //   setLoginSuccessful(false)
  //     // } else {
  //     //   // Something happened in setting up the request that triggered an Error
  //     //   // Client side issue, should be traced.
  //     //   setLoginText('The user could not be created at this time. Try again later.')
  //     //   setLoginSuccessful(false)
  //     //   console.log('Error', error.message);
  //     // }
  //     return;
  //   }
  //   setLoginText('Login successful!')
  //   setLoginSuccessful(true)
  // }

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
      <Button label="Login" theme="primary" onPress={async () => await login(email, password)} />
      <Text style={styles.text} onPress={() => navigation.navigate('Signup')}>No user? Sign up!</Text>
      <Text style={[styles.text, loginSuccessful ? styles.loginSuccessfulText : styles.loginFailedText]}>{loginText}</Text>
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
  loginSuccessfulText: {
    color: 'green',
  },
  loginFailedText: {
    color: 'red',
  }
});
