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

const ITEMS_PER_PAGE = 12;

const ItemBrowserScreen = () => {
  const [items, setItems] = useState([] as ItemModel[]);
  const [initialItems, setInitialItems] = useState([] as ItemModel[]);
  const [searchBlobs, setSearchBlobs] = useState([] as string[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    console.log("Getting items...");
    getItemsAsync();
  }, []);

  useEffect(() => {
    setItems(
      initialItems.filter((item) => {
        // Check for matching searchBlobs
        const matchesSearchBlobs =
          searchBlobs.length === 0 ||
          searchBlobs.every(
            (searchBlob) =>
              item.tags.some(
                (tag) =>
                  (tag.type === TagType.NAME &&
                    tag.name &&
                    tag.name
                      .toLowerCase()
                      .includes(searchBlob.toLowerCase())) ||
                  (tag.type !== TagType.NAME &&
                    ((tag.key &&
                      tag.key
                        .toLowerCase()
                        .includes(searchBlob.toLowerCase())) ||
                      (tag.value &&
                        tag.value
                          .toLowerCase()
                          .includes(searchBlob.toLowerCase()))))
              ) || item.title.toLowerCase().includes(searchBlob.toLowerCase())
          );

        // Check for matching searchText
        const matchesSearchText =
          searchText === "" ||
          item.tags.some((tag) =>
            tag.type === TagType.NAME
              ? tag.name &&
                tag.name.toLowerCase().includes(searchText.toLowerCase())
              : (tag.key &&
                  tag.key.toLowerCase().includes(searchText.toLowerCase())) ||
                (tag.value &&
                  tag.value.toLowerCase().includes(searchText.toLowerCase()))
          ) ||
          item.title.toLowerCase().includes(searchText.toLowerCase());

        return matchesSearchBlobs && matchesSearchText;
      })
    );
  }, [searchText, searchBlobs, initialItems]);

  const getItemsAsync = async () => {
    axios
      .get(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items`)
      .then((response) => {
        const items = plainToInstance(ItemModel, response.data as ItemDto[]);
        console.log(items);
        setItems([...items]);
        setInitialItems([...items]);
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

  const handleImageClick = (item) => {
    setSelectedItem(item);
    // In the future, navigate to the item
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
        console.log(updatedItems);
        setItems(updatedItems);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
        setLoading(false);
      });
  };

  const deleteItem = async (item: ItemModel) => {
    const deleteResponse = await axios.delete(
      `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${selectedItem.id}`
    );
  };

  const handleHoverIn = (itemId) => {
    setHoveredItemId(itemId);
  };

  const handleHoverOut = () => {
    setHoveredItemId(null);
  };

  function addSearchBlob(
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ): void {
    setSearchBlobs([searchText, ...searchBlobs]);
    setSearchText("");
  }

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <ScrollView
      style={styles.mainScrollView}
      contentContainerStyle={styles.contentContainer}
    >
      {selectedItem === null ? (
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={CommonStyles.textInput}
              placeholder="Search tags..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={addSearchBlob}
            />
            <View style={styles.searchBlobsContainer}>
              {searchBlobs.map((item, index) => (
                <View style={styles.searchBlobContainer} key={index}>
                  <Pressable
                    onPress={() => {
                      setSearchBlobs(
                        searchBlobs.filter(
                          (searchBlob, blobIndex) => blobIndex !== index
                        )
                      );
                    }}
                  >
                    <Text>{item}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.gridContainer}>
            <View style={styles.grid}>
              {paginatedItems.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleImageClick(item)}
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
      ) : (
        <View style={styles.itemContainer}>
          <ItemManagementScreen
            item={selectedItem}
            updateItem={updateItem}
            deleteItem={deleteItem}
            onClose={handleItemClose}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainScrollView: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    justifyContent: "flex-start",
    padding: 10,
    backgroundColor: "#25292e",
    width: "100%",
  },
  inputContainer: {
    backgroundColor: "#25292e",
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
    backgroundColor: "#25292e",
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
});

export default ItemBrowserScreen;
