import * as React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Button from './Button';
import axios, { HttpStatusCode } from 'axios';
import Constants from 'expo-constants';
import { AuthContext } from '../App';
import { useContext } from 'react';


export default function SignupScreen({ navigation }) {
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [userCreationFailedText, setUserCreationFailedText] = React.useState('');

  async function trySignUp(email: string, password: string) : Promise<void> {
    try {
      await signup(email, password);
    } catch (e) {
      console.log(e)
      setUserCreationFailedText(e.message);
    }
  }

  return (
    <View style={styles.container}>
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
      <Button label="Sign up" theme="primary" onPress={async () => await trySignUp(email, password)} />
      <Text style={styles.text} onPress={() => navigation.navigate('Login')}>Already have a user? Log in!</Text>
      <Text style={[styles.text, styles.userCreatedFailText]}>{userCreationFailedText}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: 'flex-start', // Start aligning items from the top
  },
  input: {
    width: 340,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textDecorationColor: '#fff'
    // color: '#fff',
    // borderColor: '#fff',
  },
  text: {
    height: 40,
    margin: 12,
    padding: 10,
    color: '#fff',
  },
  userCreatedSuccessText: {
    color: 'green',
  },
  userCreatedFailText: {
    color: 'red',
  }
});
