import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Button, Pressable, GestureResponderEvent } from 'react-native';
import { NewItemsContext } from './ItemManagementScreen';
import { useNavigation } from '@react-navigation/native';
import ImageViewer from './ImageViewer';
import { FontAwesome } from '@expo/vector-icons';

export default function NewItemManagementScreen({ route, navigation }) {
  const { newItems, dispatch } = useContext(NewItemsContext)

  function onPress(event: GestureResponderEvent): void {
    // Dispatch an action to remove the first item
    dispatch({ type: 'REMOVE_FIRST_ITEM' });
  
    if (newItems.length === 1) {
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <ImageViewer selectedImage={newItems[0]} />
      {/* <Text style={styles.text}>Manage New Items Screen</Text> */}
      <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18 }]}>
        <Pressable
            style={[styles.button, { backgroundColor: "#fff" }]}
            onPress={onPress}
          >
            <FontAwesome
              name="picture-o"
              size={18}
              color="#25292e"
              style={styles.buttonIcon}
            />
            <Text style={[styles.buttonLabel, { color: "#25292e" }]}>Done</Text>
        </Pressable>
      </View>

      {/* <Text style={styles.text}>{newItems.state}</Text> */}
      {/* <Text style={styles.text}>Number of new items: {newItems.length}</Text> */}
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
