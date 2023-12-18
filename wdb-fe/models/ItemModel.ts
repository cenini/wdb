import * as ImagePicker from "expo-image-picker";
import { KvpTagModel, NameTagModel } from "./TagModel";
import { ImageModel } from "./ImageModel";

export class NewItemModel {
  image: ImageModel;
  nameTags: NameTagModel[];
  kvpTags: KvpTagModel[];
}
