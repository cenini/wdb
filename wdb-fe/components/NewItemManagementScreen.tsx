import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Pressable, GestureResponderEvent, TextInput } from 'react-native';
import { NewItemsContext } from './ItemManagementScreen';
import { useNavigation } from '@react-navigation/native';
import ImageViewer from './ImageViewer';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';
import { CreateItemDto, CreateItemPhotoDto, CreateItemTagsDto, ItemCreatedDto } from '../dto/ItemDto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { DescribeItemDto, DescriptionDto, TitleAndDescribeItemDto, TitleAndDescriptionDto } from '../dto/AIDto';
import { KvpTagModel, NameTagModel, Tag } from '../models/TagModel';
import TagEditor from './TagEditor';

export default function NewItemManagementScreen({ route, navigation }) {
  const { newItems, dispatch } = useContext(NewItemsContext)
  const [nameTags, setNameTags] = useState<NameTagModel[]>([]);
  const [kvpTags, setKvpTags] = useState<KvpTagModel[]>([])
  const [nameTagSuggestions, setNameTagSuggestions] = useState<NameTagModel[]>([]);
  const [kvpTagSuggestions, setKvpTagSuggestions] = useState<KvpTagModel[]>([])
  // const [tags, setTags] = useState<Tag[]>([])
  const [title, setTitle] = React.useState('');

  useEffect(() => {
    getSuggestion();
  }, [newItems]); 

  async function getSuggestion(): Promise<void> {
    if (title !== '') {
      const itemDescriptionDto = plainToClass(DescriptionDto, (await axios.post(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}ai/description`, plainToClass(TitleAndDescribeItemDto, { "base64photo": newItems[0].image.uri }))).data)
      setNameTagSuggestions(plainToInstance(NameTagModel, itemDescriptionDto.nameTags));
      setKvpTagSuggestions(plainToInstance(KvpTagModel, itemDescriptionDto.kvpTags));
      console.log(`nameTags: ${itemDescriptionDto.nameTags}`)
      console.log(`kvpTags: ${itemDescriptionDto.kvpTags}`)
    } else {
      const titleAndDescriptionDto = plainToClass(TitleAndDescriptionDto, (await axios.post(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}ai/titleAndDescription`, plainToClass(TitleAndDescribeItemDto, { "title": title, "base64photo": newItems[0].image.uri }))).data)
      if (title === '') {
        setTitle(titleAndDescriptionDto.title);
      }
      const titleSuggestion = titleAndDescriptionDto.title;
      setNameTagSuggestions(plainToInstance(NameTagModel, titleAndDescriptionDto.nameTags));
      setKvpTagSuggestions(plainToInstance(KvpTagModel, titleAndDescriptionDto.kvpTags));
      console.log(titleAndDescriptionDto)
      console.log(`title: ${titleAndDescriptionDto.title}`)
      console.log(`nameTags: ${titleAndDescriptionDto.nameTags}`)
      console.log(`kvpTags: ${titleAndDescriptionDto.kvpTags}`)
    }
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

  async function createItem(event: GestureResponderEvent): Promise<void> {
    const itemResponse = await axios.post(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items`, plainToClass(CreateItemDto, { "title": title }))
    const item = plainToClass(ItemCreatedDto, itemResponse.data)
    const photoResponse = await axios.post(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${item.id}/photos`, plainToClass(CreateItemPhotoDto, { "base64photo": newItems[0].image.uri }))
    console.log(`Creating item with ${nameTags.length} name tags and ${kvpTags.length} kvp tags`)
    const tagsResponse = await axios.post(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${item.id}/tags`, plainToClass(CreateItemTagsDto, { "nameTags": nameTags, "kvpTags": kvpTags }))
    console.log(tagsResponse)

    // Dispatch an action to remove the item
    dispatch({ type: 'REMOVE_FIRST_ITEM' });
    if (newItems.length === 1) {
      navigation.goBack();
      return;
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Title'
        style={styles.input}
        onChangeText={setTitle}
        value={title}
      />
      <ImageViewer selectedImage={newItems[0]} />
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
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 3,
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
});
