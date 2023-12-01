import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, Pressable, GestureResponderEvent } from 'react-native';
import { NewItemsContext } from './ItemManagementScreen';
import { useNavigation } from '@react-navigation/native';

export default function NewItemManagementScreen({ route, navigation }) {
  const { newItems } = route.params;
  const { removeItem } = useContext(NewItemsContext)
  // // Access the context to get the state

  function onPress(event: GestureResponderEvent): void {
    newItems.pop()
    if (newItems.length === 0) {
      navigation.goBack()
    }
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Manage New Items Screen</Text> */}
      <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonLabel}>Log stuff</Text>
      </Pressable>
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
    justifyContent: 'center',
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
