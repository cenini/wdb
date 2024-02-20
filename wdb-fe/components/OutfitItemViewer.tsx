import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  Pressable,
  Modal,
  TextInput,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
  FlatList,
  GestureResponderEvent,
} from "react-native";
import axios, { HttpStatusCode } from "axios";
import Constants from "expo-constants";
import { plainToClass, plainToInstance } from "class-transformer";
import { CreateItemTagsDto, ItemDto } from "../dto/ItemDto";
import { ItemModel, TagType } from "../models/ItemModel";
import { ButtonStyles, CommonStyles } from "./Styles";
import ItemManagementScreen from "./ItemManagementScreen";
import { KvpTagModel, NameTagModel } from "../models/TagModel";
import Button from "./Button";
import { useFocusEffect } from "@react-navigation/native";
import { CreateOutfitWithItemsDto } from "../dto/OutfitDto";
import { OutfitModel } from "../models/OutfitModel";
import qs from "qs";

const ITEMS_PER_PAGE = 12;

const OutfitItemViewer = ({ 
    outfit 
  } : {
    outfit: OutfitModel;
  }) => {
  const [items, setItems] = useState([] as ItemModel[]);
  // const [initialItems, setInitialItems] = useState([] as ItemModel[]);
  // const [searchBlobs, setSearchBlobs] = useState([] as string[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null as ItemModel);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  // const [searchText, setSearchText] = useState("");
  // const [selectedItems, setSelectedItems] = useState(new Set<ItemModel>());
  // const [selectedItems, setSelectedItems] = useState([] as ItemModel[]);

  useFocusEffect(
    React.useCallback(() => {
      getItemsAsync();

      return () => {
        // Do something when the screen is unfocused
      };
    }, [])
  );

  const getItemsAsync = async () => {
    axios
      .get(
        `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items`, 
        { 
          params: { ids: outfit.outfitItems.map(item => item.itemId) },
          paramsSerializer: params => {
            return qs.stringify(params)
          }
        })
      .then((response) => {
        const items = plainToInstance(ItemModel, response.data as ItemDto[]);
        console.log(items);
        setItems([...items]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
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

  const handlePress = (item) => {
    setSelectedItem(item);
    // In the future, navigate to the item
  };

  const handleLongPress = (item: ItemModel) => {

  };

  const handleItemClose = () => {
    setSelectedItem(null);
  };

  const updateItem = async (
    itemToUpdate: ItemModel,
    title: string,
    nameTags: NameTagModel[],
    kvpTags: KvpTagModel[]
  ) => {
    const tagsResponse = await axios.post(
      `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${itemToUpdate.id}/tags`,
      plainToClass(CreateItemTagsDto, {
        nameTags: nameTags.filter((nameTag) => nameTag.name !== ""),
        kvpTags: kvpTags.filter(
          (kvpTag) => kvpTag.key !== "" && kvpTag.value !== ""
        ),
      })
    );
    axios
      .get(
        `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${itemToUpdate.id}`
      )
      .then((response) => {
        const updatedItem = plainToInstance(
          ItemModel,
          response.data as ItemDto
        );
        const updatedItems = items.map((item) => {
          if (item.id === updatedItem.id) {
            return updatedItem;
          }
          return item;
        });
        setItems(updatedItems);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
        setLoading(false);
      });
  };

  const deleteItem = async (deletedItem: ItemModel) => {
    const deleteResponse = await axios.delete(
      `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${deletedItem.id}`
    );
    setItems(items.filter((item) => item.id !== deletedItem.id));
    setCurrentPage(0);
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
          deleteItem={deleteItem}
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
