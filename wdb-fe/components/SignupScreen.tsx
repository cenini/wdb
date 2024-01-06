import * as React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Button from "./Button";
import axios, { HttpStatusCode } from "axios";
import Constants from "expo-constants";
import { AuthContext } from "../App";
import { useContext } from "react";
import { CommonStyles } from "./Styles";

export default function SignupScreen({ navigation }) {
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [userCreationFailedText, setUserCreationFailedText] =
    React.useState("");

  async function trySignUp(email: string, password: string): Promise<void> {
    try {
      await signup(email, password);
    } catch (e) {
      console.log(e);
      setUserCreationFailedText(e.message);
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
        label="Sign up"
        theme="primary"
        onPress={async () => await trySignUp(email, password)}
        width={320}
        height={68}
      />
      <Text style={styles.text} onPress={() => navigation.navigate("Login")}>
        Already have a user? Log in!
      </Text>
      <Text style={[styles.text, styles.userCreatedFailText]}>
        {userCreationFailedText}
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
  userCreatedSuccessText: {
    color: "green",
  },
  userCreatedFailText: {
    color: "red",
  },
});
