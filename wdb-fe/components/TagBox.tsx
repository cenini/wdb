import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { plainToInstance } from 'class-transformer';
import { KvpTagModel, NameTagModel } from '../models/TagModel';

export default function TagBox({ onClose, onSaveTag }) {
  const [isExpanded, setExpanded] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagKey, setTagKey] = useState('');
  const [tagValue, setTagValue] = useState('');

  const handleToggleExpansion = () => {
    setExpanded(!isExpanded);
  };

  const handleSave = () => {
    // Add your logic to handle the entered tag (tagName, tagKey, and tagValue)
    console.log(`Tag saved: ${tagName} - ${tagKey} - ${tagValue}`);

    // Add a tag
    onSaveTag(isExpanded 
      ? plainToInstance(KvpTagModel, { 'key': tagKey, 'value': tagValue }) 
      : plainToInstance(NameTagModel, { 'name': tagName }));
  };

  const handleBackgroundPress = () => {
    // Close the box
    onClose();
  };

  return (
    <Modal transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backgroundOverlay}
          activeOpacity={1}
          onPress={handleBackgroundPress}
        />
        <View style={styles.drawerBox}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerHeaderText}>Add Tag</Text>
            <TouchableOpacity onPress={handleToggleExpansion}>
              <FontAwesome
                name={isExpanded ? 'caret-up' : 'caret-down'}
                size={20}
                color="#000"
              />
            </TouchableOpacity>
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
          <TouchableOpacity style={styles.addButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Add Tag</Text>
          </TouchableOpacity>
        </View>
        {/* ... (other styles) */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
});
