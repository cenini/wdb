import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Button from "./Button";
import { ItemModel, PhotoModel, TagType } from "../models/ItemModel";
import { useState } from "react";
import Constants from "expo-constants";
import ImageBox from "./ImageBox";
import TagEditor from "./TagEditor";
import { KvpTagModel, NameTagModel } from "../models/TagModel";
import {
  ExtractKvpTagModelsFromTagModels,
  ExtractNameTagModelsFromTagModels,
} from "../utils/Convert";
import { Entypo } from "@expo/vector-icons";
import { ButtonStyles, CommonStyles } from "./Styles";
import { OutfitModel, OutfitPhotoModel } from "../models/OutfitModel";
import axios from "axios";
import { CreateOutfitPhotoDto, CreateOutfitWornAtDateDto, DeleteOutfitItemsDto, OutfitDto } from "../dto/OutfitDto";
import { ImageModel } from "../models/ImageModel";
import { MAX_IMAGE_SIZE_IN_PX } from "../utils/Constants";
import { Resize } from "../utils/Image";
import { plainToInstance } from "class-transformer";
import OutfitItemViewer from "./OutfitItemViewer";
import qs from "qs";
import { CreateItemTagsDto, ItemDto } from "../dto/ItemDto";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

const SAMPLE_OUTFIT = "https://media.glamourmagazine.co.uk/photos/64469497fd405205dbee625c/16:9/w_2240,c_limit/OUTFIT%20IDEAS%20240423.jpg";

function isToday(date: Date) {
  const today = new Date()
  return new Date(today.toDateString()) !== new Date((new Date(date)).toDateString())
}

const OutfitManagementScreen = ({
  outfit,
  updateOutfit,
  deleteOutfit,
  // TODO: Should be a function like "handleItemRemovedFromOutfit" or something instead
  reloadOutfits, 
  onClose,
}: {
  outfit: OutfitModel;
  updateOutfit: (
  ) => Promise<void>;
  deleteOutfit: (outfit: OutfitModel) => Promise<void>;
  reloadOutfits: () => Promise<void>;
  onClose: () => void;
}) => {
  const [name, setName] = useState(outfit.name);
  const [items, setItems] = useState([] as ItemModel[]);
  const [selectedItems, setSelectedItems] = useState([] as ItemModel[]);
  const [wornToday, setWornToday] = useState(outfit.wornAt.length !== 0 ? isToday(outfit.wornAt[outfit.wornAt.length - 1]) : false);
  const [isToggleWornEnabled, setIsToggleWornEnabled] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      getItemsAsync();

      return () => {
        // Do something when the screen is unfocused
      };
    }, [])
  );

  const handleTagBoxSave = (tag: NameTagModel | KvpTagModel) => {
    // if (tag instanceof NameTagModel) {
    //   setNameTags([...nameTags, tag]);
    // } else {
    //   setKvpTags([...kvpTags, tag]);
    // }
  };

  function toggleWornToday() {
    setIsToggleWornEnabled(false);
    axios
      .post(
        `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}outfits/${outfit.id}/worn-at-dates`, 
        plainToInstance(CreateOutfitWornAtDateDto, { date: new Date() })
      )
      .then((response) => {
        // (response.data as OutfitDto)
        const updatedOutfit = response.data as OutfitDto;
        setWornToday(updatedOutfit.wornAt.length !== 0 && isToday(updatedOutfit.wornAt[updatedOutfit.wornAt.length - 1]))
        // if (updatedOutfit.wornAt.length !== 0 ? isToday(updatedOutfit.wornAt[updatedOutfit.wornAt.length - 1]) : false) {
        //   setWornToday()
        //   // setWornToday(previousState => !previousState);
        // }
      })
      .catch((err) => {
        setError(err.message);
      });
    setIsToggleWornEnabled(true);
  }

  const getItemsAsync = async () => {
    console.log("Getting items for outfit...")
    console.log(outfit)
    axios
      .get(
        `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items`, 
        { 
          params: { ids: outfit.outfitItems.map(item => item.itemId) },
          paramsSerializer: params => {
            return qs.stringify(params)
          }
        })
      .then((response) => {
        const items = plainToInstance(ItemModel, response.data as ItemDto[]);
        console.log(items);
        setItems([...items]);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const updateItem = async (
    itemToUpdate: ItemModel,
    title: string,
    nameTags: NameTagModel[],
    kvpTags: KvpTagModel[]
  ) => {
    const tagsResponse = await axios.post(
      `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${itemToUpdate.id}/tags`,
      plainToInstance(CreateItemTagsDto, {
        nameTags: nameTags.filter((nameTag) => nameTag.name !== ""),
        kvpTags: kvpTags.filter(
          (kvpTag) => kvpTag.key !== "" && kvpTag.value !== ""
        ),
      })
    );
    axios
      .get(
        `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${itemToUpdate.id}`
      )
      .then((response) => {
        const updatedItem = plainToInstance(
          ItemModel,
          response.data as ItemDto
        );
        const updatedItems = items.map((item) => {
          if (item.id === updatedItem.id) {
            return updatedItem;
          }
          return item;
        });
        setItems(updatedItems);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  };

  const deleteItem = async (deletedItem: ItemModel) => {
    const deleteResponse = await axios.delete(
      `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${deletedItem.id}`
    );
    console.log("Items before")
    console.log(items)
    setItems(items.filter((item) => item.id !== deletedItem.id));
    console.log("Items after")
    console.log(items)
    // setCurrentPage(0);
  };

  const addPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0,
      base64: true,
    });

    if (result.canceled) {
      return;
    }

    axios
      .post(
        `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}outfits/${outfit.id}/photos`, 
        plainToInstance(CreateOutfitPhotoDto, { base64photo: (await Resize(result.assets[0], MAX_IMAGE_SIZE_IN_PX)).uri })
        )
      .then((response) => {
        // Do something?
      })
      .catch((err) => {
        // Do something? 
      });
  };

  const handleDelete = async () => {
    // Alert.alert("Are you sure?", "Deletion can not be reverted", [
    //   {
    //     text: "Cancel",
    //     onPress: () => {},
    //     style: "cancel",
    //   },
    //   {
    //     text: "OK",
    //     onPress: async () => {
    //       await deleteItem(item);
    //       await onClose();
    //     },
    //   },
    // ]);
    await deleteOutfit(outfit);
    await onClose();
  };

  const handleClose = async () => {
    // console.log("Clicked close button!");
    // await updateItem(outfit, name, nameTags, kvpTags);
    onClose();
  };

  async function removeItemsFromOutfit(): Promise<void> {
    console.log("hello world")
    axios
    .delete(
      `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}outfits/${outfit.id}/items`, 
      { 
        params: { ids: selectedItems.map(item => item.id) },
        paramsSerializer: params => {
          return qs.stringify(params)
        }
      })
    .then((response) => {
      setItems(items.filter((item) => !selectedItems.map(selectedItem => selectedItem.id).includes(item.id)));
      setSelectedItems([]);
      reloadOutfits();
    })
    .catch((err) => {
      // Do something? 
    });
  }

  function handleSelectItem(item: ItemModel) {
    setSelectedItems((prevSelectedItems) => {
      // Check if the item is already in the selectedItems array
      if (
        !prevSelectedItems.some((selectedItem) => selectedItem.id === item.id)
      ) {
        // If not, add it to the array
        return [...prevSelectedItems, item];
      }
      // Otherwise, return the array without that item
      return prevSelectedItems.filter(
        (selectedItem) => selectedItem.id !== item.id
      );
    });
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handleClose} style={styles.crossStyle}>
        <Entypo name="cross" size={24} color="#fff" />
      </Pressable>
      <TextInput
        placeholder={"Title"}
        style={CommonStyles.textInput}
        onChangeText={setName}
        value={name}
      />
      <ImageBox imageUri={outfit.outfitPhotos.length > 0 ? outfit.outfitPhotos[0].url : SAMPLE_OUTFIT} onSaveTag={handleTagBoxSave} />
      <View style={[styles.wornAtContainer]}>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={wornToday ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleWornToday}
          value={wornToday}
          disabled={!isToggleWornEnabled}
        />
      </View>
      <View style={[styles.buttonContainer]}>
        <Button
          label={"Add photos"}
          symbol={"picture-o"}
          onPress={addPhoto}
          style={{
            ...ButtonStyles.buttonLarge,
            ...ButtonStyles.buttonPrimaryColor,
            ...{ margin: 10 },
          }}
        />
        <Button
          label={"Delete outfit"}
          symbol={"picture-o"}
          onPress={handleDelete}
          style={{
            ...ButtonStyles.buttonMedium,
            ...ButtonStyles.buttonWarningColor,
            ...{ margin: 10 },
          }}
        />
        <Button
          label={"Remove items from outfit"}
          symbol={"picture-o"}
          onPress={removeItemsFromOutfit}
          style={{
            ...ButtonStyles.buttonMedium,
            ...ButtonStyles.buttonSecondaryColor,
            ...{ margin: 10 },
          }}
        />
        {/* <TagEditor
          nameTags={nameTags}
          kvpTags={kvpTags}
          nameTagSuggestions={[]}
          onAcceptAllTags={null}
          onRejectAllTags={null}
          onAcceptSuggestedNameTag={null}
          kvpTagSuggestions={[]}
          onAcceptSuggestedKvpTag={null}
          setNameTags={setNameTags}
          setKvpTags={setKvpTags}
        /> */}
      </View>
      <OutfitItemViewer outfit={outfit} items={items} selectedItems={selectedItems} handleSelectItem={handleSelectItem} updateItem={updateItem} deleteItem={deleteItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: CommonStyles.view.backgroundColor,
  },
  container: {
    flex: 1,
    backgroundColor: CommonStyles.view.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  wornAtContainer: {
    alignItems: "center",
    padding: 3,
    marginVertical: 5,
  },
  buttonContainer: {
    alignItems: "center",
    padding: 3,
    marginVertical: 5,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
  imageContainer: {
    position: "relative",
    flex: 1,
  },
  tagBoxContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  crossStyle: {
    width: 24,
    height: 24,
    margin: 20,
  },
});

export default OutfitManagementScreen;
