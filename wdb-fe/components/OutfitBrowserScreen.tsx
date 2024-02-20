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
// import { CreateItemTagsDto, ItemDto } from "../dto/ItemDto";
// import { OutfitModel, TagType } from "../models/OutfitModel";
import { ButtonStyles, CommonStyles } from "./Styles";
import { KvpTagModel, NameTagModel } from "../models/TagModel";
import Button from "./Button";
import { useFocusEffect } from "@react-navigation/native";
import { CreateOutfitWithItemsDto, OutfitDto } from "../dto/OutfitDto";
import { OutfitModel } from "../models/OutfitModel";
import OutfitManagementScreen from "./OutfitManagementScreen";
import { ItemModel } from "../models/ItemModel";
import qs from "qs";

const OUTFITS_PER_PAGE = 12;
const SAMPLE_OUTFIT = "https://media.glamourmagazine.co.uk/photos/64469497fd405205dbee625c/16:9/w_2240,c_limit/OUTFIT%20IDEAS%20240423.jpg";

const OutfitBrowserScreen = () => {
  const [outfits, setOutfits] = useState([] as OutfitModel[]);
  const [initialOutfits, setInitialOutfits] = useState([] as OutfitModel[]);
  const [searchBlobs, setSearchBlobs] = useState([] as string[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredOutfitId, setHoveredOutfitId] = useState(null);
  const [searchText, setSearchText] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      getOutfits();

      return () => {
        // Do something when the screen is unfocused
      };
    }, [])
  );

  const getOutfits = async () => {
    axios
      .get(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}outfits`)
      .then((response) => {
        const outfits = plainToInstance(OutfitModel, response.data as OutfitDto[]);
        console.log(outfits);
        setOutfits([...outfits]);
        setInitialOutfits([...outfits]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // async function reloadOutfit(outfitId: string): Promise<void> {
  //   axios
  //   .get(`${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}outfits/${outfitId}`)
  //   .then((response) => {
  //   const outfit = plainToInstance(OutfitModel, response.data as OutfitDto);
   
  //   // Find the index of the outfit with the same id
  //   let outfitIndex = outfits.findIndex((o) => o.id === outfitId);
    
  //   if (outfitIndex !== -1) {
  //     // If the outfit already exists, then replace it
  //     outfits[outfitIndex] = outfit;
  //   } else {
  //     // If the outfit does not exist, append to the list
  //     outfits.push(outfit);
  //   }
    
  //   console.log(outfits);
  //   setOutfits([...outfits]);
  //   setInitialOutfits([...outfits]);
  //   setLoading(false);
  //   })
  //   .catch((err) => {
  //     setError(err.message);
  //     setLoading(false);
  //   });
  // }
   

  const paginatedOutfits = outfits.slice(
    currentPage * OUTFITS_PER_PAGE,
    (currentPage + 1) * OUTFITS_PER_PAGE
  );

  const goToNextPage = () => {
    if ((currentPage + 1) * OUTFITS_PER_PAGE < outfits.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePress = (outfit: OutfitModel) => {
    setSelectedOutfit(outfit);
  };

  const handleItemClose = () => {
    setSelectedOutfit(null);
  };

  const updateOutfit = async () => {}
  const deleteOutfit = async (outfit: OutfitModel) => {}

  // const updateOutfit = async (
  //   outfitToUpdate: OutfitModel,
  //   name: string,
  //   nameTags: NameTagModel[],
  //   kvpTags: KvpTagModel[]
  // ) => {
  //   const tagsResponse = await axios.post(
  //     `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${outfitToUpdate.id}/tags`,
  //     plainToClass(CreateItemTagsDto, {
  //       nameTags: nameTags.filter((nameTag) => nameTag.name !== ""),
  //       kvpTags: kvpTags.filter(
  //         (kvpTag) => kvpTag.key !== "" && kvpTag.value !== ""
  //       ),
  //     })
  //   );
  //   axios
  //     .get(
  //       `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${outfitToUpdate.id}`
  //     )
  //     .then((response) => {
  //       const updatedItem = plainToInstance(
  //         OutfitModel,
  //         response.data as OutfitDto
  //       );
  //       const updatedItems = outfits.map((item) => {
  //         if (item.id === updatedItem.id) {
  //           return updatedItem;
  //         }
  //         return item;
  //       });
  //       setOutfits(updatedItems);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // };

  // const deleteOutfit = async (deletedItem: OutfitModel) => {
  //   const deleteResponse = await axios.delete(
  //     `${Constants.expoConfig.extra.env.EXPO_PUBLIC_API_URL}items/${deletedItem.id}`
  //   );
  //   setOutfits(outfits.filter((item) => item.id !== deletedItem.id));
  //   setCurrentPage(0);
  // };

  const handleHoverIn = (outfitId) => {
    setHoveredOutfitId(outfitId);
  };

  const handleHoverOut = () => {
    setHoveredOutfitId(null);
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
      {selectedOutfit === null ? (
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
              {searchBlobs.map((outfit, index) => (
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
                    <Text>{outfit}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.gridContainer}>
            <View style={styles.grid}>
              {paginatedOutfits.map((outfit, index) => (
                <Pressable
                  key={index}
                  onPress={() => handlePress(outfit)}
                  onHoverIn={() => handleHoverIn(outfit.id)}
                  onHoverOut={handleHoverOut}
                >
                  <Image
                    source={{ uri: outfit.outfitPhotos.length > 0 ? outfit.outfitPhotos[0].url : SAMPLE_OUTFIT }}
                    style={styles.image}
                  />
                  {hoveredOutfitId === outfit.id && (
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{outfit.name}</Text>
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
              disabled={(currentPage + 1) * OUTFITS_PER_PAGE >= outfits.length}
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
          <OutfitManagementScreen
            outfit={selectedOutfit}
            updateOutfit={updateOutfit}
            deleteOutfit={deleteOutfit}
            // reloadOutfit={reloadOutfit}
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

export default OutfitBrowserScreen;
