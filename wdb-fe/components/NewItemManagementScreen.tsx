import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NewItemsContext } from './ItemManagementScreen';

const NewItemManagementScreen = () => {
  // Access the context to get the state
  const { newItems, tagItems } = useContext(NewItemsContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Manage New Items Screen</Text>
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
});

export default NewItemManagementScreen;
