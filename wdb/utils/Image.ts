import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";

export async function Resize(
  image: ImagePicker.ImagePickerAsset,
  maxSize: number
) {
  const resizeOptions =
    image.width > image.height ? { width: maxSize } : { height: maxSize };
  const manipulationResult = await manipulateAsync(
    image.uri,
    [{ resize: resizeOptions }],
    { compress: 0.8, format: SaveFormat.JPEG, base64: true }
  );
  return manipulationResult;
}
