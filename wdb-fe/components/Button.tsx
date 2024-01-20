import {
  StyleSheet,
  View,
  Pressable,
  Text,
  GestureResponderEvent,
  ViewStyle,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";

export interface ButtonStyle {
  width: number;
  height: number;
  margin?: number;
  backgroundColor: string;
  shadowColor: string;
  labelColor: string;
}

export default function Button({
  label,
  onPress,
  style = null,
  symbol = null,
  icon = null,
  theme = "",
}: {
  label?: string;
  onPress: any; // function to call on button press
  style: ButtonStyle;
  symbol?: any; // fontawesome symbol string
  icon?: any; // icon component
  theme?: string;
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
  const buttonContainerStyle =
    style !== null
      ? ({
          width: style.width,
          height: style.height,
          margin: style.margin ?? 0,
          alignItems: "center",
          justifyContent: "center",
          padding: 3,
        } as ViewStyle)
      : ({
          margin: style.margin ?? 0,
          alignItems: "center",
          justifyContent: "center",
          padding: 3,
        } as ViewStyle);

  const styles = StyleSheet.create({
    buttonContainer: buttonContainerStyle,
    button: {
      borderRadius: 10,
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      backgroundColor: style?.backgroundColor ?? "#ffffff", // should be white or dark gray depending on theme
      shadowColor: style?.shadowColor ?? "#000000",
      shadowOffset: { width: 0, height: ButtonShadowHeight },
      borderWidth: ButtonBorderWidth,
      borderColor: style?.shadowColor ?? "#000000",
    },
    buttonPressed: {
      borderRadius: 10,
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      backgroundColor: style?.backgroundColor ?? "#ffffff",
      borderWidth: ButtonBorderWidth,
      borderColor: style?.shadowColor ?? "#000000",
      marginTop: ButtonBorderWidth + ButtonShadowHeight,
    },
    buttonIcon: {
      paddingRight: 8,
    },
    buttonLabel: {
      color: style?.labelColor ?? "#000000", // "#fff",
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
            color={style?.labelColor ?? "#000000"}
            style={styles.buttonIcon}
          />
        ) : (
          <></>
        )}
        <Text style={[styles.buttonLabel]}>{label}</Text>
      </Pressable>
    </View>
  );
}
