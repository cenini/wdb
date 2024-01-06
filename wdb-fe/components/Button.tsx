import {
  StyleSheet,
  View,
  Pressable,
  Text,
  GestureResponderEvent,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";

export interface ButtonStyle {
  width: number;
  height: number;
  margin: number;
}

export default function Button({
  label,
  onPress,
  symbol = null,
  icon = null,
  theme = "",
  width = 320,
  height = 68,
  margin = 0,
}) {
  const [isPressedIn, setIsPressedIn] = useState(false);

  function handlePressIn(event: GestureResponderEvent): void {
    setIsPressedIn(true);
  }

  function handlePressOut(event: GestureResponderEvent): void {
    setIsPressedIn(false);
  }

  if (theme === "primary") {
  }

  const ButtonBorderWidth = 4;
  const ButtonShadowHeight = 6;
  const styles = StyleSheet.create({
    buttonContainer: {
      // width: style.width,
      // height: style.height,
      // margin: style.margin,
      width: width,
      height: height,
      margin: margin,
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

  return (
    <View style={[styles.buttonContainer]}>
      <Pressable
        style={isPressedIn ? styles.buttonPressed : styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {icon !== null ? icon : <></>}
        {icon === null && symbol !== null && symbol !== "" ? (
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
