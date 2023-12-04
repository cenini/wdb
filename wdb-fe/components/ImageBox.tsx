import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { plainToInstance } from 'class-transformer';
import { KvpTagModel, NameTagModel } from '../models/TagModel';

const ImageBox = ({ imageUri, onSaveTag }) => {
  const [isExpanded, setExpanded] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagKey, setTagKey] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [isTagViewVisible, setTagViewVisible] = useState(false);

  const handleToggleExpansion = () => {
    setExpanded(!isExpanded);
  };

  const handleSave = () => {
    // Add a tag
    onSaveTag(
      isExpanded
        ? plainToInstance(KvpTagModel, { key: tagKey, value: tagValue })
        : plainToInstance(NameTagModel, { name: tagName })
    );

    // Hide the tag view
    setTagViewVisible(false);
  };

  const handleImagePress = () => {
    // Show the tag view when the image is pressed
    setTagViewVisible(true);
  };

  return (
    <View>
      <Pressable onPress={handleImagePress}>
        <Image source={imageUri} style={styles.image} />
      </Pressable>
      {isTagViewVisible && (
        <View style={styles.overlay}>
          <View style={styles.drawerBox}>
            <View style={styles.drawerHeader}>
              <Pressable onPress={() => setTagViewVisible(false)}>
                <FontAwesome
                  name="close"
                  size={20}
                  color="#000"
                />
              </Pressable>
              <Pressable onPress={handleToggleExpansion}>
                <FontAwesome
                  name={isExpanded ? 'caret-up' : 'caret-down'}
                  size={20}
                  color="#000"
                />
              </Pressable>
            </View>
            {isExpanded && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Key"
                  value={tagKey}
                  onChangeText={setTagKey}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Value"
                  value={tagValue}
                  onChangeText={setTagValue}
                />
              </>
            )}
            <TextInput
              style={[styles.input, { display: isExpanded ? 'none' : 'flex' }]}
              placeholder="Name"
              value={tagName}
              onChangeText={setTagName}
            />
            <Pressable style={styles.addButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Add Tag</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});

export default ImageBox;
