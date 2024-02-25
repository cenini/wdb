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
import Button from "../../components/Button";
import { ItemModel, PhotoModel, TagType } from "../../models/ItemModel";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import ImageBox from "../../components/ImageBox";
import TagEditor from "../../components/TagEditor";
import { KvpTagModel, NameTagModel } from "../../models/TagModel";
import {
  ExtractKvpTagModelsFromTagModels,
  ExtractNameTagModelsFromTagModels,
} from "../../utils/Convert";
import { Entypo } from "@expo/vector-icons";
import { ButtonStyles, CommonStyles } from "../../components/Styles";
import { OutfitModel, OutfitPhotoModel } from "../../models/OutfitModel";
import axios from "axios";
import { CreateOutfitPhotoDto, CreateOutfitWornAtDateDto, DeleteOutfitItemsDto, OutfitDto } from "../../dto/OutfitDto";
import { MAX_IMAGE_SIZE_IN_PX } from "../../utils/Constants";
import { Resize } from "../../utils/Image";
import { plainToInstance } from "class-transformer";
import OutfitItemViewer from "../../components/OutfitItemViewer";
import qs from "qs";
import { CreateItemTagsDto, ItemDto } from "../../dto/ItemDto";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";

const SAMPLE_OUTFIT = "https://media.glamourmagazine.co.uk/photos/64469497fd405205dbee625c/16:9/w_2240,c_limit/OUTFIT%20IDEAS%20240423.jpg";

function isToday(date: Date) {
  const today = new Date()
  return new Date(today.toDateString()) !== new Date((new Date(date)).toDateString())
}

const OutfitManagementScreen = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const [outfit, setOutfit] = useState(null as OutfitModel);
  const [name, setName] = useState("");
  const [items, setItems] = useState([] as ItemModel[]);
  const [wornToday, setWornToday] = useState(false);
  const [isToggleWornEnabled, setIsToggleWornEnabled] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      getOutfitAsync().then(() => {setIsLoading(false)});

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

  function setWornTodayFromOutfit(outfit: OutfitModel) {
    setWornToday(outfit.wornAt.length !== 0 ? isToday(outfit.wornAt[outfit.wornAt.length - 1]) : false);
  }

  const deleteOutfit = async (outfit: OutfitModel) => {}

  function toggleWornToday() {
    setIsToggleWornEnabled(false);
    axios
      .post(
        `${process.env.EXPO_PUBLIC_API_URL}outfits/${id}/worn-at-dates`, 
        plainToInstance(CreateOutfitWornAtDateDto, { date: new Date() })
      )
      .then((response) => {
        // (response.data as OutfitDto)
        const updatedOutfit = plainToInstance(OutfitModel, response.data as OutfitDto);
        setWornTodayFromOutfit(updatedOutfit)
      })
      .catch((err) => {
        setError(err.message);
      });
    setIsToggleWornEnabled(true);
  }

  const getOutfitAsync = async () => {
    axios
      .get(`${process.env.EXPO_PUBLIC_API_URL}outfits/${id}`)
      .then(async (response) => {
        const retrievedOutfit = plainToInstance(OutfitModel, response.data as OutfitDto);
        setOutfit(retrievedOutfit);
        setName(retrievedOutfit.name);
        setWornTodayFromOutfit(retrievedOutfit);  
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const getItemsAsync = async (outfit: OutfitModel) => {
    console.log("Getting items for outfit...")
    console.log(outfit)
    axios
      .get(
        `${process.env.EXPO_PUBLIC_API_URL}items`, 
        { 
          params: { ids: outfit.outfitItems.map(item => item.itemId) },
          paramsSerializer: params => {
            return qs.stringify(params)
          }
        })
      .then((response) => {
        console.log("Retrieved items...")
        const items = plainToInstance(ItemModel, response.data as ItemDto[]);
        console.log(items);
        setItems([...items]);
      })
      .catch((err) => {
        setError(err.message);
      });
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
        `${process.env.EXPO_PUBLIC_API_URL}outfits/${outfit.id}/photos`, 
        plainToInstance(CreateOutfitPhotoDto, { base64photo: (await Resize(result.assets[0], MAX_IMAGE_SIZE_IN_PX)).uri })
        )
      .then((response) => {
        // Do something?
      })
      .catch((err) => {
        // Do something? 
      });
  };

  function onClose() {
    if (router.canGoBack()) { 
      router.back() 
    } else {
      router.replace("/outfits/")
    }
  }

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
    onClose();
  };

  const handleClose = async () => {
    // console.log("Clicked close button!");
    // await updateItem(outfit, name, nameTags, kvpTags);
    onClose();
  };

  return (
    <>
      { isLoading ? (
        <></>
      ) : (
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
          <ImageBox imageUri={outfit?.outfitPhotos?.length > 0 ? outfit.outfitPhotos[0].url : SAMPLE_OUTFIT} onSaveTag={handleTagBoxSave} />
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
          { outfit === null ? (<></>) : <OutfitItemViewer outfit={outfit} /> }
          {/* <OutfitItemViewer outfit={outfit} /> */}
          {/* <OutfitItemViewer outfit={new OutfitModel} /> */}
        </View>
      )}
    </>
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
