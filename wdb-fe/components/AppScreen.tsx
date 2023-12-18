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
import { StyleSheet, View } from "react-native";
import PhotoButton from "./PhotoButton";
import Button from "./Button";
import { AuthContext } from "../App";
import { NewItemModel } from "../models/ItemModel";
import { plainToClass, plainToInstance } from "class-transformer";
import { NameTagModel } from "../models/TagModel";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import React from "react";
import NewItemManagementScreen from "./NewItemManagementScreen";
import { ImageModel } from "../models/ImageModel";

const Stack = createNativeStackNavigator();
export const NewItemsContext = createContext(null);

export default function AppScreen() {
  // Should probably be called like the home screen or something
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

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

  useEffect(() => {
    if (state.newItems.length !== 0) {
      navigation.navigate("ManageNewItems");
    }
    // Perform any actions you need after the state has been updated
  }, [state.newItems]);

  return (
    <NewItemsContext.Provider
      value={{
        newItems: state.newItems,
        addImages: addItemsContext.addImages,
        dispatch,
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="ManageNewItems"
            component={NewItemManagementScreen}
            initialParams={{ newItems: state.newItems }}
          />
          {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        </>
      </Stack.Navigator>
    </NewItemsContext.Provider>
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
