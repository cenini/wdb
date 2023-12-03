import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { KvpTagModel, NameTagModel } from '../models/TagModel';

export default function TagEditor({ nameTags, kvpTags, nameTagSuggestions, onAcceptSuggestedNameTag, kvpTagSuggestions, onAcceptSuggestedKvpTag }) {
  const [editableNameTags, setEditableNameTags] = useState(nameTags.map(tag => ({ ...tag, isEditing: false })));
  const [editableKvpTags, setEditableKvpTags] = useState(kvpTags.map(tag => ({ ...tag, isEditing: false })));

  const handleNameTagEdit = (index) => {
    const updatedTags = [...editableNameTags];
    updatedTags[index].isEditing = !updatedTags[index].isEditing;
    setEditableNameTags(updatedTags);
  };

  const handleKvpTagEdit = (index) => {
    const updatedTags = [...editableKvpTags];
    updatedTags[index].isEditing = !updatedTags[index].isEditing;
    setEditableKvpTags(updatedTags);
  };

  const handleNameTagChange = (index, newName) => {
    const updatedTags = [...editableNameTags];
    updatedTags[index].name = newName;
    setEditableNameTags(updatedTags);
  };

  const handleKvpTagChange = (index, newKey, newValue) => {
    const updatedTags = [...editableKvpTags];
    updatedTags[index].key = newKey;
    updatedTags[index].value = newValue;
    setEditableKvpTags(updatedTags);
  };

  console.log(`nameTags from TagEditor: ${nameTags}`)
  console.log(`kvpTags from TagEditor: ${kvpTags}`)

  const handleAcceptSuggestedNameTag = (nameTag) => {
    setEditableNameTags([...editableNameTags, nameTag])
    onAcceptSuggestedNameTag(nameTag);
  };

  const handleAcceptSuggestedKvpTag = (kvpTag) => {
    setEditableKvpTags([...editableKvpTags, kvpTag])
    onAcceptSuggestedKvpTag(kvpTag);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Name Tags:</Text>
      <FlatList
        data={editableNameTags}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tag}>
            {item.isEditing ? (
              <TextInput
                style={styles.editableInput}
                value={item.name}
                onChangeText={(newName) => handleNameTagChange(index, newName)}
                onBlur={() => handleNameTagEdit(index)}
              />
            ) : (
              <Text onPress={() => handleNameTagEdit(index)}>{item.name}</Text>
            )}
          </View>
        )}
      />

      <Text style={styles.header}>KVP Tags:</Text>
      <FlatList
        data={editableKvpTags}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tag}>
            {item.isEditing ? (
              <View>
                <TextInput
                  style={styles.editableInput}
                  value={item.key}
                  onChangeText={(newKey) => handleKvpTagChange(index, newKey, item.value)}
                  onBlur={() => handleKvpTagEdit(index)}
                />
                <TextInput
                  style={styles.editableInput}
                  value={item.value}
                  onChangeText={(newValue) => handleKvpTagChange(index, item.key, newValue)}
                  onBlur={() => handleKvpTagEdit(index)}
                />
              </View>
            ) : (
              <Text onPress={() => handleKvpTagEdit(index)}>{`${item.key}: ${item.value}`}</Text>
            )}
          </View>
        )}
      />

      <Text style={styles.header}>Suggested Tags:</Text>
      <FlatList
        data={nameTagSuggestions}
        keyExtractor={(item, index) => (item ? item.name.toString() : index.toString())}
        renderItem={({ item }) => (
          <View style={styles.suggestedTag}>
            <Text style={styles.grayedText}>{item ? item.name : 'Unknown Name'}</Text>
            <TouchableOpacity onPress={() => handleAcceptSuggestedNameTag(item)}>
              <Text style={styles.checkmark}>✔</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <FlatList
        data={kvpTagSuggestions}
        keyExtractor={(item, index) => (item ? item.key.toString() : index.toString())}
        renderItem={({ item }) => (
          <View style={styles.suggestedTag}>
            <Text style={styles.grayedText}>{item ? `${item.key}: ${item.value}` : 'Unknown KVP'}</Text>
            <TouchableOpacity onPress={() => handleAcceptSuggestedKvpTag(item)}>
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
    padding: 8,
    marginVertical: 4,
    borderRadius: 5,
  },
  editableInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 5,
  },
  suggestedTag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginVertical: 4,
    borderRadius: 5,
  },
  grayedText: {
    color: '#888',
  },
  checkmark: {
    fontSize: 20,
    color: 'green',
  },
});
