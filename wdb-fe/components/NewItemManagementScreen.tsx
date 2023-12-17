import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Pressable, GestureResponderEvent, TextInput, TouchableWithoutFeedback, Modal } from 'react-native';
import { NewItemsContext } from './AppScreen';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import axios, { HttpStatusCode } from 'axios';
import Constants from 'expo-constants';
import { CreateItemDto, CreateItemPhotoDto, CreateItemTagsDto, ItemCreatedDto } from '../dto/ItemDto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { TitleAndDescribeItemDto, TitleAndDescriptionDto } from '../dto/AIDto';
import { KvpTagModel, NameTagModel } from '../models/TagModel';
import TagEditor from './TagEditor';
import ImageBox from './ImageBox';

export default function NewItemManagementScreen({ route, navigation }) {
  const { newItems, dispatch } = useContext(NewItemsContext)
  const [nameTags, setNameTags] = useState<NameTagModel[]>([]);
  const [kvpTags, setKvpTags] = useState<KvpTagModel[]>([])
  const [nameTagSuggestions, setNameTagSuggestions] = useState<NameTagModel[]>([]);
  const [kvpTagSuggestions, setKvpTagSuggestions] = useState<KvpTagModel[]>([]);
  const [title, setTitle] = React.useState('');
  const [titlePlaceholder, setTitlePlaceholder] = React.useState('Title');

  useEffect(() => {
    getSuggestion();
  }, [newItems]); 

  async function getSuggestion(): Promise<void> {
    console.log(newItems)
    const titleAndDescriptionDto = plainToClass(TitleAndDescriptionDto, (await axios.post(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}ai/titleAndDescription`, plainToClass(TitleAndDescribeItemDto, { "title": title, "base64photo": newItems[0].image.base64representation }))).data)
    setTitlePlaceholder(titleAndDescriptionDto.title)
    setNameTagSuggestions(plainToInstance(NameTagModel, titleAndDescriptionDto.nameTags));
    setKvpTagSuggestions(plainToInstance(KvpTagModel, titleAndDescriptionDto.kvpTags));
    console.log(titleAndDescriptionDto)
    console.log(`title: ${titleAndDescriptionDto.title}`)
    console.log(`nameTags: ${titleAndDescriptionDto.nameTags}`)
    console.log(`kvpTags: ${titleAndDescriptionDto.kvpTags}`)
  }

  const handleAcceptSuggestedNameTag = (nameTag) => {
    setNameTagSuggestions((nameTagSuggestions) =>
      nameTagSuggestions.filter((suggestion) => suggestion.name !== nameTag.name)
    );
    console.log(nameTagSuggestions)
  };

  const handleAcceptSuggestedKvpTag = (kvpTag) => {
    setKvpTagSuggestions((kvpTagSuggestions) =>
      kvpTagSuggestions.filter((suggestion) => suggestion.key !== kvpTag.key && suggestion.value !== kvpTag.value)
    );
    console.log(kvpTagSuggestions)
  };

  function resetTags() : void {
    setNameTags([])
    setKvpTags([])
  }

  async function createItem(event: GestureResponderEvent): Promise<void> {
    const itemResponse = await axios.post(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items`, plainToClass(CreateItemDto, { "title": title === '' ? titlePlaceholder : title }))
    if (itemResponse.status != HttpStatusCode.Created) {
      // show some error
      return;
    }
    const item = plainToClass(ItemCreatedDto, itemResponse.data)
    const photoResponse = await axios.post(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${item.id}/photos`, plainToClass(CreateItemPhotoDto, { "base64photo": newItems[0].image.uri }))
    console.log(`Creating item with ${nameTags.length} name tags and ${kvpTags.length} kvp tags`)
    const tagsResponse = await axios.post(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${item.id}/tags`, plainToClass(CreateItemTagsDto, { "nameTags": nameTags, "kvpTags": kvpTags }))
    console.log(tagsResponse)
    resetTags();

    // Dispatch an action to remove the item
    dispatch({ type: 'REMOVE_FIRST_ITEM' });
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
    <View style={styles.container}>
      <TextInput
        placeholder={titlePlaceholder}
        style={styles.input}
        onChangeText={setTitle}
        value={title}
      />
      <ImageBox imageUri={newItems[0].image.uri} onSaveTag={handleTagBoxSave} />
      <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18 }]}>
        <Pressable
          style={[styles.button, { backgroundColor: "#fff" }]}
          onPress={createItem}
        >
          <FontAwesome
            name="picture-o"
            size={18}
            color="#25292e"
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: "#25292e" }]}>Create item</Text>
        </Pressable>
        <TagEditor nameTags={nameTags} kvpTags={kvpTags} nameTagSuggestions={nameTagSuggestions} onAcceptSuggestedNameTag={handleAcceptSuggestedNameTag} kvpTagSuggestions={kvpTagSuggestions} onAcceptSuggestedKvpTag={handleAcceptSuggestedKvpTag} setNameTags={setNameTags} setKvpTags={setKvpTags} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
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
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 3,
    marginVertical: 5
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
    flex: 1,
  },
  tagBoxContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
