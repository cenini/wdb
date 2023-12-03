import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { KvpTagModel, NameTagModel } from '../models/TagModel';

export default function TagEditor({
  nameTags,
  setNameTags,
  kvpTags,
  setKvpTags,
  nameTagSuggestions,
  onAcceptSuggestedNameTag,
  kvpTagSuggestions,
  onAcceptSuggestedKvpTag,
}) {
  const handleNameTagChange = (index, newName) => {
    const updatedTags = [...nameTags];
    updatedTags[index].name = newName;
    setNameTags(updatedTags);
    // console.log(`number of nametags: ${nameTags.length}`)
  };

  const handleKvpTagChange = (index, newKey, newValue) => {
    const updatedTags = [...kvpTags];
    updatedTags[index].key = newKey;
    updatedTags[index].value = newValue;
    setKvpTags(updatedTags);
    // console.log(`number of kvptags: ${kvpTags.length}`)
  };

  const handleAcceptSuggestedNameTag = (nameTag) => {
    setNameTags([...nameTags, { ...nameTag }]);
    onAcceptSuggestedNameTag(nameTag);
    // console.log(`number of nametags: ${nameTags.length}`)
  };

  const handleAcceptSuggestedKvpTag = (kvpTag) => {
    setKvpTags([...kvpTags, { ...kvpTag }]);
    onAcceptSuggestedKvpTag(kvpTag);
    // console.log(`number of kvptags: ${kvpTags.length}`)
  };

  const mergedTags = [
    ...nameTags.map((tag) => ({ ...tag, type: 'name' })),
    ...kvpTags.map((tag) => ({ ...tag, type: 'kvp' })),
    ...nameTagSuggestions.map((tag) => ({ ...tag, type: 'suggestedName' })),
    ...kvpTagSuggestions.map((tag) => ({ ...tag, type: 'suggestedKvp' })),
  ];

  const acceptedTags = mergedTags.filter((tag) => tag.type === 'name' || tag.type === 'kvp');
  const suggestedTags = mergedTags.filter(
    (tag) => tag.type === 'suggestedName' || tag.type === 'suggestedKvp'
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Accepted Tags:</Text>
      <FlatList
        data={acceptedTags}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tag}>
            <TextInput
              style={styles.editableInput}
              value={item.type === 'kvp' ? item.key : item.name ?? ''}
              onChangeText={(newText) =>
                item.type === 'name' ? handleNameTagChange(index, newText) : handleKvpTagChange(index, newText, item.value)
              }
            />
            {item.type === 'kvp' && (
              <TextInput
                style={styles.editableInput}
                value={item.value}
                onChangeText={(newText) => handleKvpTagChange(index, item.key, newText)}
              />
            )}
          </View>
        )}
      />

      <Text style={styles.header}>Suggested Tags:</Text>
      <FlatList
        data={suggestedTags}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tag}>
            <TextInput
              style={styles.editableInput}
              value={item.type === 'suggestedKvp' ? item.key : item.name ?? ''}
              onChangeText={(newText) =>
                item.type === 'suggestedName' ? handleNameTagChange(index, newText) : handleKvpTagChange(index, newText, item.value)
              }
            />
            {item.type === 'suggestedKvp' && (
              <TextInput
                style={styles.editableInput}
                value={item.value}
                onChangeText={(newText) => handleKvpTagChange(index, item.key, newText)}
              />
            )}
            <TouchableOpacity
              onPress={() =>
                item.type === 'suggestedName'
                  ? handleAcceptSuggestedNameTag(item)
                  : handleAcceptSuggestedKvpTag(item)
              }
            >
              <Text style={styles.checkmark}>✔</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginVertical: 4,
    borderRadius: 5,
  },
  editableInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 5,
  },
  checkmark: {
    fontSize: 20,
    color: 'green',
  },
});
