import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { KvpTagModel, NameTagModel } from "../models/TagModel";
import { TagModel } from "../models/ItemModel";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { plainToInstance } from "class-transformer";
import Button from "./Button";
import { AntDesign } from "@expo/vector-icons";
import { ButtonStyles } from "./Styles";

// export default function TagEditor({
//   nameTags,
//   setNameTags,
//   kvpTags,
//   setKvpTags,
//   nameTagSuggestions,
//   onAcceptAllTags,
//   onRejectAllTags,
//   onAcceptSuggestedNameTag,
//   kvpTagSuggestions,
//   onAcceptSuggestedKvpTag,
// }: {
//   nameTags: NameTagModel[];
//   kvpTags: KvpTagModel[];
//   setNameTags: React.Dispatch<React.SetStateAction<NameTagModel[]>>;
//   setKvpTags: React.Dispatch<React.SetStateAction<KvpTagModel[]>>;
//   nameTagSuggestions: NameTagModel[];
//   kvpTagSuggestions: KvpTagModel[];
//   onAcceptAllTags: (event: GestureResponderEvent) => void;
//   onRejectAllTags: (event: GestureResponderEvent) => void;
//   onAcceptSuggestedNameTag: (nameTag: NameTagModel) => void;
//   onAcceptSuggestedKvpTag: (kvpTag: KvpTagModel) => void;
// }) {
export default function TagEditor({
  nameTags,
  setNameTags,
  kvpTags,
  setKvpTags,
  nameTagSuggestions,
  onAcceptAllTags,
  onRejectAllTags,
  onAcceptSuggestedNameTag,
  kvpTagSuggestions,
  onAcceptSuggestedKvpTag,
}) {
  const handleAddNameTag = () => {
    if (nameTags.find((tag) => tag.name === "")) return;
    setNameTags([plainToInstance(NameTagModel, { name: "" }), ...nameTags]);
  };

  const handleAddKvpTag = () => {
    if (kvpTags.find((tag) => tag.key === "" && tag.value === "")) return;
    setKvpTags([
      plainToInstance(KvpTagModel, { key: "", value: "" }),
      ...kvpTags,
    ]);
  };

  const handleNameTagChange = (index, newName) => {
    const updatedTags = [...nameTags];
    updatedTags[index].name = newName;
    setNameTags(updatedTags);
    // console.log(`number of nametags: ${nameTags.length}`)
  };

  const handleKvpTagChange = (index, newKey, newValue) => {
    const updatedTags = [...kvpTags];
    // console.log(`index: ${index} new key: ${newKey} new value: ${newValue}`);
    updatedTags[index].key = newKey;
    updatedTags[index].value = newValue;
    setKvpTags(updatedTags);
    // console.log(`number of kvptags: ${kvpTags.length}`)
  };

  const handleAcceptSuggestedNameTag = (nameTag) => {
    setNameTags([...nameTags, { ...nameTag }]);
    onAcceptSuggestedNameTag(nameTag);
    // console.log(`number of nametags: ${nameTags.length}`)
  };

  const handleAcceptSuggestedKvpTag = (kvpTag) => {
    setKvpTags([...kvpTags, { ...kvpTag }]);
    onAcceptSuggestedKvpTag(kvpTag);
    // console.log(`number of kvptags: ${kvpTags.length}`)
  };

  const handleAcceptAllTags = () => {
    console.log(nameTagSuggestions);
    console.log(kvpTagSuggestions);
    onAcceptAllTags(null);
    // console.log(`number of nametags: ${nameTags.length}`)
  };

  const handleRejectNameTag = (nameTag) => {
    setNameTags(
      nameTags.filter(
        (existingNameTag) => existingNameTag.name !== nameTag.name
      )
    );
  };

  const handleRejectKvpTag = (kvpTag) => {
    setKvpTags((kvpTags) =>
      kvpTags.filter(
        (existingKvpTag) =>
          existingKvpTag.key !== kvpTag.key &&
          existingKvpTag.value !== kvpTag.value
      )
    );
  };

  const handleRejectAllTags = () => {
    onRejectAllTags(null);
    // console.log(`number of kvptags: ${kvpTags.length}`)
  };

  const mergedTags = [
    ...nameTags.map((tag) => ({ ...tag, type: "name" })),
    ...kvpTags.map((tag) => ({ ...tag, type: "kvp" })),
    ...nameTagSuggestions.map((tag) => ({ ...tag, type: "suggestedName" })),
    ...kvpTagSuggestions.map((tag) => ({ ...tag, type: "suggestedKvp" })),
  ];

  const acceptedTags = mergedTags.filter(
    (tag) => tag.type === "name" || tag.type === "kvp"
  );
  const suggestedTags = mergedTags.filter(
    (tag) => tag.type === "suggestedName" || tag.type === "suggestedKvp"
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          style={{
            ...ButtonStyles.buttonSmall,
            ...ButtonStyles.buttonPrimaryColor,
            ...{ margin: 4 },
          }}
          onPress={handleAddNameTag}
          label={""}
          icon={<AntDesign name="right" size={24} color="black" />}
        />
        <Button
          style={{
            ...ButtonStyles.buttonSmall,
            ...ButtonStyles.buttonPrimaryColor,
            ...{ margin: 4 },
          }}
          onPress={handleAddKvpTag}
          label={""}
          icon={<AntDesign name="doubleright" size={24} color="black" />}
        />
      </View>
      <FlatList
        data={acceptedTags}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tag}>
            <TextInput
              style={styles.editableInput}
              placeholder="name"
              value={item.type === "kvp" ? item.key : item.name ?? ""}
              onChangeText={(newText) =>
                item.type === "name"
                  ? handleNameTagChange(index, newText)
                  : handleKvpTagChange(
                      index - nameTags.length,
                      newText,
                      item.value
                    )
              }
            />
            {item.type === "kvp" && (
              <TextInput
                style={styles.editableInput}
                placeholder="value"
                value={item.value}
                onChangeText={(newText) =>
                  handleKvpTagChange(index - nameTags.length, item.key, newText)
                }
              />
            )}
            <Button
              onPress={() =>
                item.type === "name"
                  ? handleRejectNameTag(item)
                  : handleRejectKvpTag(item)
              }
              style={{
                ...ButtonStyles.buttonPrimaryColor,
                ...{ width: 60, height: 40 },
              }}
              label={""}
              icon={<AntDesign name="minuscircleo" size={24} color="black" />}
            />
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleAcceptAllTags} style={styles.arrowStyle}>
          <FontAwesome name="arrow-up" size={18} color="#25292e" />
        </Pressable>
        <Pressable onPress={handleRejectAllTags} style={styles.arrowStyle}>
          <FontAwesome name="arrow-down" size={18} color="#25292e" />
        </Pressable>
      </View>
      <FlatList
        data={suggestedTags}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tag}>
            <TextInput
              style={styles.editableInput}
              value={item.type === "suggestedKvp" ? item.key : item.name ?? ""}
              editable={false}
              onChangeText={(newText) =>
                item.type === "suggestedName"
                  ? handleNameTagChange(index, newText)
                  : handleKvpTagChange(index, newText, item.value)
              }
            />
            {item.type === "suggestedKvp" && (
              <TextInput
                style={styles.editableInput}
                value={item.value}
                editable={false}
                onChangeText={(newText) =>
                  handleKvpTagChange(index, item.key, newText)
                }
              />
            )}
            <Button
              style={{
                ...ButtonStyles.buttonPrimaryColor,
                ...{ width: 60, height: 40 },
              }}
              onPress={() =>
                item.type === "suggestedName"
                  ? handleAcceptSuggestedNameTag(item)
                  : handleAcceptSuggestedKvpTag(item)
              }
              label={""}
              icon={<AntDesign name="pluscircleo" size={24} color="black" />}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonContainer: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  arrowStyle: {
    margin: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginVertical: 4,
    borderRadius: 5,
  },
  editableInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
  },
  checkmark: {
    fontSize: 20,
    color: "green",
  },
});
