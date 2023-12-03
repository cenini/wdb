import * as ImagePicker from "expo-image-picker";
import { KvpTagModel, NameTagModel } from "./TagModel";

export class ItemModel {
  image: ImagePicker.ImagePickerAsset;
  nameTags: NameTagModel[];
  kvpTags: KvpTagModel[];
}
