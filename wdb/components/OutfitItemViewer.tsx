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
import ItemManagementScreen from "./ItemManagementScreen";
import Button from "./Button";

const ITEMS_PER_PAGE = 12;

const OutfitItemViewer = ({ 
    outfit,
    items,
    selectedItems,
    updateItem,
    deleteItem,
    handleSelectItem
  } 
  // : {
  //   outfit: OutfitModel;
  //   items: ItemModel[];
  //   selectedItems: ItemModel[];
  //   handleSelectItem: (items: ItemModel) => void;
  // }
  ) => {
  // const [items, setItems] = useState([] as ItemModel[]);
  const [selectedItem, setSelectedItem] = useState(null as ItemModel);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getItemsAsync();

  //     return () => {
  //       // Do something when the screen is unfocused
  //     };
  //   }, [])
  // );



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

  async function handleDeleteItem(deletedItem: ItemModel): Promise<void> {
    await deleteItem(deletedItem)
    setCurrentPage(0);
  }

  const handlePress = (item: ItemModel) => {
    setSelectedItem(item);
  };

  const handleLongPress = (item: ItemModel) => {
    handleSelectItem(item);
  };

  const handleItemClose = () => {
    setSelectedItem(null);
  };

  const handleHoverIn = (itemId) => {
    setHoveredItemId(itemId);
  };

  const handleHoverOut = () => {
    setHoveredItemId(null);
  };

  return (
    <View>
      {selectedItem === null ? (
        <ScrollView
          style={styles.mainScrollView}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.container}>
            <View style={styles.gridContainer}>
              <View style={styles.grid}>
                {paginatedItems.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handlePress(item)}
                    onLongPress={() => handleLongPress(item)}
                    onHoverIn={() => handleHoverIn(item.id)}
                    onHoverOut={handleHoverOut}
                  >
                    <Image
                      source={{ uri: item.photos[0].url }}
                      style={styles.image}
                    />
                    {selectedItems.some(
                      (selectedItem) => selectedItem.id === item.id
                    ) && (
                      <View style={styles.selectedOverlay}>
                      </View>
                    )}
                    {hoveredItemId === item.id && (
                      <View style={styles.overlay}>
                        <Text style={styles.overlayText}>{item.title}</Text>
                      </View>
                    )}
                  </Pressable>
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
      ) : (
        <ItemManagementScreen
          item={selectedItem}
          updateItem={updateItem}
          deleteItem={handleDeleteItem}
          onClose={handleItemClose}
        />
      )}
    </View>
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
