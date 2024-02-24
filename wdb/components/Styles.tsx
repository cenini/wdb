import { StyleSheet, Pressable } from "react-native";

export const CommonStyles = StyleSheet.create({
  textInput: {
    width: 340,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textDecorationColor: "#fff",
    // placeholderTextColor: "#fff",
    color: "#fff",
    // color: '#fff',
    // borderColor: '#fff',
  },
  view: {
    backgroundColor: "#25292e",
  },
});

export const ButtonStyles = {
  buttonLarge: {
    width: 320,
    height: 68,
  },
  buttonMedium: {
    width: 160,
    height: 51,
  },
  buttonSmall: {
    width: 120,
    height: 34,
  },
  buttonPrimaryColor: {
    backgroundColor: "#EAECCC",
    shadowColor: "#DBCC95",
    labelColor: "#25292e",
  },
  buttonSecondaryColor: {
    backgroundColor: "#EAECCC",
    shadowColor: "#DBCC95",
    labelColor: "#25292e",
  },
  buttonWarningColor: {
    backgroundColor: "#FF8080",
    shadowColor: "#A44040",
    labelColor: "#25292e",
  },
};
