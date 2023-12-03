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
import ImageViewer from "./ImageViewer";
import PhotoButton from "./PhotoButton";
import Button from "./Button";
import { AuthContext } from "../App";
import { ItemModel } from "../models/ItemModel";
import { plainToClass, plainToInstance } from "class-transformer";
import { NameTagModel } from "../models/TagModel";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NewItemsContext } from "./ItemManagementScreen";

const PlaceholderImage = require("../assets/images/background-image.png");

export default function AddImagesScreen() {
  const { addImages } = useContext(NewItemsContext);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 10,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0,
    });

    if (result.canceled) {
      // alert('You did not select any image.');
      return;
    }

    await addImages(result.assets);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Should have a sample image showing what is "good" */}
        {/* <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
        /> */}
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
