import * as React from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from './Button';
import { useContext } from 'react';
import { AuthContext } from '../App';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginFailedText, setLoginFailedText] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const navigation = useNavigation()

  async function tryLogin(email: string, password: string) : Promise<void> {
    try {
      await login(email, password);
    } catch (e) {
      setLoginFailedText(e.message);
    }
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
      <Button label="Login" theme="primary" onPress={async () => await tryLogin(email, password)} />
      <Text style={styles.text} onPress={() => navigation.navigate('Signup')}>No user? Sign up!</Text>
      <Text style={[styles.text, styles.loginFailedText]}>{loginFailedText}</Text>
    </>
    // <View style={styles.container}>
    //   <TextInput
    //     style={styles.input}
    //     onChangeText={setEmail}
    //     value={email}
    //     placeholder='email'
    //   />
    //   <TextInput
    //     style={styles.input}
    //     onChangeText={setPassword}
    //     value={password}
    //     placeholder='password'
    //     secureTextEntry
    //   />
    //   <Button label="Login" theme="primary" onPress={async () => await login(email, password)} />
    //   <Text style={styles.text} onPress={() => navigation.navigate('Signup')}>No user? Sign up!</Text>
    //   <Text style={[styles.text, loginSuccessful ? styles.loginSuccessfulText : styles.loginFailedText]}>{loginText}</Text>
    // </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 3,
  },
  input: {
    width: 340,
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
