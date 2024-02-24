import { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, View, Text, Image } from "react-native";
import { NewItemsContext } from "./AppScreen";
import { AuthContext } from "../App";
import { plainToInstance } from "class-transformer";
import { ImageModel } from "../models/ImageModel";
import Button from "./Button";
import { ButtonStyles, CommonStyles } from "./Styles";
import { MAX_IMAGE_SIZE_IN_PX } from "../utils/Constants";
import { Resize } from "../utils/Image";

export default function HomeScreen({ navigation }) {
  const { addImages } = useContext(NewItemsContext);
  const { userToken } = useContext(AuthContext);

  const pickImageAsync = async () => {
    if (userToken == null) {
      navigation.navigate("Login");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 10,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0,
      base64: true,
    });

    if (result.canceled) {
      return;
    }

    const images = await Promise.all(
      result.assets.map((image) =>
        plainToInstance(ImageModel, Resize(image, MAX_IMAGE_SIZE_IN_PX))
      )
    );

    await addImages(images);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Make your wardrobe
          {"\n"}
          make sense
        </Text>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.heroImageContainer}>
          <Image
            source={require("../assets/images/hero.webp")}
            style={styles.heroImage}
          />
        </View>
        <Text style={styles.mainText}>Some main text here</Text>
        <Text style={styles.featureText}>* Smart organization</Text>
        <Text style={styles.featureText}>* Personal AI stylist</Text>
        <Text style={styles.featureText}>* ...</Text>
      </View>
      <View style={styles.footerContainer}>
        <Button
          symbol="picture-o"
          label="Add some images"
          onPress={pickImageAsync}
          style={{
            ...ButtonStyles.buttonLarge,
            ...ButtonStyles.buttonPrimaryColor,
            ...{ margin: 10 },
          }}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CommonStyles.view.backgroundColor,
    alignItems: "center",
    justifyContent: "flex-start", // Start aligning items from the top
  },
  headerContainer: {
    flex: 0.75,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    color: "#fff",
    // fontFamily: "Your-Font-Family",
  },
  mainContainer: {
    flex: 2.5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  heroImageContainer: {
    width: "90%", // Keep width as is
    height: 350, // Increased height for more prominence
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000", // Adding shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mainText: {
    fontWeight: "normal",
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
    // fontFamily: "Your-Font-Family",
  },
  featureText: {
    fontWeight: "normal",
    fontSize: 18,
    textAlign: "left",
    color: "#fff",
    // fontFamily: "Your-Font-Family",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 0.75,
    alignItems: "center",
  },
});
