import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  Pressable,
  Modal,
  Button,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { plainToInstance } from "class-transformer";
import { ItemDto } from "../dto/ItemDto";
import { ItemModel } from "../models/ItemModel";

const ITEMS_PER_PAGE = 12;

const ItemBrowserScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  useEffect(() => {
    console.log("Getting items...");
    const getItemsAsync = async () => {
      const result = axios
        .get(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items`)
        .then((response) => {
          const items = plainToInstance(ItemModel, response.data as ItemDto[]);
          console.log(items);
          setItems(items);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };
    getItemsAsync();
  }, []);

  const paginatedItems = items.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < items.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleImagePress = (url) => {
    setSelectedImage(url);
    // In the future, navigate to the item
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const handleHoverIn = (itemId) => {
    setHoveredItemId(itemId);
  };

  const handleHoverOut = () => {
    setHoveredItemId(null);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {paginatedItems.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => handleImagePress(item.photos[0].url)}
            onHoverIn={() => handleHoverIn(item.id)}
            onHoverOut={handleHoverOut}
          >
            <Image source={{ uri: item.photos[0].url }} style={styles.image} />
            {hoveredItemId === item.id && (
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{item.title}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
      <View style={styles.navigation}>
        <Button
          title="Previous"
          onPress={goToPreviousPage}
          disabled={currentPage === 0}
        />
        <Button
          title="Next"
          onPress={goToNextPage}
          disabled={(currentPage + 1) * ITEMS_PER_PAGE >= items.length}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flex: 1,
    padding: 20,
    alignSelf: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignSelf: "center",
    padding: 10,
    width: 500,
  },
  image: {
    width: 150, // Adjust for 3 images per row
    height: 150, // Adjust as needed
    margin: 4,
  },
  navigation: {
    flexDirection: "row",
    alignSelf: "center",
    padding: 10,
  },
  button: {
    margin: 5,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    textAlign: "center",
  },
});

export default ItemBrowserScreen;
