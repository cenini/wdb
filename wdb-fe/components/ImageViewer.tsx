import { StyleSheet, Image } from 'react-native';

export default function ImageViewer({ selectedImage }) {
  console.log(selectedImage)
  return <Image source={selectedImage.image.uri} style={styles.image} />;
}


const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
