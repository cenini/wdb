import {
  StyleSheet,
  View,
  Pressable,
  Text,
  GestureResponderEvent,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";

export default function Button({ label, symbol, theme = "", onPress }) {
  const [isPressedIn, setIsPressedIn] = useState(false);

  function handlePressIn(event: GestureResponderEvent): void {
    setIsPressedIn(true);
  }

  function handlePressOut(event: GestureResponderEvent): void {
    setIsPressedIn(false);
  }

  if (theme === "primary") {
  }

  return (
    <View style={[styles.buttonContainer]}>
      <Pressable
        style={isPressedIn ? styles.buttonPressed : styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {symbol !== null && symbol !== "" ? (
          <FontAwesome
            name={symbol}
            size={18}
            color="#25292e"
            style={styles.buttonIcon}
          />
        ) : (
          <></>
        )}
        <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const ButtonBorderWidth = 4;
const ButtonShadowHeight = 6;
const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#EAECCC",
    shadowColor: "#DBCC95",
    shadowOffset: { width: 0, height: ButtonShadowHeight },
    borderWidth: ButtonBorderWidth,
    borderColor: "#DBCC95",
  },
  buttonPressed: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#EAECCC",
    borderWidth: ButtonBorderWidth,
    borderColor: "#DBCC95",
    marginTop: ButtonBorderWidth + ButtonShadowHeight,
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});
