import { TagModel, TagType } from "../models/ItemModel";
import { KvpTagModel, NameTagModel } from "../models/TagModel";

export function TagModelToTypedTagModel(
  tagModel: TagModel
): NameTagModel | KvpTagModel {
  if (tagModel.type === TagType.NAME) {
    const nameTagModel = new NameTagModel();
    nameTagModel.name = tagModel.name;
    return nameTagModel;
  } else if (tagModel.type === TagType.KEY_VALUE) {
    const kvpTagModel = new KvpTagModel();
    kvpTagModel.key = tagModel.key;
    kvpTagModel.value = tagModel.value;
  }
  throw new Error("Argument needs to have type NAME or KEY_VALUE");
}

export function ExtractNameTagModelsFromTagModels(
  tagModels: TagModel[]
): NameTagModel[] {
  console.log(tagModels);
  const retval = tagModels
    .filter((tag) => tag.name !== null)
    .map((tag) => {
      const nameTagModel = new NameTagModel();
      nameTagModel.name = tag.name;
      console.log(nameTagModel);
      return nameTagModel;
    });
  console.log(retval);
  return retval;
}

export function ExtractKvpTagModelsFromTagModels(
  tagModels: TagModel[]
): KvpTagModel[] {
  console.log(tagModels);
  const retval = tagModels
    .filter((tag) => tag.key !== null)
    .map((tag) => {
      const kvpTagModel = new KvpTagModel();
      kvpTagModel.key = tag.key;
      kvpTagModel.value = tag.value;
      return kvpTagModel;
    });
  console.log(retval);
  return retval;
}
