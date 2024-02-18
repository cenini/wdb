import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import Button from "./Button";
import { ItemModel, PhotoModel, TagType } from "../models/ItemModel";
import { useState } from "react";
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

const SAMPLE_OUTFIT = "https://media.glamourmagazine.co.uk/photos/64469497fd405205dbee625c/16:9/w_2240,c_limit/OUTFIT%20IDEAS%20240423.jpg";

const OutfitManagementScreen = ({
  outfit,
  updateOutfit,
  deleteOutfit,
  onClose,
}: {
  outfit: OutfitModel;
  updateOutfit: (
    // item: ItemModel,
    // name: string,
    // nameTags: NameTagModel[],
    // kvpTags: KvpTagModel[]
  ) => Promise<void>;
  deleteOutfit: (outfit: OutfitModel) => Promise<void>;
  onClose: () => void;
}) => {
  const [name, setName] = useState(outfit.name);
  // const [nameTags, setNameTags] = useState(
  //   ExtractNameTagModelsFromTagModels(item.tags)
  // );

  // const [kvpTags, setKvpTags] = useState(
  //   ExtractKvpTagModelsFromTagModels(item.tags)
  // );

  const handleTagBoxSave = (tag: NameTagModel | KvpTagModel) => {
    // if (tag instanceof NameTagModel) {
    //   setNameTags([...nameTags, tag]);
    // } else {
    //   setKvpTags([...kvpTags, tag]);
    // }
  };

  const addPhotos = (photos: OutfitPhotoModel[]) => {};

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
