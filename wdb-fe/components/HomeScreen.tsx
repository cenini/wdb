import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, View } from "react-native";
import PhotoButton from "./PhotoButton";
import Button from "./Button";
import { AuthContext } from "../App";
import { ItemModel } from "../models/ItemModel";
import { plainToClass, plainToInstance } from "class-transformer";
import { NameTagModel } from "../models/TagModel";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NewItemsContext } from "./AppScreen";

const PlaceholderImage = require("../assets/images/background-image.png");

export default function HomeScreen() {
  const { addImages } = useContext(NewItemsContext);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 10,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0,
      base64: true,
    });

    if (result.canceled) {
      return;
    }

    await addImages(result.assets);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
      </View>
      <View style={styles.footerContainer}>
        <PhotoButton
          theme="primary"
          label="Add some images"
          onPress={pickImageAsync}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});
