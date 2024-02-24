import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import Button from "../../components/Button";
import { ItemModel, PhotoModel, TagType } from "../../models/ItemModel";
import { useState } from "react";
import ImageBox from "../../components/ImageBox";
import TagEditor from "../../components/TagEditor";
import { KvpTagModel, NameTagModel } from "../../models/TagModel";
import {
  ExtractKvpTagModelsFromTagModels,
  ExtractNameTagModelsFromTagModels,
} from "../../utils/Convert";
import { Entypo } from "@expo/vector-icons";
import { ButtonStyles, CommonStyles } from "../../components/Styles";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import axios from "axios";
import React from "react";
import { CreateItemTagsDto, ItemDto } from "../../dto/ItemDto";
import { plainToClass, plainToInstance } from "class-transformer";

// const ItemManagementScreen = ({
//   item,
//   updateItem,
//   deleteItem,
//   onClose,
// }: {
//   item: ItemModel;
//   updateItem: (
//     item: ItemModel,
//     title: string,
//     nameTags: NameTagModel[],
//     kvpTags: KvpTagModel[]
//   ) => Promise<void>;
//   deleteItem: (item: ItemModel) => Promise<void>;
//   onClose: () => void;
// }) => {
  const ItemManagementScreen = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const [item, setItem] = useState(null);

  // const [title, setTitle] = useState(item.title);
  const [title, setTitle] = useState("");

  const [nameTags, setNameTags] = useState(null)
  // const [nameTags, setNameTags] = useState(
  //   ExtractNameTagModelsFromTagModels(item.tags)
  // );

  const [kvpTags, setKvpTags] = useState(null)
  // const [kvpTags, setKvpTags] = useState(
  //   ExtractKvpTagModelsFromTagModels(item.tags)
  // );
  // console.log("Inside item management screen!")
  // console.log(item)

  useFocusEffect(
    React.useCallback(() => {
      getItemAsync();

      return () => {
        // Do something when the screen is unfocused
      };
    }, [])
  );

  function onItemRetrieved(item: ItemModel) {
    setItem(item);
    setTitle(item.title);
    setNameTags(ExtractNameTagModelsFromTagModels(item.tags))
    setKvpTags(ExtractKvpTagModelsFromTagModels(item.tags))
  }
  
  const getItemAsync = async () => {
    axios
      .get(`${process.env.EXPO_PUBLIC_API_URL}items/${id}`)
      .then((response) => {
        const item = plainToInstance(ItemModel, response.data as ItemDto);
        onItemRetrieved(item);
      })
      .catch((err) => {
        // setError(err.message);
        // setLoading(false);
      });
  };



  const handleTagBoxSave = (tag: NameTagModel | KvpTagModel) => {
    // if (tag instanceof NameTagModel) {
    //   setNameTags([...nameTags, tag]);
    // } else {
    //   setKvpTags([...kvpTags, tag]);
    // }
  };

  const addPhotos = (photos: PhotoModel) => {};


  const updateItem = async (
    nameTags: NameTagModel[],
    kvpTags: KvpTagModel[]
  ) => {
    const tagsResponse = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}items/${item.id}/tags`,
      plainToClass(CreateItemTagsDto, {
        nameTags: nameTags.filter((nameTag) => nameTag.name !== ""),
        kvpTags: kvpTags.filter(
          (kvpTag) => kvpTag.key !== "" && kvpTag.value !== ""
        ),
      })
    );
    axios
      .get(
        `${process.env.EXPO_PUBLIC_API_URL}items/${item.id}`
      )
      .then((response) => {
        const updatedItem = plainToInstance(
          ItemModel,
          response.data as ItemDto
        );
        onItemRetrieved(item);
        // const updatedItems = items.map((item) => {
        //   if (item.id === updatedItem.id) {
        //     return updatedItem;
        //   }
        //   return item;
        // });
        // setItems(updatedItems);
      })
      .catch((err) => {
        // console.log(err);
        // setError(err.message);
        // setLoading(false);
      });
  };

  const deleteItem = async (deletedItem: ItemModel) => {
    const deleteResponse = await axios.delete(
      `${process.env.EXPO_PUBLIC_API_URL}items/${deletedItem.id}`
    );
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
    await deleteItem(item);
    router.back();
  };

  const handleClose = async () => {
    updateItem(nameTags, kvpTags);
    router.back();
  };

  return (
    <>
      {item === null 
        ? (
          <Text>Loading...</Text>
          ) 
        : (
          <View style={styles.container}>
          <Pressable onPress={handleClose} style={styles.crossStyle}>
            <Entypo name="cross" size={24} color="#fff" />
          </Pressable>
          <TextInput
            placeholder={"Title"}
            style={CommonStyles.textInput}
            onChangeText={setTitle}
            value={title}
          />
          <ImageBox imageUri={item.photos[0].url} onSaveTag={handleTagBoxSave} />
          <View style={[styles.buttonContainer]}>
            <Button
              label={"Add photos"}
              symbol={"picture-o"}
              onPress={addPhotos}
              style={{
                ...ButtonStyles.buttonLarge,
                ...ButtonStyles.buttonPrimaryColor,
                ...{ margin: 10 },
              }}
            />
            <Button
              label={"Delete item"}
              symbol={"picture-o"}
              onPress={handleDelete}
              style={{
                ...ButtonStyles.buttonMedium,
                ...ButtonStyles.buttonWarningColor,
                ...{ margin: 10 },
              }}
            />
            <TagEditor
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
            />
          </View>
        </View>
        )
      }
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

export default ItemManagementScreen;
