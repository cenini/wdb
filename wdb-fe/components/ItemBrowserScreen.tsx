import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, Text } from 'react-native';
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
    };

    const closeImage = () => {
      setSelectedImage(null);
    }

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
      <ScrollView>
          <View style={styles.container}>
              {items.map((item) => (
                  <View key={item.id} style={styles.item}>
                      <Image source={{ uri: item.photoUrl }} style={styles.image} />
                      <Text style={styles.title}>{item.title}</Text>
                      <View style={styles.tags}>
                          {item.tags.map((tag, index) => (
                              <Text key={index} style={styles.tag}>
                                  {tag.key}: {tag.value}
                              </Text>
                          ))}
                      </View>
                  </View>
              ))}
          </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
      padding: 10,
  },
  item: {
      marginBottom: 20,
  },
  image: {
      width: 512,
      height: 512,
      borderRadius: 10,
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
});


export default ItemBrowserScreen;
