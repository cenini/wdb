import * as React from "react";
import { Text, TextInput, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "./Button";
import { useContext } from "react";
import { AuthContext } from "../App";
import { ButtonStyles, CommonStyles } from "./Styles";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginFailedText, setLoginFailedText] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);

  async function tryLogin(email: string, password: string): Promise<void> {
    try {
      await login(email, password);
    } catch (e) {
      setLoginFailedText(e.message);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={CommonStyles.textInput}
        onChangeText={setEmail}
        value={email}
        placeholder="email"
      />
      <TextInput
        style={CommonStyles.textInput}
        onChangeText={setPassword}
        value={password}
        placeholder="password"
        secureTextEntry
      />
      <Button
        label="Login"
        theme="primary"
        onPress={async () => await tryLogin(email, password)}
        style={{
          ...ButtonStyles.buttonLarge,
          ...ButtonStyles.buttonPrimaryColor,
        }}
      />
      <Text style={styles.text} onPress={() => navigation.navigate("Signup")}>
        No user? Sign up!
      </Text>
      <Text style={[styles.text, styles.loginFailedText]}>
        {loginFailedText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "flex-start", // Start aligning items from the top
  },
  text: {
    height: 40,
    margin: 12,
    padding: 10,
    color: "#fff",
  },
  loginSuccessfulText: {
    color: "green",
  },
  loginFailedText: {
    color: "red",
  },
});
