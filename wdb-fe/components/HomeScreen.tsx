import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, View, Text, Image } from "react-native";
import PhotoButton from "./PhotoButton";
import Button from "./Button";
import { AuthContext } from "../App";
import { ItemModel } from "../models/ItemModel";
import { plainToClass, plainToInstance } from "class-transformer";
import { NameTagModel } from "../models/TagModel";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NewItemsContext } from "./AppScreen";

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
      {/* <View style={styles.imageContainer}>
      </View> */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Make your wardrobe 
          {'\n'}
          make sense
        </Text> 
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.heroImageContainer}>
          <Image source={require("../assets/images/hero.webp")} style={styles.heroImage} /> 
        </View>
        <Text style={styles.headerText}>
          Some main text here
        </Text> 
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
    justifyContent: 'flex-start', // Start aligning items from the top
  },
  headerContainer: {
    flex: 1, // Adjust this flex value to control the size of this container
    alignItems: "center",
    justifyContent: 'center', // Center content horizontally and vertically
    width: '100%', // Full width
    padding: 20, // Adjust padding as necessary
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
    // fontFamily: "Your-Font-Family",
  },
  mainContainer: {
    flex: 2, // Adjust this flex value to control the size of this container
    alignItems: "center",
    justifyContent: 'center', // Center content horizontally and vertically
    width: '100%',
  },
  heroImageContainer: {
    width: '90%', // Adjust as necessary
    height: 300, // Or use aspectRatio for dynamic sizing
    borderRadius: 10,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mainText: {
    fontWeight: "normal",
    fontSize: 16,
    textAlign: "center",
    color: "#fff", // Assuming white text
    // fontFamily: "Your-Font-Family",
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
