import * as ImagePicker from "expo-image-picker";
import { TagModel } from "./TagModel";

export class ItemModel {
  image: ImagePicker.ImagePickerAsset;
  tags: TagModel[];
}
