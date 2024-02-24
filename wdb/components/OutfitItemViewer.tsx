import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { ItemModel } from "../models/ItemModel";
import { ButtonStyles, CommonStyles } from "./Styles";
import Button from "./Button";
import { Link, router, useFocusEffect } from "expo-router";
import { OutfitModel } from "../models/OutfitModel";
import axios from "axios";
import { plainToInstance } from "class-transformer";
import { ItemDto } from "../dto/ItemDto";
import qs from "qs";

const ITEMS_PER_PAGE = 12;

// const OutfitItemViewer = ({ 
//     items
//   } : {
//     items: ItemModel[];
//   }) => {
  const OutfitItemViewer = ({ 
    outfit
  } : {
    outfit: OutfitModel;
  }) => {
  const [items, setItems] = useState([] as ItemModel[])
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      getItemsAsync(outfit);

      return () => {
        // Do something when the screen is unfocused
      };
    }, [])
  );

  const getItemsAsync = async (outfit: OutfitModel) => {
    console.log("Getting items for outfit...")
    console.log(outfit)
    axios
      .get(
        `${process.env.EXPO_PUBLIC_API_URL}items`, 
        { 
          params: { ids: outfit.outfitItems.map(item => item.itemId) },
          paramsSerializer: params => {
            return qs.stringify(params)
          }
        })
      .then((response) => {
        console.log("Retrieved items...")
        const items = plainToInstance(ItemModel, response.data as ItemDto[]);
        console.log(items);
        setItems([...items]);
      })
      .catch((err) => {
      });
  };

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

  const handleHoverIn = (itemId) => {
    setHoveredItemId(itemId);
  };

  const handleHoverOut = () => {
    setHoveredItemId(null);
  };

  return (
    <>
      { items.length === 0 ? (<></>) : (
      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.container}>
          <View style={styles.gridContainer}>
            <View style={styles.grid}>
              {paginatedItems.map((item, index) => (
                // <Pressable
                //   key={index}
                //   onPress={() => handlePress(item)}
                //   onLongPress={() => handleLongPress(item)}
                //   onHoverIn={() => handleHoverIn(item.id)}
                //   onHoverOut={handleHoverOut}
                // >
                //   { item.photos?.length > 0 
                //     ? (
                //     <Image
                //       source={{ uri: item.photos[0].url }}
                //       style={styles.image}
                //     />) 
                //     : <></> }
                //   {selectedItems.some(
                //     (selectedItem) => selectedItem.id === item.id
                //   ) && (
                //     <View style={styles.selectedOverlay}>
                //     </View>
                //   )}
                //   {hoveredItemId === item.id && (
                //     <View style={styles.overlay}>
                //       <Text style={styles.overlayText}>{item.title}</Text>
                //     </View>
                //   )}
                // </Pressable>
                <Link 
                  href={{
                    pathname: "/clothes/[id]",
                    params: { id: item.id }
                  }}
                  key={index} 
                  asChild
                >
                  <Pressable
                    onHoverIn={() => handleHoverIn(item.id)}
                    onHoverOut={handleHoverOut}
                  >
                    { item.photos?.length > 0 
                      ? (
                      <Image
                        source={{ uri: item.photos[0].url }}
                        style={styles.image}
                      />) 
                      : <></> }
                    {hoveredItemId === item.id && (
                      <View style={styles.overlay}>
                        <Text style={styles.overlayText}>{item.title}</Text>
                      </View>
                    )}
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>
          <View style={styles.navigation}>
            <Button
              label="Previous"
              onPress={goToPreviousPage}
              disabled={currentPage === 0}
              style={{
                ...ButtonStyles.buttonSmall,
                ...ButtonStyles.buttonPrimaryColor,
                ...{ margin: 4 },
              }}
            />
            <Button
              label="Next"
              onPress={goToNextPage}
              disabled={(currentPage + 1) * ITEMS_PER_PAGE >= items.length}
              style={{
                ...ButtonStyles.buttonSmall,
                ...ButtonStyles.buttonPrimaryColor,
                ...{ margin: 4 },
              }}
            />
          </View>
        </View>
      </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainScrollView: {
    flex: 1,
    backgroundColor: CommonStyles.view.backgroundColor,
  },
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    justifyContent: "flex-start",
    padding: 10,
    backgroundColor: CommonStyles.view.backgroundColor,
    width: "100%",
  },
  inputContainer: {
    backgroundColor: CommonStyles.view.backgroundColor,
    alignSelf: "center",
    alignItems: "center",
  },
  createOutfitContainer: {
    backgroundColor: CommonStyles.view.backgroundColor,
    alignSelf: "center",
    alignItems: "center",
  },
  gridContainer: {
    alignSelf: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    padding: 10,
    width: 500, // Adjust as needed
  },
  itemContainer: {
    // Adjust the size to take more screen space
    flex: 1,
    padding: 20,
    alignSelf: "center",
    backgroundColor: CommonStyles.view.backgroundColor,
    // Adjust width and height as needed
    width: "50%",
    height: "100%",
    overflow: "hidden", // Hide the inner scrollbar
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
  searchBlobsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    padding: 10,
    width: 500,
  },
  searchBlobContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    margin: 2,
  },
  selectedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 255, 0.5)", // Blue semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OutfitItemViewer;
