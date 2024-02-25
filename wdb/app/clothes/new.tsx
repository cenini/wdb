import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  GestureResponderEvent,
  TextInput,
  ScrollView,
} from "react-native";
import axios, { HttpStatusCode } from "axios";
import {
  CreateItemDto,
  CreateItemPhotoDto,
  CreateItemTagsDto,
  ItemCreatedDto,
} from "../../dto/ItemDto";
import { plainToClass, plainToInstance } from "class-transformer";
import { TitleAndDescribeItemDto, TitleAndDescriptionDto } from "../../dto/AIDto";
import { KvpTagModel, NameTagModel } from "../../models/TagModel";
import TagEditor from "../../components/TagEditor";
import ImageBox from "../../components/ImageBox";
import Button from "../../components/Button";
import { ButtonStyles, CommonStyles } from "../../components/Styles";
import { router, useLocalSearchParams } from "expo-router";

export default function NewItemManagementScreen() {
  const params = useLocalSearchParams<{ imageUris?: string[] }>();
  let { imageUris } = params;
  if (typeof imageUris === 'string') {
    imageUris = [imageUris];
  }
  // console.log(imageUris)
  const [ newImageUris, setNewImageUris ] = useState<string[]>(imageUris);
  const [nameTags, setNameTags] = useState<NameTagModel[]>([]);
  const [kvpTags, setKvpTags] = useState<KvpTagModel[]>([]);
  const [nameTagSuggestions, setNameTagSuggestions] = useState<NameTagModel[]>(
    []
  );
  const [kvpTagSuggestions, setKvpTagSuggestions] = useState<KvpTagModel[]>([]);
  const [title, setTitle] = useState("");
  const [titlePlaceholder, setTitlePlaceholder] = useState("Title");
  const [initialNameTagSuggestions, setInitialNameTagSuggestions] = useState<
    NameTagModel[]
  >([]);
  const [initialKvpTagSuggestions, setInitialKvpTagSuggestions] = useState<
    KvpTagModel[]
  >([]);

  useEffect(() => {
    getSuggestion();
  }, []);

  async function getSuggestion(): Promise<void> {
    const titleAndDescriptionDto = plainToClass(
      TitleAndDescriptionDto,
      (
        await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}ai/titleAndDescription`,
          plainToClass(TitleAndDescribeItemDto, {
            title: title,
            base64photo: newImageUris[0],
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
    console.log("Creating item")
    const itemResponse = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}items`,
      plainToClass(CreateItemDto, {
        title: title === "" ? titlePlaceholder : title,
      })
    );
    console.log("Created item")
    if (itemResponse.status != HttpStatusCode.Created) {
      // show some error
      return;
    }
    const item = plainToClass(ItemCreatedDto, itemResponse.data);
    console.log("Creating photo")
    const photoResponse = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}items/${item.id}/photos`,
      plainToClass(CreateItemPhotoDto, { base64photo: newImageUris[0] })
    );
    console.log("Created photo")
    console.log("Creating tags")
    const tagsResponse = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}items/${item.id}/tags`,
      plainToClass(CreateItemTagsDto, {
        nameTags: nameTags.filter((nameTag) => nameTag.name !== ""),
        kvpTags: kvpTags.filter(
          (kvpTag) => kvpTag.key !== "" && kvpTag.value !== ""
        ),
      })
    );
    console.log("Created tags")
    resetTags();
    setNewImageUris(prevState => {
      const updatedState = prevState.slice(1);
      if (updatedState.length === 0) { 
          router.replace("/clothes/");
      }
      return updatedState;
  });
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
        style={CommonStyles.textInput}
        onChangeText={setTitle}
        value={title}
      />
      <ImageBox imageUri={newImageUris[0]} onSaveTag={handleTagBoxSave} />
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
    backgroundColor: CommonStyles.view.backgroundColor,
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
