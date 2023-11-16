import { createContext, useContext, useMemo, useReducer, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, View} from "react-native";
import ImageViewer from './ImageViewer';
import PhotoButton from './PhotoButton';
import Button from './Button';
import { AuthContext } from '../App';
import { ItemModel } from '../models/ItemModel'
import { plainToClass, plainToInstance } from 'class-transformer';
import { TagModel } from '../models/TagModel';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddImagesScreen from './AddImagesScreen';

const PlaceholderImage = require("../assets/images/background-image.png");
const Stack = createNativeStackNavigator();
export const NewItemsContext = createContext(null);

export default function ItemManagementScreen() {
  const { logout } = useContext(AuthContext);
  const newItems: ItemModel[] = [];

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'ADD_ITEMS':
          const newItems = action.images.map((image) => plainToClass(ItemModel, { image: image, tags: []}))
          return {
            ...prevState,
            newItems: [...state.newItems, newItems],
          };
        case 'TAG_ITEM':
          return {
            ...prevState,
            newItems: state.newItems.map((newItem: ItemModel) => {
              if (newItem.image.assetId === action.item.image.assetId) {
                newItem.tags.push(action.tags);
              }
              return newItem;
            }),
          };
      }
    },
    {
      newItems: newItems,
    }
  );

  const newItemsContext = useMemo(
    () => ({
      addImages: async (imagePickerAssets: ImagePicker.ImagePickerAsset[]) => {
        if (imagePickerAssets.length === 0) {
          return
        }
        dispatch({ type: 'ADD_ITEMS', images: imagePickerAssets });
      },
      tagNewItem: async (tags: TagModel[], newItem: ItemModel) => {
        if (tags.length === 0) {
          return
        }
        dispatch({ type: 'TAG_ITEM', newItem: newItem, tags: tags})
      }
    }),
    []
  )

  return (
    <NewItemsContext.Provider value={newItemsContext}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {state.newItems.length === 0 
        ? (
          <>
            <Stack.Screen name="AddImages" component={AddImagesScreen} />
          </>) 
        : (
          <>
            {/* <Stack.Screen name="ManageNewItems" component={ManageNewItemsScreen} /> */}
            {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
          </>)
        }
      </Stack.Navigator>
    </NewItemsContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
