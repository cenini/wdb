import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, Text, Pressable, Modal } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const ItemBrowserScreen = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
      console.log('Getting items...')
      const getItemsAsync = async () => {
        const result = axios.get(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items`)
        .then(response => {
          console.log(response.data);

          const formattedData = response.data.map(item => {
            return {
              id: item.id,
              title: item.title,
              photoUrl: item.Photo[0]?.url,
              tags: item.ItemTag.map(tag => ({
                key: tag.tag.key,
                value: tag.tag.value,
              })),
            };
          });

          setItems(formattedData);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
      }
      getItemsAsync();
    }, []);

    const handleImagePress = (url) => {
      setSelectedImage(url);
      // In the future, navigate to the item
    };

    const closeImage = () => {
      setSelectedImage(null);
    }

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
      <ScrollView>
          <View style={styles.container}>
            {items.map((item, index) => (
                <Pressable key={index} onPress={() => handleImagePress(item.photoUrl)}>
                    <Image source={{ uri: item.photoUrl }} style={styles.image} />
                </Pressable>
            ))}

            {/* Full-size image modal */}
            {selectedImage && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={!!selectedImage}
                    onRequestClose={closeImage}
                >
                    <View style={styles.modalView}>
                        <Pressable onPress={closeImage} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </Pressable>
                        <Image source={{ uri: selectedImage }} style={styles.fullSizeImage} />
                    </View>
                </Modal>
            )}
          </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flex: 1,
    padding: 20
  },
  image: {
      width: 150,
      height: 150,
      marginBottom: 4,
  },
  item: {
      marginBottom: 20,
  },
  title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 8,
  },
  tags: {
      flexDirection: 'row',
      marginTop: 4,
  },
  tag: {
      marginRight: 10,
      color: 'gray',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullSizeImage: {
      width: '100%',
      height: '80%',
      resizeMode: 'contain',
  },
  closeButton: {
      position: 'absolute',
      top: 30,
      right: 20,
      backgroundColor: 'white',
      borderRadius: 20,
  },
  closeButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      padding: 10,
  },
});


export default ItemBrowserScreen;
