import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
} from "react-native";
import { NewItemsContext } from "./AppScreen";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import axios, { HttpStatusCode } from "axios";
import Constants from "expo-constants";
import {
  CreateItemDto,
  CreateItemPhotoDto,
  CreateItemTagsDto,
  ItemCreatedDto,
} from "../dto/ItemDto";
import { plainToClass, plainToInstance } from "class-transformer";
import { TitleAndDescribeItemDto, TitleAndDescriptionDto } from "../dto/AIDto";
import { KvpTagModel, NameTagModel } from "../models/TagModel";
import TagEditor from "./TagEditor";
import ImageBox from "./ImageBox";
import Button from "./Button";
import { ButtonStyles } from "./Styles";

export default function NewItemManagementScreen({ route, navigation }) {
  const { newItems, dispatch } = useContext(NewItemsContext);
  const [nameTags, setNameTags] = useState<NameTagModel[]>([]);
  const [kvpTags, setKvpTags] = useState<KvpTagModel[]>([]);
  const [nameTagSuggestions, setNameTagSuggestions] = useState<NameTagModel[]>(
    []
  );
  const [kvpTagSuggestions, setKvpTagSuggestions] = useState<KvpTagModel[]>([]);
  const [title, setTitle] = React.useState("");
  const [titlePlaceholder, setTitlePlaceholder] = React.useState("Title");
  const [initialNameTagSuggestions, setInitialNameTagSuggestions] = useState<
    NameTagModel[]
  >([]);
  const [initialKvpTagSuggestions, setInitialKvpTagSuggestions] = useState<
    KvpTagModel[]
  >([]);

  useEffect(() => {
    getSuggestion();
  }, [newItems]);

  async function getSuggestion(): Promise<void> {
    const titleAndDescriptionDto = plainToClass(
      TitleAndDescriptionDto,
      (
        await axios.post(
          `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}ai/titleAndDescription`,
          plainToClass(TitleAndDescribeItemDto, {
            title: title,
            base64photo: newItems[0].image.uri,
          })
        )
      ).data
    );
    setTitlePlaceholder(titleAndDescriptionDto.title);
    const instantiatedNameTagSuggestions = plainToInstance(
      NameTagModel,
      titleAndDescriptionDto.nameTags
    );
    const instantiatedKvpTagSuggestions = plainToInstance(
      KvpTagModel,
      titleAndDescriptionDto.kvpTags
    );
    setNameTagSuggestions(instantiatedNameTagSuggestions);
    setInitialNameTagSuggestions(instantiatedNameTagSuggestions);
    setKvpTagSuggestions(instantiatedKvpTagSuggestions);
    setInitialKvpTagSuggestions(instantiatedKvpTagSuggestions);
  }

  const handleAcceptSuggestedNameTag = (nameTag: NameTagModel) => {
    setNameTagSuggestions((nameTagSuggestions) =>
      nameTagSuggestions.filter(
        (suggestion) => suggestion.name !== nameTag.name
      )
    );
  };

  const handleAcceptSuggestedKvpTag = (kvpTag: KvpTagModel) => {
    setKvpTagSuggestions((kvpTagSuggestions) =>
      kvpTagSuggestions.filter(
        (suggestion) =>
          suggestion.key !== kvpTag.key && suggestion.value !== kvpTag.value
      )
    );
  };

  function handleAcceptAllTags(event: GestureResponderEvent): void {
    setNameTagSuggestions((nameTagSuggestions) =>
      nameTagSuggestions.filter(() => false)
    );
    setKvpTagSuggestions((kvpTagSuggestions) =>
      kvpTagSuggestions.filter(() => false)
    );
    setNameTags([...nameTags, ...nameTagSuggestions]);
    setKvpTags([...kvpTags, ...kvpTagSuggestions]);
  }

  function handleRejectAllTags(event: GestureResponderEvent): void {
    setNameTagSuggestions(initialNameTagSuggestions);
    setKvpTagSuggestions(initialKvpTagSuggestions);
    setNameTags(
      nameTags.filter(
        (nameTag) =>
          initialNameTagSuggestions.find(
            (nameTagSuggestion) => nameTagSuggestion.name == nameTag.name
          ) == undefined
      )
    );
    setKvpTags(
      kvpTags.filter(
        (kvpTag) =>
          initialKvpTagSuggestions.find(
            (kvpTagSuggestion) =>
              kvpTagSuggestion.key == kvpTag.key &&
              kvpTagSuggestion.value == kvpTag.value
          ) == undefined
      )
    );
    setNameTagSuggestions((nameTagSuggestions) =>
      nameTagSuggestions.filter(() => true)
    );
    setKvpTagSuggestions((kvpTagSuggestions) =>
      kvpTagSuggestions.filter(() => true)
    );
  }

  function resetTags(): void {
    setNameTags([]);
    setKvpTags([]);
  }

  async function createItem(event: GestureResponderEvent): Promise<void> {
    const itemResponse = await axios.post(
      `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items`,
      plainToClass(CreateItemDto, {
        title: title === "" ? titlePlaceholder : title,
      })
    );
    if (itemResponse.status != HttpStatusCode.Created) {
      // show some error
      return;
    }
    const item = plainToClass(ItemCreatedDto, itemResponse.data);
    const photoResponse = await axios.post(
      `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${item.id}/photos`,
      plainToClass(CreateItemPhotoDto, { base64photo: newItems[0].image.uri })
    );
    const tagsResponse = await axios.post(
      `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${item.id}/tags`,
      plainToClass(CreateItemTagsDto, {
        nameTags: nameTags.filter((nameTag) => nameTag.name !== ""),
        kvpTags: kvpTags.filter(
          (kvpTag) => kvpTag.key !== "" && kvpTag.value !== ""
        ),
      })
    );
    resetTags();

    // Dispatch an action to remove the item
    dispatch({ type: "REMOVE_FIRST_ITEM" });
    if (newItems.length === 1) {
      navigation.goBack();
      return;
    }
  }

  const handleTagBoxSave = (tag: NameTagModel | KvpTagModel) => {
    if (tag instanceof NameTagModel) {
      setNameTags([...nameTags, tag]);
    } else {
      setKvpTags([...kvpTags, tag]);
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <TextInput
        placeholder={titlePlaceholder}
        style={styles.input}
        onChangeText={setTitle}
        value={title}
      />
      <ImageBox imageUri={newItems[0].image.uri} onSaveTag={handleTagBoxSave} />
      <View style={[styles.buttonContainer]}>
        <Button
          label={"Add to wardrobe"}
          symbol={"picture-o"}
          onPress={createItem}
          style={{
            ...ButtonStyles.buttonLarge,
            ...ButtonStyles.buttonPrimaryColor,
            ...{ margin: 20 },
          }}
        />
        <TagEditor
          nameTags={nameTags}
          kvpTags={kvpTags}
          nameTagSuggestions={nameTagSuggestions}
          onAcceptAllTags={handleAcceptAllTags}
          onRejectAllTags={handleRejectAllTags}
          onAcceptSuggestedNameTag={handleAcceptSuggestedNameTag}
          kvpTagSuggestions={kvpTagSuggestions}
          onAcceptSuggestedKvpTag={handleAcceptSuggestedKvpTag}
          setNameTags={setNameTags}
          setKvpTags={setKvpTags}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
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
