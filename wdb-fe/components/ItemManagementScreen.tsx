import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";
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

const ItemManagementScreen = ({
  item,
  updateItem,
  onClose,
}: {
  item: ItemModel;
  updateItem: (
    title: string,
    nameTags: NameTagModel[],
    kvpTags: KvpTagModel[]
  ) => Promise<void>;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState(item.title);
  const [nameTags, setNameTags] = useState(
    ExtractNameTagModelsFromTagModels(item.tags)
  );

  const [kvpTags, setKvpTags] = useState(
    ExtractKvpTagModelsFromTagModels(item.tags)
  );

  const handleTagBoxSave = (tag: NameTagModel | KvpTagModel) => {
    // if (tag instanceof NameTagModel) {
    //   setNameTags([...nameTags, tag]);
    // } else {
    //   setKvpTags([...kvpTags, tag]);
    // }
  };

  const addPhotos = (photos: PhotoModel) => {};

  const handleClose = async () => {
    await updateItem(title, nameTags, kvpTags);
    onClose();
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Button
        label={""}
        symbol={"picture-o"}
        onPress={handleClose}
        width={24}
        height={24}
        margin={20}
      />
      <TextInput
        placeholder={"Title"}
        style={styles.input}
        onChangeText={setTitle}
        value={title}
      />
      <ImageBox imageUri={item.photos[0].url} onSaveTag={handleTagBoxSave} />
      <View style={[styles.buttonContainer]}>
        <Button
          label={"Add photos"}
          symbol={"picture-o"}
          onPress={addPhotos}
          width={320}
          height={68}
          margin={20}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    margin: 12,
    marginVertical: 5,
    borderWidth: 1,
    padding: 10,
    width: 240,
  },
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    // justifyContent: 'center',
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
});

export default ItemManagementScreen;
