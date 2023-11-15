import { useContext, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, View} from "react-native";
import ImageViewer from './ImageViewer';
import PhotoButton from './PhotoButton';
import Button from './Button';
import { AuthContext } from '../App';

const PlaceholderImage = require("../assets/images/background-image.png");

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { logout } = useContext(AuthContext);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 10,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,

    });

    if (!result.canceled) {
      console.log(result);
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
      </View>
      <View style={styles.footerContainer}>
        <PhotoButton theme="primary" label="Choose a photo" onPress={pickImageAsync} />
        {/* <Button label="Use this photo" /> */}
      </View>
      <Button label="Logout" theme="primary" onPress={async () => await logout()} />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
