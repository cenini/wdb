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
  TextInput,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
  FlatList,
  GestureResponderEvent,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { plainToClass, plainToInstance } from "class-transformer";
import { CreateItemTagsDto, ItemDto } from "../dto/ItemDto";
import { ItemModel, TagType } from "../models/ItemModel";
import { CommonStyles } from "./Styles";
import ItemManagementScreen from "./ItemManagementScreen";
import { KvpTagModel, NameTagModel } from "../models/TagModel";

const ITEMS_PER_PAGE = 12;

const ItemBrowserScreen = () => {
  const [items, setItems] = useState([] as ItemModel[]);
  const [initialItems, setInitialItems] = useState([] as ItemModel[]);
  const [searchBlobs, setSearchBlobs] = useState([] as string[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemsUpdated, setItemsUpdated] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    console.log("Getting items...");
    getItemsAsync();
  }, [itemsUpdated]);

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
    title: string,
    nameTags: NameTagModel[],
    kvpTags: KvpTagModel[]
  ) => {
    const tagsResponse = await axios.post(
      `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${selectedItem.id}/tags`,
      plainToClass(CreateItemTagsDto, {
        nameTags: nameTags.filter((nameTag) => nameTag.name !== ""),
        kvpTags: kvpTags.filter(
          (kvpTag) => kvpTag.key !== "" && kvpTag.value !== ""
        ),
      })
    );
    setItemsUpdated(itemsUpdated + 1);
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
    <View style={styles.container}>
      {selectedItem === null ? (
        <View>
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
      ) : (
        <View style={styles.grid}>
          <ItemManagementScreen
            item={selectedItem}
            updateItem={updateItem}
            onClose={handleItemClose}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flex: 1,
    padding: 20,
    alignSelf: "center",
    backgroundColor: "#25292e",
  },
  inputContainer: {
    backgroundColor: "#25292e",
    alignSelf: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
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
