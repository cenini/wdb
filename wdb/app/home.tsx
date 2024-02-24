import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, View, Text, Image } from "react-native";

import { plainToClass, plainToInstance } from "class-transformer";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import HomeScreen from "./HomeScreen";
import React from "react";
// import NewItemManagementScreen from "./NewItemManagementScreen";
// import { ImageModel } from "../models/ImageModel";
import { NewItemModel } from "../models/ItemModel";
import { NameTagModel } from "../models/TagModel";
import { Stack, router } from "expo-router";
import { ImageModel } from "../models/ImageModel";
import { AuthContext } from "./_layout";
import { MAX_IMAGE_SIZE_IN_PX } from "../utils/Constants";
import { Resize } from "../utils/Image";
import { ButtonStyles, CommonStyles } from "../components/Styles";
import Button from "../components/Button";

// const Stack = createNativeStackNavigator();
export const NewItemsContext = createContext(null);

export default function HomeScreen() {
  // Should probably be called like the home screen or something
  const { userToken } = useContext(AuthContext);

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "ADD_ITEMS":
          const newItems = [
            ...state.newItems,
            ...action.images.map((image) =>
              plainToClass(NewItemModel, {
                image: image,
                tags: [] as NameTagModel[],
              })
            ),
          ];

          return {
            ...state,
            newItems: newItems,
          };
        case "REMOVE_FIRST_ITEM":
          return {
            ...state,
            newItems: state.newItems.slice(1),
          };
        default:
          return {
            ...state,
          };
      }
    },
    {
      newItems: [] as NewItemModel[],
    }
  );

  const addItemsContext = useMemo(
    () => ({
      addImages: async (images: ImageModel[]) => {
        if (images.length === 0) {
          return;
        }

        dispatch({ type: "ADD_ITEMS", images: images });
      },
      // ...
    }),
    [dispatch]
  );

  const pickImageAsync = async () => {
    if (userToken == null) {
      router.replace('/login');
      return;
    }
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

    const images = await Promise.all(
      result.assets.map((image) =>
        plainToInstance(ImageModel, Resize(image, MAX_IMAGE_SIZE_IN_PX))
      )
    );

    await addItemsContext.addImages(images);
    router.navigate({
      pathname: "/clothes/new",
      params: { imageUris: images.map(image => image.uri) }
    })
  };


  // useEffect(() => {
  //   if (state.newItems.length !== 0) {
  //     navigation.navigate("ManageNewItems");
  //   }
  //   // Perform any actions you need after the state has been updated
  // }, [state.newItems]);

  return (
    <NewItemsContext.Provider
      value={{
        newItems: state.newItems,
        addImages: addItemsContext.addImages,
        dispatch,
      }}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Make your wardrobe
            {"\n"}
            make sense
          </Text>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.heroImageContainer}>
            <Image
              source={require("../assets/images/hero.webp")}
              style={styles.heroImage}
            />
          </View>
          <Text style={styles.mainText}>Some main text here</Text>
          <Text style={styles.featureText}>* Smart organization</Text>
          <Text style={styles.featureText}>* Personal AI stylist</Text>
          <Text style={styles.featureText}>* ...</Text>
        </View>
        <View style={styles.footerContainer}>
          <Button
            symbol="picture-o"
            label="Add some images"
            onPress={pickImageAsync}
            style={{
              ...ButtonStyles.buttonLarge,
              ...ButtonStyles.buttonPrimaryColor,
              ...{ margin: 10 },
            }}
          />
        </View>
        <StatusBar style="auto" />
      </View>
    </NewItemsContext.Provider>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: CommonStyles.view.backgroundColor,
    alignItems: "center",
    justifyContent: "flex-start", // Start aligning items from the top
  },
  headerContainer: {
    flex: 0.75,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    color: "#fff",
    // fontFamily: "Your-Font-Family",
  },
  mainContainer: {
    flex: 2.5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  heroImageContainer: {
    width: "90%", // Keep width as is
    height: 350, // Increased height for more prominence
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000", // Adding shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mainText: {
    fontWeight: "normal",
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
    // fontFamily: "Your-Font-Family",
  },
  featureText: {
    fontWeight: "normal",
    fontSize: 18,
    textAlign: "left",
    color: "#fff",
    // fontFamily: "Your-Font-Family",
  },
});
