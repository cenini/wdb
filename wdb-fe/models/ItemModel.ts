import * as ImagePicker from "expo-image-picker";
import { KvpTagModel, NameTagModel } from "./TagModel";
import { ImageModel } from "./ImageModel";

export class NewItemModel {
  image: ImageModel;
  nameTags: NameTagModel[];
  kvpTags: KvpTagModel[];
}

export class ItemModel {
  id: string;
  ownerId: number;
  createdAt: Date;
  title: string;
  updatedAt: Date | null;
  photos: PhotoModel[];
  tags: TagModel[];
}

export class PhotoModel {
  id: string;
  url: string;
  itemId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class TagModel {
  id: number;
  type: TagType;
  name: string | null;
  key: string | null;
  value: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export enum TagType {
  NAME,
  KEY_VALUE,
}
